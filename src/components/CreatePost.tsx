'use client';

import { useRef, useState } from 'react';
import { z } from 'zod';
import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// 1. Define the schema
export const postSchema = z.object({
  content: z.string().min(1, 'Post cannot be empty').max(280),
  images: z.array(z.instanceof(File)).max(2, 'You can upload up to 2 images'),
});

export type PostSchema = z.infer<typeof postSchema>;

export function CreatePost() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);

  // 2. Hook form setup
  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      images: [],
    },
  });

  // 3. Image selection
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remainingSlots = 2 - images.length;
    if (remainingSlots <= 0) return;

    const selected = files.slice(0, remainingSlots);
    setImages((prev) => [...prev, ...selected]);
    form.setValue('images', [...images, ...selected]);
    e.target.value = '';
  }

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    form.setValue('images', updated);
  }

  // 4. Form submission
  function onSubmit(values: PostSchema) {
    console.log('Post submitted', values);
    // handle your API call here
    form.reset();
    setImages([]);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='border mt-2 rounded-xl px-4 py-3 max-w-xl mx-auto'
      >
        <div className='flex gap-3'>
          {/* Profile picture */}
          <img
            className='w-10 h-10 object-cover rounded-full'
            src='/image.png'
            alt='Alex Rivera avatar'
          />

          {/* Input */}
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
                      className='max-h-[50vh] min-h-5 resize-none border-none bg-transparent px-0 text-base shadow-none focus-visible:ring-0 overflow-y-auto'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image previews */}
            {images.length > 0 && (
              <div className='mt-3 grid grid-cols-2 gap-2'>
                {images.map((file, index) => (
                  <div
                    key={index}
                    className='relative aspect-video overflow-hidden rounded-lg bg-muted'
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt='Preview'
                      className='h-full w-full object-cover'
                    />
                    <button
                      type='button'
                      onClick={() => removeImage(index)}
                      className='absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className='mt-3 flex items-center justify-between border-t py-1'>
              <div className='flex items-center gap-1'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  multiple
                  hidden
                  onChange={handleImageSelect}
                />

                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='text-primary hover:bg-primary/10'
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= 2}
                >
                  <ImageIcon className='h-5 w-5' />
                </Button>
              </div>

              <Button type='submit' size='sm' className='rounded-full px-4'>
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
