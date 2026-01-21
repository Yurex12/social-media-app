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

import { usePost } from '@/features/post/PostProvider';
import { User } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { SendHorizonal } from 'lucide-react';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createCommentAction } from '../action';
import { CommentFormValues, commentSchema } from '../schema';

export function CommentInputBar() {
  const { post } = usePost();
  const form = useForm<CommentFormValues>({
    mode: 'onChange',
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const queryClient = useQueryClient();

  async function onSubmit(values: CommentFormValues) {
    const res = await createCommentAction(post.id, values);

    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success(res.message);
      form.reset();
    } else {
      toast.error(res.message);
    }

    console.log(res);
  }

  const isSubmitting = form.formState.isSubmitting;

  const isValid = form.formState.isValid;

  const content = useWatch({
    control: form.control,
    name: 'content',
  });

  return (
    <div className='border rounded-md w-full max-w-140 mx-auto px-4 py-3'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-3'>
          <div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-muted mb-1'>
            <Image
              src={post.user?.image || '/avatar-placeholder.png'}
              alt={post.user?.name || 'User'}
              fill
              className='object-cover'
            />
          </div>

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
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
  );
}
