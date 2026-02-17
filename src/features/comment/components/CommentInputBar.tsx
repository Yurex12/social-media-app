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
import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { useSession } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizonal } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { useCreateComment } from '../hooks/useCreateComment';
import { CommentFormValues, commentSchema } from '../schema';

export function CommentInputBar() {
  const { post } = usePost();
  const { createComment, isPending: isCreating } = useCreateComment();
  const form = useForm<CommentFormValues>({
    mode: 'onChange',
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  async function onSubmit(values: CommentFormValues) {
    createComment(
      { postId: post.id, content: values.content },
      {
        onSuccess() {
          form.reset();
        },
      },
    );
  }

  const isSubmitting = form.formState.isSubmitting || isCreating;

  const isValid = form.formState.isValid;

  const content = useWatch({
    control: form.control,
    name: 'content',
  });

  const user = useSession().data?.user;

  return (
    <div className='border-b sm:border sm:rounded-md w-full max-w-140 mx-auto px-2 sm:px-4 py-3'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-3'>
          <UserAvatar image={user?.image} name={user?.name} />

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
