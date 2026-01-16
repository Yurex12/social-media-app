import z from 'zod';

import { MAX_FILE_SIZE } from '@/constants';

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const basePostSchema = z.object({
  content: z
    .string()
    .trim()
    .max(1000, 'Content should not be more than 1000 characters'),
});

export const postSchema = basePostSchema
  .extend({
    images: z
      .array(z.instanceof(File))
      .max(2, 'Maximum 2 images allowed')
      .refine(
        (files) =>
          files.every((file) => file.size > 0 && file.size <= MAX_FILE_SIZE),
        { message: 'Each file should be less than 5MB' }
      )
      .refine(
        (files) =>
          files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        { message: 'Only JPEG, PNG, and WebP images are allowed' }
      ),
  })
  .refine((data) => data.content.trim().length > 0 || data.images.length > 0, {
    message: 'Please provide either content or at least one image',
  });

export const postServerSchema = basePostSchema
  .extend({
    images: z
      .array(
        z.object({
          fileId: z.string(),
          url: z.url(),
        })
      )
      .max(2, 'Maximum 2 images allowed'),
  })
  .refine((data) => data.content.trim().length > 0 || data.images.length > 0, {
    message: 'Please provide either content or at least one image',
  });

export const postEditSchema = basePostSchema
  .extend({
    images: z
      .array(
        z.union([
          z.instanceof(File),
          z.object({
            fileId: z.string(),
            url: z.url(),
          }),
        ])
      )
      .max(2, 'Maximum 2 images are allowed')
      .refine(
        (images) =>
          images.every((img) => {
            if (img instanceof File) {
              return img.size <= MAX_FILE_SIZE;
            }
            return true;
          }),
        {
          message: 'Each file should be less than 5MB',
        }
      )
      .refine(
        (images) =>
          images.every((img) => {
            if (img instanceof File) {
              return ACCEPTED_IMAGE_TYPES.includes(img.type);
            }
            return true;
          }),
        { message: 'Only JPEG, PNG, and WebP images are allowed' }
      ),
  })
  .refine((data) => data.content.trim().length > 0 || data.images.length > 0, {
    message: 'Please provide either content or at least one image',
  });

export const postEditServerSchema = basePostSchema.extend({
  images: z
    .array(
      z.object({
        fileId: z.string(),
        url: z.url(),
      })
    )
    .max(2, 'Maximum 2 images allowed'),

  imagesToDeleteId: z.array(z.string()),
});

export type PostSchema = z.infer<typeof postSchema>;
export type PostEditSchema = z.infer<typeof postEditSchema>;
export type PostServerSchema = z.infer<typeof postServerSchema>;
export type PostEditServerSchema = z.infer<typeof postEditServerSchema>;
