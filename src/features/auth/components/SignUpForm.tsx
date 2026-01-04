'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function SignupForm() {
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: 'yusuf@gmail.com',
      password: 'Adeyemi@17',
      name: 'Ekungomi yusuf',
      confirmPassword: 'Adeyemi@17',
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
      router.replace('/');
    }
  }

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
                  disabled={form.formState.isSubmitting}
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
                  disabled={form.formState.isSubmitting}
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
                  disabled={form.formState.isSubmitting}
                  className='py-4 shadow-none placeholder:text-sm'
                />
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
                <Input
                  placeholder='********'
                  type='password'
                  {...field}
                  disabled={form.formState.isSubmitting}
                  className='py-4 shadow-none placeholder:text-sm'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          Sign up
        </Button>
      </form>
    </Form>
  );
}
