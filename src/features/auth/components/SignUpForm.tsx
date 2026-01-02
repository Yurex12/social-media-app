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

export function SignupForm() {
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      //   email: 'yusuf@gmail.com',
      //   password: 'Adeyemi@17',
      //   name: 'Ekungomi yusuf',
      //   confirmPassword: 'Adeyemi@17',
    },
  });

  async function onSubmit(signupDetails: SignupSchema) {
    console.log(signupDetails);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
