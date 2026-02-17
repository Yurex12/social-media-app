import { z } from 'zod';
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from '@/constants';

const baseProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  bio: z
    .string()
    .trim()
    .max(160, 'Bio must be less than 160 characters')
    .or(z.literal('')),
});

export const editProfileSchema = baseProfileSchema.extend({
  image: z
    .union([z.instanceof(File), z.url(), z.literal('')])
    .refine((file) => {
      if (file instanceof File) return file.size <= MAX_FILE_SIZE;
      return true;
    }, 'Profile image should be less than 5MB')
    .refine((file) => {
      if (file instanceof File) return ACCEPTED_IMAGE_TYPES.includes(file.type);
      return true;
    }, 'Only JPEG, PNG, and WebP are allowed'),

  coverImage: z
    .union([z.instanceof(File), z.url(), z.literal('')])
    .refine((file) => {
      if (file instanceof File) return file.size <= MAX_FILE_SIZE;
      return true;
    }, 'Cover image should be less than 5MB')
    .refine((file) => {
      if (file instanceof File) return ACCEPTED_IMAGE_TYPES.includes(file.type);
      return true;
    }, 'Only JPEG, PNG, and WebP are allowed'),
});

export const editProfileServerSchema = baseProfileSchema.extend({
  image: z.string().nullable(),
  coverImage: z.string().nullable(),
  imageFileId: z.string().nullable(),
  coverImageFileId: z.string().nullable(),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
export type EditProfileServerSchema = z.infer<typeof editProfileServerSchema>;
