'use server';

import z from 'zod';
import prisma from '@/lib/prisma';

import { getSession } from '@/lib/session';
import { postServerSchema, PostServerSchema } from './schema';

import { ActionResponse } from '@/types';
import { CreatePostResponse } from './types';
import { Prisma } from '@/generated/prisma/client';

export async function createPost(
  data: PostServerSchema
): Promise<ActionResponse<CreatePostResponse>> {
  const result = postServerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid data',
      error: z.treeifyError(result.error),
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

export async function deletePostAction(
  postId: string
): Promise<ActionResponse<string>> {
  try {
    if (!postId || typeof postId !== 'string') {
      throw new Error('Valid Post ID is required');
    }
    const session = await getSession();

    if (!session) throw new Error('Session expired. Please log in again.');

    await prisma.post.delete({
      where: {
        id: postId,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      data: postId,
      message: 'Post deleted successfully.',
    };
  } catch (error: unknown) {
    let message = 'Post could not be deleted.';

    if (error instanceof Error) {
      message = error.message;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        message = 'Post not found';
      }
    }

    return {
      success: false,
      message,
    };
  }
}

export async function likePost(postId: string) {
  try {
    if (!postId || typeof postId !== 'string') {
      throw new Error('Valid Post ID is required');
    }

    const session = await getSession();

    if (!session) throw new Error('Session expired. Please log in again.');

    await prisma.post.delete({
      where: {
        id: postId,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      data: postId,
      message: 'Post deleted successfully.',
    };
  } catch (error) {
    return {
      success: false,
      error,
      message: 'Post could not be deleted.',
    };
  }
}
