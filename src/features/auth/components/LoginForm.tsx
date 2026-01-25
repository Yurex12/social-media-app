'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components//ui/button';
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
import { toast } from 'react-hot-toast';
import { LoginSchema, loginSchema } from '../schemas/LoginSchema';

export function LoginForm() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: 'yusuf2@gmail.com',
      password: 'Adeyemi@17',
      rememberMe: false,
    },
  });

  const router = useRouter();

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
                  className='py-4 shadow-none placeholder:text-sm'
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
                <Input
                  placeholder='********'
                  type='password'
                  {...field}
                  disabled={isLoginIn}
                  className='py-4 shadow-none placeholder:text-sm'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='rememberMe'
          render={({ field }) => (
            <FormItem className='flex items-center'>
              <FormControl>
                <Checkbox
                  id='rememberMe'
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  onBlur={field.onBlur}
                  disabled={isLoginIn}
                  className='shadow-none'
                />
              </FormControl>
              <FormLabel htmlFor='rememberMe'>Remember me</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={isLoginIn}>
          {isLoginIn ? <Spinner /> : <span> Login</span>}
        </Button>
      </form>
    </Form>
  );
}
