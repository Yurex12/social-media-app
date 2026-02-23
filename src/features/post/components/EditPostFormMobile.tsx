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
import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { ImagePreviews } from './ImagePreviews';

import { BackButton } from '@/components/BackButton';
import { PostEntity } from '@/entities/postEntity';
import { useSession } from '@/lib/auth-client';
import { useEditPost } from '../hooks/useEditPost';
import { postEditSchema, type PostEditSchema } from '../schema';
import { Header } from '@/components/Header';

export function EditPostFormMobile({ post }: { post: PostEntity }) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { editPost, isPending: isUpdating } = useEditPost();
  const { data: session } = useSession();

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

  const isEditing = form.formState.isSubmitting || isUpdating;
  const isValid = form.formState.isValid;

  function handleImageSelect(
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<PostEditSchema, 'images'>,
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

  function removeImage(idx: number) {
    const newImgs = [...images];
    newImgs.splice(idx, 1);
    form.setValue('images', newImgs, { shouldValidate: true });
  }

  async function onSubmit(values: PostEditSchema) {
    if (!post) return;

    editPost(
      {
        postId: post.id,
        values,
        existingImages: post.images,
      },
      { onSuccess: () => router.push('/home') },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col'>
        <Header className='justify-between px-2'>
          <BackButton />

          <Button
            type='submit'
            disabled={
              isEditing || (!content.trim() && !images.length) || !isValid
            }
            className='w-18 rounded-full'
          >
            {isUpdating ? <Spinner className='text-white' /> : 'Edit'}
          </Button>
        </Header>

        <div className='flex-1 overflow-y-auto p-4 flex gap-3'>
          <UserAvatar image={session?.user.image} name={session?.user.name} />
          <div className='flex-1 flex flex-col'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Edit post...'
                      className='min-h-10 bg-transparent dark:bg-transparent resize-none border-none p-0 shadow-none focus-visible:ring-0'
                      autoFocus
                      onFocus={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                        const length = e.target.value.length;
                        e.target.setSelectionRange(length, length);
                      }}
                      onChange={(e) => {
                        field.onChange(e);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <ImagePreviews
              disabled={isEditing}
              images={images}
              removeImage={removeImage}
            />
          </div>
        </div>

        {/* Footer */}
        <div className='border-t px-4 py-2 sticky bottom-0 z-10 bg-background'>
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
                      disabled={isEditing || images.length >= 2}
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
