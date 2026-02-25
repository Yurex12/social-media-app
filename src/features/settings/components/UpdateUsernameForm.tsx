'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from 'use-debounce';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { CurrentUsername } from './CurrentUsername';

import { isUsernameAvailable, updateUser, useSession } from '@/lib/auth-client';

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { UsernameFormProps } from '../types';
import { UsernameFormValues, usernameSchema } from '../schema';
import { SuggestedUsernames } from './SuggestedUsernames';

export function UpdateUsernameForm({
  currentUsername,
  usernameSuggestions,
  showSkip = false,
  redirectUrl,
  className,
}: UsernameFormProps) {
  const router = useRouter();
  const session = useSession();

  const [availability, setAvailability] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle');

  const form = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    mode: 'onChange',
    defaultValues: { username: '' },
  });

  const watchedUsername = useWatch({
    control: form.control,
    name: 'username',
  });

  const [debouncedUsername] = useDebounce(watchedUsername, 500);

  const isValid = form.formState.isValid;

  const shouldCheck = debouncedUsername.length >= 4;

  const displayStatus = !shouldCheck ? 'idle' : availability;

  useEffect(() => {
    if (!shouldCheck) {
      return;
    }

    async function checkAvailability() {
      setAvailability('checking');
      try {
        const { data: response } = await isUsernameAvailable({
          username: debouncedUsername,
        });

        if (response?.available) {
          setAvailability('available');
        } else {
          setAvailability('taken');
        }
      } catch {
        setAvailability('idle');
      }
    }

    checkAvailability();
  }, [debouncedUsername, currentUsername, shouldCheck]);

  function handleSelectUsername(suggestion: string) {
    form.setValue('username', suggestion);
    form.trigger('username');
  }

  async function onSubmit({ username }: UsernameFormValues) {
    if (username.toLowerCase() === currentUsername?.toLowerCase()) {
      toast.error("That's already your current username!");
      return;
    }

    if (displayStatus !== 'available') {
      toast.error('Please wait for username availability check');
      return;
    }

    const { error } = await updateUser({
      username: username.toLowerCase(),
      displayUsername: username,
    });

    if (error) {
      toast.error(error.message || 'Failed to update username');
      return;
    }

    await session.refetch();
    toast.success('Username updated successfully!');
    if (redirectUrl) router.replace(redirectUrl);
  }

  const isUpdating = form.formState.isSubmitting;

  return (
    <CardContent className={cn('space-y-6', className)}>
      <CurrentUsername username={currentUsername} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <Label>New Username</Label>
                <FormControl>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                      <span className='text-sm text-gray-500'>@</span>
                    </div>
                    <Input
                      placeholder='your_username'
                      {...field}
                      className={`pr-10 pl-8 transition-colors`}
                      disabled={isUpdating}
                    />

                    <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                      {displayStatus === 'checking' && (
                        <Loader2 className='h-4 w-4 animate-spin text-gray-400' />
                      )}
                      {displayStatus === 'available' && (
                        <CheckCircle2 className='h-4 w-4 text-green-500' />
                      )}
                      {displayStatus === 'taken' && (
                        <XCircle className='h-4 w-4 text-red-500' />
                      )}
                    </div>
                  </div>
                </FormControl>

                {displayStatus === 'taken' && (
                  <p className='text-[0.8rem] font-medium text-red-500'>
                    This username is already taken.
                  </p>
                )}
                {displayStatus === 'available' && (
                  <p className='text-[0.8rem] font-medium text-green-500'>
                    This username is available.
                  </p>
                )}
                {displayStatus === 'checking' && (
                  <p className='text-[0.8rem] font-medium text-muted-foreground'>
                    Checking...
                  </p>
                )}
                {watchedUsername.length > 0 && <FormMessage />}
              </FormItem>
            )}
          />

          <SuggestedUsernames
            onSelectUsername={handleSelectUsername}
            suggestions={usernameSuggestions}
          />

          <div className='space-y-2 pt-2'>
            <Button
              type='submit'
              disabled={
                !isValid ||
                displayStatus !== 'available' ||
                isUpdating ||
                watchedUsername.length === 0
              }
              className='w-full bg-linear-to-r from-blue-500 via-blue-600 to-indigo-700 text-white shadow-md transition-all hover:scale-[1.01] active:scale-100 cursor-pointer'
            >
              {isUpdating ? (
                <Spinner className='text-white' />
              ) : (
                <span>Update Username</span>
              )}
            </Button>

            {showSkip && (
              <Button
                type='button'
                variant='ghost'
                className='w-full text-muted-foreground cursor-pointer'
                onClick={() => router.replace(redirectUrl || '/home')}
                disabled={isUpdating}
              >
                Skip for now
              </Button>
            )}
          </div>
        </form>
      </Form>
    </CardContent>
  );
}
