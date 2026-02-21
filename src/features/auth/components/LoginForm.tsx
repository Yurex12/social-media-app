'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Spinner } from '@/components/ui/spinner';
import { signIn } from '@/lib/auth-client';
import { ErrorContext } from 'better-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginSchema, loginSchema } from '../schemas/LoginSchema';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: 'johndoe@gmail.com',
      password: '12345678',
      rememberMe: true,
    },
  });

  async function handleSuccess() {
    toast.success('Login successful.');
    router.replace('/home');
    form.reset();
  }

  async function handleError(ctx: ErrorContext) {
    toast.error(ctx.error.message || 'Something went wrong');
  }

  async function onsubmit({ identifier, password, rememberMe }: LoginSchema) {
    const identifierType = identifier.includes('@') ? 'email' : 'username';

    if (identifierType === 'email') {
      await signIn.email({
        email: identifier,
        password,
        rememberMe,
        fetchOptions: {
          onSuccess: handleSuccess,
          onError: handleError,
        },
      });
    }

    if (identifierType === 'username') {
      await signIn.username({
        username: identifier,
        password,
        rememberMe,
        fetchOptions: {
          onSuccess: handleSuccess,
          onError: handleError,
        },
      });
    }
  }

  const isLoginIn = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='identifier'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email or username</FormLabel>
              <FormControl>
                <Input
                  placeholder='johndoe@gmail.com'
                  type='text'
                  {...field}
                  disabled={isLoginIn}
                  className='py-5 shadow-none placeholder:text-sm'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    placeholder='********'
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    disabled={isLoginIn}
                    className='py-5 pr-10 shadow-none placeholder:text-sm'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoginIn}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='rememberMe'
          render={({ field }) => (
            <FormItem className='flex items-center space-x-2 space-y-0'>
              <FormControl>
                <Checkbox
                  id='rememberMe'
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  onBlur={field.onBlur}
                  disabled={isLoginIn}
                  className='shadow-none dark:text-foreground'
                />
              </FormControl>
              <FormLabel htmlFor='rememberMe' className='cursor-pointer'>
                Remember me
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={isLoginIn}>
          {isLoginIn ? <Spinner className='text-white' /> : <span> Login</span>}
        </Button>
      </form>
    </Form>
  );
}
