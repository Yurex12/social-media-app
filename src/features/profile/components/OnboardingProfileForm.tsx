'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { useEditProfile } from '@/features/profile/hooks/useEditProfile';
import {
  onboardingSchema,
  OnboardingSchemaFormValues,
} from '@/features/profile/schema';
import { User } from '@/lib/auth';
import { useSession } from '@/lib/auth-client';

export function OnboardingProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const session = useSession();

  const { editProfile, isPending: isEditing } = useEditProfile();

  const form = useForm<OnboardingSchemaFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      bio: user.bio || '',
      image: user.image || '',
    },
  });

  const isValid = form.formState.isValid;
  const imageValue = useWatch({ control: form.control, name: 'image' });

  const isSubmitting = form.formState.isSubmitting || isEditing;

  const previewUrl = useMemo(() => {
    if (imageValue instanceof File) {
      return URL.createObjectURL(imageValue);
    }
    return imageValue || '';
  }, [imageValue]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function onSubmit(values: OnboardingSchemaFormValues) {
    editProfile(
      {
        ...values,
        name: user.name || '',
        coverImage: user?.coverImage || '',
        imageFileId: values.image ? (user?.imageFileId ?? null) : null,
        coverImageFileId: user?.coverImageFileId ?? null,
      },
      {
        onSuccess: () => {
          session.refetch();
          router.push('/home');
        },
      },
    );
  }

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem className='flex flex-col items-center justify-center'>
                <FormControl>
                  <div className='relative group'>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className='relative h-24 w-24 sm:h-32 sm:w-32 rounded-full border cursor-pointer overflow-hidden shadow-sm'
                    >
                      <UserAvatar
                        image={previewUrl}
                        name={user.name}
                        textClassName='text-4xl'
                        className='h-full w-full object-cover'
                      />

                      <div className='absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/40'>
                        <Camera className='text-white size-6 sm:size-8' />
                      </div>
                    </div>

                    {previewUrl && (
                      <button
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange('');
                          if (fileInputRef.current)
                            fileInputRef.current.value = '';
                        }}
                        disabled={isSubmitting}
                        className='absolute top-1 right-1 p-1.5 bg-black/60 rounded-full text-white z-20 border border-background shadow-sm transition-all'
                      >
                        <X className='size-3 sm:size-4' />
                      </button>
                    )}

                    <input
                      type='file'
                      ref={fileInputRef}
                      className='hidden'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) field.onChange(file);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio Field */}
          <FormField
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <FormLabel className='text-sm font-medium text-foreground'>
                    Bio
                  </FormLabel>
                  <span className='text-[10px] uppercase text-muted-foreground font-bold tracking-tight'>
                    {field.value?.length || 0} / 160
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='Tell us about yourself...'
                    className='resize-none h-25'
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className='space-y-2 pt-2'>
            <Button
              type='submit'
              disabled={!isValid || isSubmitting}
              className='w-full bg-linear-to-r from-blue-500 via-blue-600 to-indigo-700 text-white shadow-md transition-all hover:scale-[1.01] active:scale-100 cursor-pointer'
            >
              {isSubmitting ? (
                <Spinner className='text-white' />
              ) : (
                ' Update profile'
              )}
            </Button>

            <Button
              type='button'
              variant='ghost'
              onClick={() => router.replace('/home')}
              className='w-full text-gray-500 hover:text-gray-800 cursor-pointer'
              disabled={isSubmitting}
            >
              Skip for now
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  );
}
