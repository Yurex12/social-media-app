'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useRef } from 'react';
import { ControllerRenderProps, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

import { BackButton } from '@/components/BackButton';
import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { User } from '@/lib/auth';
import { useCreatePost } from '../hooks/useCreatePost';
import { postSchema, type PostSchema } from '../schema';
import { ImagePreviews } from './ImagePreviews';

export function CreatePostFormMobile({ user }: { user: User }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createPost, isPending: isCreating } = useCreatePost();

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
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col'>
        <div className='sticky top-0 z-30 h-15 w-full bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-4'>
          <BackButton />

          <Button
            type='submit'
            size='sm'
            className='rounded-full w-18'
            disabled={
              (!content.trim() && !images.length) || isPosting || !isValid
            }
          >
            {isPosting ? <Spinner className='text-white' /> : 'Post'}
          </Button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 flex gap-3'>
          <UserAvatar image={user.image} name={user.name} />

          <div className='flex-1 flex flex-col'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='What’s happening?'
                      className='min-h-40 max-h-80 overflow-y-scroll dark:bg-transparent resize-none border-none p-0 shadow-none focus-visible:ring-0'
                      disabled={isPosting}
                      autoFocus
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
                form.setValue('images', newImgs, { shouldValidate: true });
              }}
              disabled={isPosting}
            />
          </div>
        </div>

        <div className='border-t bg-background px-4 py-2'>
          <div className='px-1 pb-2'>
            {form.formState.errors.content && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='flex items-center'>
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
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
