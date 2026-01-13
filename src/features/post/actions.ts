'use server';

import z from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

import { postServerSchema, PostServerSchema } from './schema';

import { ActionResponse } from '@/types';
import { CreatePostResponse } from './types';

export async function createPost(
  data: PostServerSchema
): Promise<ActionResponse<CreatePostResponse>> {
  const result = postServerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid data',
      error: z.treeifyError(result.error),
      //   error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const session = await getSession();

    if (!session) {
      throw new Error('Session expired. Please log in again.');
    }

    const { content, images } = result.data;

    const processedImage = images.length
      ? images.map((image) => ({
          url: image.url,
          fileId: image.fileId,
        }))
      : [];

    const post = await prisma.post.create({
      data: {
        content,
        images: {
          createMany: {
            data: processedImage,
          },
        },
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return {
      success: true,
      data: post,
      message: 'Post created successfully.',
    };
  } catch (error) {
    return {
      success: false,
      error,
      message: 'Post could not be created.',
    };
  }
}
// export async function updatePost() {}

// export async function deletePostPost(postId: string) {}
