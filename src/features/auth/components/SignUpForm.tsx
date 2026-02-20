'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components//ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signupSchema, SignupSchema } from '../schemas/SignupSchema';
import { signUp } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    },
  });

  const router = useRouter();

  async function onsubmit(signupDetails: SignupSchema) {
    const res = await signUp.email({
      email: signupDetails.email,
      name: signupDetails.name,
      password: signupDetails.password,
    });

    if (res.error) {
      toast.error(res.error.message || 'Something went wrong.');
    } else {
      router.replace('/onboarding');
    }
  }

  const isSigningUp = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='john doe'
                  type='text'
                  {...field}
                  disabled={isSigningUp}
                  className='py-4 shadow-none placeholder:text-sm'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='johndoe@gmail.com'
                  type='email'
                  {...field}
                  disabled={isSigningUp}
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
                <div className='relative'>
                  <Input
                    placeholder='********'
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    disabled={isSigningUp}
                    className='py-4 pr-10 shadow-none placeholder:text-sm'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSigningUp}
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
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    placeholder='********'
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...field}
                    disabled={isSigningUp}
                    className='py-4 pr-10 shadow-none placeholder:text-sm'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSigningUp}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {showConfirmPassword ? (
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
        <Button type='submit' className='w-full' disabled={isSigningUp}>
          {isSigningUp ? (
            <Spinner className='text-white' />
          ) : (
            <span> Sign up</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
