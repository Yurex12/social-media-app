import { z } from 'zod';
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from '@/constants';

const nameField = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(50, 'Name must be less than 50 characters');

const bioField = z
  .string()
  .trim()
  .max(160, 'Bio must be less than 160 characters');

const imageField = z
  .union([z.instanceof(File), z.url(), z.literal('')])
  .refine((file) => {
    if (file instanceof File) return file.size <= MAX_FILE_SIZE;
    return true;
  }, 'Image must be less than 5MB')
  .refine((file) => {
    if (file instanceof File) return ACCEPTED_IMAGE_TYPES.includes(file.type);
    return true;
  }, 'Only JPEG, PNG, and WebP are allowed');

export const onboardingSchema = z.object({
  bio: bioField,
  image: imageField,
});

export const editProfileSchema = z.object({
  name: nameField,
  bio: bioField,
  image: imageField,
  coverImage: imageField,
});

export const editProfileServerSchema = z.object({
  name: nameField.optional(),
  bio: bioField.optional(),
  image: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  imageFileId: z.string().nullable().optional(),
  coverImageFileId: z.string().nullable().optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
export type EditProfileServerSchema = z.infer<typeof editProfileServerSchema>;
export type OnboardingSchemaFormValues = z.infer<typeof onboardingSchema>;
