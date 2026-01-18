'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizonal } from 'lucide-react';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { CommentFormValues, commentSchema } from '../schema';
import { User } from '@/lib/auth';

// interface CommentInputBarProps {
//   user: {
//     image?: string | null;
//     name?: string | null;
//   };
//   onSubmit: (values: CommentFormValues) => void;
//   isSubmitting?: boolean;
// }

export function CommentInputBar({ user }: { user: User }) {
  const form = useForm<CommentFormValues>({
    mode: 'onChange',
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const handleSubmit = (values: CommentFormValues) => {
    console.log(values);
    form.reset();
  };

  const isSubmitting = form.formState.isSubmitting;

  const isValid = form.formState.isValid;

  const content = useWatch({
    control: form.control,
    name: 'content',
  });

  return (
    <div className='border border-foreground/30 rounded-sm bg-background backdrop-blur-md w-full max-w-140 mx-auto'>
      <div className='mx-auto max-w-140 px-4 py-3'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex gap-3'
          >
            {/* User Avatar */}
            <div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-muted mb-1'>
              <Image
                src={user?.image || '/avatar-placeholder.png'}
                alt={user?.name || 'User'}
                fill
                className='object-cover'
              />
            </div>

            {/* Input Area */}
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Post your reply'
                      className='min-h-20 max-h-40 h-auto resize-none border-none bg-muted/50 focus-visible:ring-0 focus-visible:ring-ring py-2.5 px-3 leading-tight shadow-none'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(handleSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type='submit'
              size='icon'
              disabled={isSubmitting || !content.trim().length || !isValid}
              className='shrink-0 mb-1 rounded-full h-9 w-9'
            >
              <SendHorizonal className='h-4 w-4' />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
