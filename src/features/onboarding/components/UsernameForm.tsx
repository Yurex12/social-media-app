'use client';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useForm } from 'react-hook-form';
import { usernameSchema, UsernameSchema } from '../schemas/usernameSchema';
import { CurrentUsername } from './CurrentUsername';
import { SuggestedUsernames } from './SuggestedUsernames';

export function UsernameForm({
  currentUsername,
  usernameSuggestions,
}: {
  currentUsername: string;
  usernameSuggestions: string[];
}) {
  const form = useForm<UsernameSchema>({
    resolver: zodResolver(usernameSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  });

  function handleSelectUsername(suggestion: string) {
    form.setValue('username', suggestion);
    form.trigger('username');

    console.log(suggestion);
  }

  async function onSubmit({ username }: UsernameSchema) {
    console.log(username);
  }
  return (
    <CardContent className='space-y-6'>
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
                      className='pr-10 pl-8'
                    />
                    {/* {statusIcon && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {statusIcon}
                      </div>
                    )} */}
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <SuggestedUsernames
            onSelectUsername={handleSelectUsername}
            suggestions={usernameSuggestions}
          />

          <Button
            type='submit'
            className='w-full bg-linear-to-r from-blue-500 via-blue-600 to-indigo-700 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:from-blue-600 hover:via-blue-700 hover:to-indigo-800 hover:shadow-2xl disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-500 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-lg'
          >
            Update Username
          </Button>
          {/* {form.formState.isSubmitting ? (
                <Spinner  />
              ) : (
                "Update Username"
              )}
            </Button> */}
        </form>
      </Form>
    </CardContent>
  );
}
