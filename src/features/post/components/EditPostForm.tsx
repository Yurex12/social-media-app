'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import { ControllerRenderProps, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { ImagePreviews } from './ImagePreviews';

import { postEditSchema, type PostEditSchema } from '../schema';

import { usePost } from '../PostProvider';

import { useSession } from '@/lib/auth-client';
import { useEditPost } from '../hooks/useEditPost';

export function EditPostForm({ onClose }: { onClose: VoidFunction }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { editPost, isPending: isEditing } = useEditPost();

  const { post } = usePost();

  const session = useSession();

  const form = useForm<PostEditSchema>({
    resolver: zodResolver(postEditSchema),
    mode: 'onChange',
    defaultValues: {
      content: post?.content || '',
      images: post?.images || [],
    },
  });

  const images = useWatch({ control: form.control, name: 'images' });
  const content = useWatch({ control: form.control, name: 'content' });
  const isUpdating = form.formState.isSubmitting || isEditing;
  const isValid = form.formState.isValid;

  function handleImageSelect(
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<PostEditSchema, 'images'>,
  ) {
    const files = e.target.files;
    const prevImages = form.getValues('images');

    if (!files) {
      field.onChange([]);
      return;
    }

    if (files.length > 2) {
      toast.error('Please choose up to 2 images');
      return;
    }

    field.onChange([...prevImages, ...files].slice(0, 2));

    e.target.value = '';
  }

  function removeImage(id: number) {
    const newImgs = [...images];
    newImgs.splice(id, 1);
    form.setValue('images', newImgs);

    // form.trigger();
  }

  async function onSubmit(values: PostEditSchema) {
    editPost(
      {
        postId: post.id,
        values: values,
        existingImages: post.images,
      },
      {
        onSuccess() {
          onClose();
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='flex gap-3'>
          <UserAvatar
            image={session.data?.user.image}
            name={session.data?.user.name}
            isPending={session.isPending}
          />
          <div className='flex-1'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      className='max-h-[40vh] min-h-5 resize-none border-none bg-transparent shadow-none focus-visible:ring-0 overflow-y-auto text-foreground/75 dark:bg-transparent'
                      placeholder='Edit your post...'
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

            <ImagePreviews
              images={images}
              removeImage={removeImage}
              disabled={form.formState.isSubmitting}
            />

            <div className='flex justify-between items-center border-t pt-2 mt-2'>
              <FormField
                control={form.control}
                name='images'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex items-center gap-1'>
                        <input
                          ref={fileInputRef}
                          type='file'
                          accept='image/*'
                          multiple
                          hidden
                          onChange={(e) => {
                            handleImageSelect(e, field);
                          }}
                        />

                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='text-primary hover:bg-primary/5 hover:text-primary/90'
                          onClick={() => fileInputRef.current?.click()}
                          disabled={images.length >= 2 || isUpdating}
                        >
                          <ImageIcon className='size-6' />
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex gap-2'>
                <Button
                  type='submit'
                  disabled={
                    isUpdating ||
                    (!content.trim() && !images.length) ||
                    !isValid
                  }
                  size='sm'
                  className='w-18 rounded-full'
                >
                  {isUpdating ? <Spinner /> : 'Edit'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
