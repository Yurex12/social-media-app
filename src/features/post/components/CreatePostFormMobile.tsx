'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import { ControllerRenderProps, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

import { ImagePreviews } from './ImagePreviews';
import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { useSession } from '@/lib/auth-client';
import { useCreatePost } from '../hooks/useCreatePost';
import { postSchema, type PostSchema } from '../schema';

export function CreatePostFormMobile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createPost, isPending: isCreating } = useCreatePost();
  const session = useSession();

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    mode: 'onChange',
    defaultValues: {
      content: '',
      images: [],
    },
  });

  const images = useWatch({ control: form.control, name: 'images' });
  const content = useWatch({ control: form.control, name: 'content' });

  const isPosting = form.formState.isSubmitting || isCreating;
  const isValid = form.formState.isValid;

  async function onSubmit(values: PostSchema) {
    createPost(values, {
      onSuccess() {
        form.reset();
        router.push('/home');
      },
    });
  }

  function handleImageSelect(
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<PostSchema, 'images'>,
  ) {
    const files = e.target.files;
    const prevImages = form.getValues('images');
    if (!files) return;
    if (files.length + prevImages.length > 2) {
      toast.error('Please choose up to 2 images');
      return;
    }
    field.onChange([...prevImages, ...Array.from(files)].slice(0, 2));
    e.target.value = '';
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col h-screen bg-background'
      >
        {/* Pinned Header */}
        <div className='flex items-center justify-between px-4 py-2 border-b bg-background'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => router.back()}
            disabled={isPosting}
          >
            Cancel
          </Button>

          <Button
            type='submit'
            size='sm'
            className='rounded-full px-5'
            disabled={
              (!content.trim() && !images.length) || isPosting || !isValid
            }
          >
            {isPosting ? <Spinner /> : 'Post'}
          </Button>
        </div>

        {/* Scrollable Input Area */}
        <div className='flex-1 overflow-y-auto p-4 flex gap-3'>
          <UserAvatar
            image={session.data?.user.image}
            name={session.data?.user.name}
            isPending={session.isPending}
          />

          <div className='flex-1 flex flex-col'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      autoFocus
                      placeholder='What’s happening?'
                      className='min-h-6 bg-transparent dark:bg-transparent resize-none border-none p-0 shadow-none focus-visible:ring-0 text-lg overflow-hidden'
                      disabled={isPosting}
                      onChange={(e) => {
                        field.onChange(e);
                        e.target.style.height = 'inherit';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <ImagePreviews
              images={images}
              removeImage={(id) => {
                const newImgs = [...images];
                newImgs.splice(id, 1);
                form.setValue('images', newImgs);
              }}
              disabled={isPosting}
            />
          </div>
        </div>

        {/* Pinned Footer with Logic for Errors */}
        <div className='border-t bg-background px-4 py-2'>
          <div className='px-1 pb-2'>
            {form.formState.errors.content && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <div className='flex items-center'>
            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        multiple
                        hidden
                        onChange={(e) => handleImageSelect(e, field)}
                      />

                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='text-primary rounded-full'
                        onClick={() => fileInputRef.current?.click()}
                        disabled={images.length >= 2 || isPosting}
                      >
                        <ImageIcon className='size-6' />
                      </Button>
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
