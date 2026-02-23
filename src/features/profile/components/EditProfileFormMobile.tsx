'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, Camera, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import { MAX_FILE_SIZE } from '@/constants';
import { UserAvatar } from '@/features/profile/components/UserAvatar';

import { useEditProfile } from '../hooks/useEditProfile';
import { editProfileSchema, type EditProfileFormValues } from '../schema';
import { User } from '@/lib/auth';
import { useSession } from '@/lib/auth-client';

export function EditProfileFormMobile({ user }: { user: User }) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { editProfile, isPending: isEditing } = useEditProfile();

  const session = useSession();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    values: {
      name: user.name || '',
      bio: user.bio || '',
      image: user.image || '',
      coverImage: user.coverImage || '',
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
    field: ControllerRenderProps<EditProfileFormValues, 'image' | 'coverImage'>,
  ) {
    const file = e.target.files?.[0];
    if (file) field.onChange(file);
    e.target.value = '';
  }

  async function onSubmit(values: EditProfileFormValues) {
    editProfile(
      {
        ...values,
        imageFileId: values.image ? (user.imageFileId ?? null) : null,
        coverImageFileId: values.coverImage
          ? (user.coverImageFileId ?? null)
          : null,
      },
      {
        onSuccess: () => {
          session.refetch();
          router.back();
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col h-dvh bg-background max-w-140 mx-auto w-full sm:border'
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-2 border-b sticky top-0 bg-background z-30'>
          <div className='flex items-center gap-4'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='rounded-full'
              onClick={() => router.back()}
              disabled={isUpdating}
            >
              <ArrowLeft className='size-5' />
            </Button>
            <h1 className='font-bold text-xl'>Edit profile</h1>
          </div>

          <Button
            type='submit'
            size='sm'
            className='px-4 w-24 rounded-full'
            disabled={isUpdating || !isValid}
          >
            {isUpdating ? (
              <Spinner className='text-white' />
            ) : (
              <span>Save</span>
            )}
          </Button>
        </div>

        <div className='flex-1 overflow-y-auto p-4'>
          <div className='flex flex-col gap-4'>
            {/* Cover Image Section */}
            <FormField
              control={form.control}
              name='coverImage'
              render={({ field }) => (
                <FormItem className='space-y-0 relative'>
                  <FormControl>
                    <div className='relative'>
                      <div
                        onClick={() => coverInputRef.current?.click()}
                        className='relative h-32 w-full bg-muted rounded-lg overflow-hidden border cursor-pointer'
                      >
                        {previews.cover.src ? (
                          <Image
                            src={previews.cover.src}
                            alt='Cover'
                            fill
                            className={`object-cover ${previews.cover.isLarge ? 'grayscale brightness-[0.3]' : 'brightness-[0.7]'}`}
                            priority
                          />
                        ) : (
                          <div className='w-full h-full bg-neutral-200 dark:bg-neutral-800' />
                        )}

                        <div className='absolute inset-0 flex items-center justify-center bg-black/10'>
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
                          className='absolute top-2 right-2 p-1.5 bg-black/60 active:bg-black/80 rounded-full text-white z-20 shadow-md transition-all'
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

            {/* Profile Image Section */}
            <div className='relative -mt-12 px-4 mb-2 z-10'>
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem className='inline-block'>
                    <FormControl>
                      <div className='relative'>
                        <div
                          onClick={() => imageInputRef.current?.click()}
                          className='relative size-24 rounded-full border-4 border-background cursor-pointer overflow-hidden bg-muted'
                        >
                          <UserAvatar
                            image={previews.profile.src}
                            name={session.data?.user.name}
                            className={`size-full ${previews.profile.isLarge ? 'grayscale brightness-[0.3]' : 'brightness-[0.7]'}`}
                          />

                          <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
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
                            className='absolute top-0 right-0 p-1 bg-black/60 active:bg-black/80 rounded-full text-white z-20 border border-background shadow-sm transition-all'
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Your name'
                      disabled={isUpdating}
                      className='py-6 shadow-none'
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
                      className='py-4 shadow-none min-h-30 resize-none'
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col items-start gap-1 pb-6'>
              {errors.coverImage && (
                <p className='text-xs text-destructive font-medium'>
                  Cover: {errors.coverImage.message}
                </p>
              )}
              {errors.image && (
                <p className='text-xs text-destructive font-medium'>
                  Profile: {errors.image.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
