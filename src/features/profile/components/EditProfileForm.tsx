'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, X, AlertCircle } from 'lucide-react';
import { ChangeEvent, useEffect, useMemo, useRef } from 'react';
import { ControllerRenderProps, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { useSession } from '@/lib/auth-client';
import { editProfileSchema, type EditProfileSchema } from '../schema';
import Image from 'next/image';
import { useEditProfile } from '../hooks/useEditProfile';
import { MAX_FILE_SIZE } from '@/constants';

export function EditProfileForm() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { editProfile, isPending: isEditing } = useEditProfile();
  const session = useSession();

  const form = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: {
      name: session.data?.user.name || '',
      bio: session.data?.user.bio || '',
      image: session.data?.user.image || '',
      coverImage: session.data?.user.coverImage || '',
    },
  });

  const isUpdating = form.formState.isSubmitting || isEditing;
  const isValid = form.formState.isValid;
  const errors = form.formState.errors;

  const imageValue = useWatch({ control: form.control, name: 'image' });
  const coverValue = useWatch({ control: form.control, name: 'coverImage' });

  const previews = useMemo(() => {
    const generateMetadata = (val: File | string | null | undefined) => {
      const isFile = val instanceof File;
      return {
        src: isFile ? URL.createObjectURL(val) : val || '',
        isFile,
        isLarge: isFile ? val.size > MAX_FILE_SIZE : false,
      };
    };

    return {
      profile: generateMetadata(imageValue),
      cover: generateMetadata(coverValue),
    };
  }, [imageValue, coverValue]);

  useEffect(() => {
    return () => {
      if (previews.profile.isFile) URL.revokeObjectURL(previews.profile.src);
      if (previews.cover.isFile) URL.revokeObjectURL(previews.cover.src);
    };
  }, [previews]);

  function handleFileChange(
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<EditProfileSchema, 'image' | 'coverImage'>,
  ) {
    const file = e.target.files?.[0];
    if (file) field.onChange(file);
    e.target.value = '';
  }

  async function onSubmit(values: EditProfileSchema) {
    editProfile({
      ...values,
      imageFileId: session.data?.user.imageFileId ?? null,
      coverImageFileId: session.data?.user.coverImageFileId ?? null,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='rounded-xl py-2'>
        <div className='flex flex-col gap-4'>
          {/* Cover Image Section */}
          <FormField
            control={form.control}
            name='coverImage'
            render={({ field }) => (
              <FormItem className='space-y-0 relative'>
                <FormControl>
                  <div className='relative group'>
                    <div
                      onClick={() => coverInputRef.current?.click()}
                      className='relative h-32 w-full bg-muted rounded-lg overflow-hidden border cursor-pointer'
                    >
                      {previews.cover.src ? (
                        <Image
                          src={previews.cover.src}
                          alt='Cover'
                          fill
                          className={`object-cover ${previews.cover.isLarge ? 'grayscale brightness-[0.3]' : ''}`}
                          priority
                        />
                      ) : (
                        <div className='w-full h-full bg-neutral-200 dark:bg-neutral-800' />
                      )}

                      <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <Camera className='text-white size-8 drop-shadow-lg' />
                      </div>

                      {previews.cover.isLarge && (
                        <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white'>
                          <AlertCircle className='text-destructive size-8 mb-1' />
                          <span className='text-[10px] font-bold uppercase'>
                            Max 5MB
                          </span>
                        </div>
                      )}
                    </div>

                    {previews.cover.src && (
                      <button
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange('');
                        }}
                        disabled={isUpdating}
                        className='absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white z-20 shadow-md transition-all'
                      >
                        <X className='size-4' />
                      </button>
                    )}

                    <input
                      type='file'
                      ref={coverInputRef}
                      className='hidden'
                      accept='image/*'
                      onChange={(e) => handleFileChange(e, field)}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className='relative -mt-12 px-4 mb-2 z-10'>
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem className='inline-block'>
                  <FormControl>
                    <div className='relative group'>
                      <div
                        onClick={() => imageInputRef.current?.click()}
                        className='relative size-24 rounded-full border-4 border-background cursor-pointer overflow-hidden bg-muted'
                      >
                        <UserAvatar
                          image={previews.profile.src}
                          name={session.data?.user.name}
                          className={`size-full ${previews.profile.isLarge ? 'grayscale brightness-[0.3]' : ''}`}
                        />

                        <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <Camera className='text-white size-6' />
                        </div>

                        {previews.profile.isLarge && (
                          <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white'>
                            <AlertCircle className='text-destructive size-5' />
                            <span className='text-[9px] font-bold uppercase mt-0.5'>
                              Max 5MB
                            </span>
                          </div>
                        )}
                      </div>

                      {previews.profile.src && (
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            field.onChange('');
                          }}
                          disabled={isUpdating}
                          className='absolute top-0 right-0 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white z-20 border border-background shadow-sm transition-all'
                        >
                          <X className='size-3' />
                        </button>
                      )}

                      <input
                        type='file'
                        ref={imageInputRef}
                        className='hidden'
                        accept='image/*'
                        onChange={(e) => handleFileChange(e, field)}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='data-[error=true]:text-muted-foreground'>
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Your name'
                    disabled={isUpdating}
                    className='py-4 shadow-none'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='Tell us about yourself'
                    className='py-4 shadow-none h-30 resize-none'
                    disabled={isUpdating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col gap-2 border-t pt-3 mt-2'>
            <div className='flex flex-col items-end px-1'>
              {errors.coverImage && (
                <p className='text-[12px] text-destructive font-medium'>
                  {errors.coverImage.message}
                </p>
              )}
              {errors.image && (
                <p className='text-[12px] text-destructive font-medium'>
                  {errors.image.message}
                </p>
              )}
            </div>

            <div className='flex items-center justify-end gap-2'>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='rounded-full px-4'
                onClick={() => form.reset()}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                size='sm'
                className='rounded-full px-4 w-24'
                disabled={isUpdating || !isValid}
              >
                {isUpdating ? <Spinner /> : <span>Save</span>}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
