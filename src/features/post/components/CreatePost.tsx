'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import { ControllerRenderProps, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

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

import { ImagePreviews } from './ImagePreviews';

import { uploadImages } from '@/lib/imagekit';
import { createPost } from '../actions';

import { UserAvatar } from '@/components/UserAvatar';
import { ImageUploadResponse } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { postSchema, type PostSchema } from '../schema';

export function CreatePost() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    mode: 'onChange',
    defaultValues: {
      content: '',
      images: [],
    },
  });

  const images = useWatch({
    control: form.control,
    name: 'images',
  });
  const content = useWatch({
    control: form.control,
    name: 'content',
  });

  const isPosting = form.formState.isSubmitting;

  const isValid = form.formState.isValid;

  async function onSubmit(values: PostSchema) {
    if (!values.content.trim() && !values.images.length) {
      toast.error('Please provide either content or at least one image');
      return;
    }

    const toastId = toast.loading('Uploading your post...', {
      duration: Infinity,
    });

    let uploadedImages: ImageUploadResponse[] = [];

    if (values.images.length) {
      const res = await uploadImages(values.images);

      if (!res.success) {
        toast.error('Post could not be uploaded, try again', {
          id: toastId,
          duration: 3000,
        });
        return;
      }

      if (res.success) uploadedImages = res.data;
    }

    const res = await createPost({
      content: content,
      images: uploadedImages,
    });

    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(res.message, {
        id: toastId,
        duration: 3000,
      });
      form.reset();
    } else {
      toast.error(res.message, {
        id: toastId,
        duration: 3000,
      });
    }
  }

  function handleImageSelect(
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<PostSchema, 'images'>,
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
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='border rounded-xl px-4 py-2 max-w-140'
      >
        <div className='flex gap-3'>
          <UserAvatar />

          <div className='flex-1'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='What’s happening?'
                      className='max-h-[50vh] min-h-5 resize-none border-none bg-transparent px-0 shadow-none focus-visible:ring-0 overflow-y-auto text-foreground/75'
                      disabled={isPosting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ImagePreviews
              images={images}
              removeImage={removeImage}
              disabled={isPosting}
            />

            <div className='mt-3 flex items-center gap-2 justify-end border-t py-1'>
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
                          disabled={images.length >= 2 || isPosting}
                        >
                          <ImageIcon className='size-6' />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                size='sm'
                className='rounded-full px-4 w-18'
                disabled={
                  (!content.trim() && !images.length) || isPosting || !isValid
                }
              >
                {isPosting ? <Spinner /> : <span> Post</span>}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
