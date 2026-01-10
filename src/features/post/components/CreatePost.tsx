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
import { ImageIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { postSchema, type PostSchema } from '../schema';
import Image from 'next/image';
import toast from 'react-hot-toast';

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
    if (files.length > 2) {
      toast.error('Please choose up to 2 images');
      return;
    }

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
          <div className='relative w-10 h-10'>
            <Image
              src='/image.png'
              alt='Avatar'
              fill
              className='rounded-full object-cover'
            />
          </div>

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
                    <Image
                      src={URL.createObjectURL(file)}
                      alt='Preview'
                      //   fill
                      className='h-full w-full object-cover absolute'
                      width={100}
                      height={100}
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
            <div className='mt-3 flex items-center gap-2 justify-end border-t py-1'>
              {/* image */}
              <FormField
                control={form.control}
                name='images'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-2 gap-3'>
                      {images.map((file, index) => (
                        <div key={index} className='relative aspect-square'>
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            fill
                            className='rounded-lg border object-cover'
                          />
                          <button
                            type='button'
                            onClick={() =>
                              field.onChange(
                                images.filter((_, i) => i !== index)
                              )
                            }
                            className='absolute top-1 right-1 rounded-full bg-black/50 p-1'
                          >
                            <X className='h-4 w-4 text-white' />
                          </button>
                        </div>
                      ))}

                      {images.length < 4 && (
                        <label className='hover:bg-muted/40 flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed'>
                          <span className='text-2xl font-bold'>+</span>
                          <span className='text-muted-foreground text-sm'>
                            Upload
                          </span>
                          <input
                            type='file'
                            accept='image/png'
                            multiple
                            className='hidden'
                            onChange={(e) => {
                              const newFiles = Array.from(e.target.files || []);
                              field.onChange(
                                [...images, ...newFiles].slice(0, 4)
                              );
                              e.target.value = '';
                            }}
                          />
                        </label>
                      )}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

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
