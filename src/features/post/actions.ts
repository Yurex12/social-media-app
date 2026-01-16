'use server';

import z from 'zod';
import prisma from '@/lib/prisma';

import { getSession } from '@/lib/session';
import {
  postEditServerSchema,
  PostEditServerSchema,
  postServerSchema,
  PostServerSchema,
} from './schema';

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

    if (!session) throw new Error('unauthorized');

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

export async function updatePost(
  postId: string | undefined,
  data: PostEditServerSchema
): Promise<ActionResponse<{ id: string }>> {
  const result = postEditServerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid data',
      error: z.treeifyError(result.error),
    };
  }

  try {
    if (!postId || typeof postId !== 'string') {
      throw new Error('Valid Post ID is required');
    }
    const session = await getSession();

    if (!session) throw new Error('unauthorized');

    const { content, images, imagesToDeleteId } = result.data;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post || post.userId !== session.user.id) {
      throw new Error('Post not found or unauthorized');
    }

    await prisma.$transaction(
      async (tx) => {
        if (imagesToDeleteId.length > 0) {
          await tx.image.deleteMany({
            where: {
              postId,
              fileId: { in: imagesToDeleteId },
            },
          });
        }

        await tx.post.update({
          where: { id: postId },
          data: {
            content,
            images: {
              createMany: {
                data: images.map((img) => ({
                  url: img.url,
                  fileId: img.fileId,
                })),
              },
            },
          },
        });
      },
      { timeout: 10_000 }
    );
    return {
      success: true,
      data: { id: postId },
      message: 'Post edited successfully',
    };
  } catch (err) {
    console.log(err);

    return { success: false, message: 'Could not edit post' };
  }
}

export async function deletePostAction(
  postId: string
): Promise<ActionResponse<string>> {
  try {
    if (!postId || typeof postId !== 'string') {
      throw new Error('Valid Post ID is required');
    }
    const session = await getSession();

    if (!session) throw new Error('unauthorized');

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

export async function toggleLikeAction(
  postId: string
): Promise<ActionResponse<{ liked: boolean }>> {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const userId = session.user.id;

    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          postId_userId: { postId, userId },
        },
      });
      return { success: true, data: { liked: false }, message: 'Unliked post' };
    } else {
      await prisma.postLike.create({
        data: { userId, postId },
      });
      return { success: true, data: { liked: true }, message: 'Liked post' };
    }
  } catch {
    return { success: false, message: 'Could not update like' };
  }
}
