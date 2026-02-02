'use server';

import prisma from '@/lib/prisma';
import z from 'zod';

import { getSession } from '@/lib/session';
import {
  postEditServerSchema,
  PostEditServerSchema,
  postServerSchema,
  PostServerSchema,
} from './schema';

import { Prisma } from '@/generated/prisma/client';
import { ActionResponse } from '@/types';
import { PostWithRelations, TPostFromDB } from './types';

export async function createPostAction(
  data: PostServerSchema,
): Promise<ActionResponse<PostWithRelations>> {
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

    const userId = session.user.id;

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
            id: userId,
          },
        },
      },
      include: {
        _count: {
          select: { postLikes: true, comments: true },
        },
        images: { select: { id: true, url: true, fileId: true } },

        postLikes: {
          where: { userId },
          select: { id: true },
        },

        bookmarks: {
          where: { userId },
          select: { id: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
            createdAt: true,
            bio: true,
            _count: {
              select: { followers: true, following: true, posts: true },
            },
            followers: {
              where: { followerId: userId },
              select: { followerId: true },
            },
          },
        },
      },
    });

    const transformedPost = {
      ...post,
      isBookmarked: post.bookmarks.length > 0,
      isLiked: post.postLikes.length > 0,
      likesCount: post._count.postLikes,
      commentsCount: post._count.comments,
      user: {
        ...post.user,
        isFollowing: post.user.followers.length > 0,
        isCurrentUser: post.userId === userId,
        followersCount: post.user._count.followers,
        followingCount: post.user._count.following,
        postsCount: post.user._count.posts,
      },
    } satisfies PostWithRelations;

    return {
      success: true,
      data: transformedPost,
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

export async function editPostAction(
  postId: string | undefined,
  data: PostEditServerSchema,
): Promise<ActionResponse<PostWithRelations>> {
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

    const userId = session.user.id;

    const { content, images, imagesToDeleteId } = result.data;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post || post.userId !== userId)
      throw new Error('Post not found or unauthorized');

    const transformedPost = await prisma.$transaction(
      async (tx) => {
        if (imagesToDeleteId.length > 0) {
          await tx.image.deleteMany({
            where: {
              postId,
              fileId: { in: imagesToDeleteId },
            },
          });
        }

        const updatedPost = await tx.post.update({
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
          include: {
            _count: {
              select: { postLikes: true, comments: true },
            },
            images: { select: { id: true, url: true, fileId: true } },

            postLikes: {
              where: { userId },
              select: { id: true },
            },

            bookmarks: {
              where: { userId },
              select: { id: true },
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true,
                createdAt: true,
                bio: true,
                _count: {
                  select: { followers: true, following: true, posts: true },
                },
                followers: {
                  where: { followerId: userId },
                  select: { followerId: true },
                },
              },
            },
          },
        });

        return {
          ...updatedPost,
          isBookmarked: updatedPost.bookmarks.length > 0,
          isLiked: updatedPost.postLikes.length > 0,
          likesCount: updatedPost._count.postLikes,
          commentsCount: updatedPost._count.comments,
          user: {
            ...updatedPost.user,
            isFollowing: updatedPost.user.followers.length > 0,
            isCurrentUser: updatedPost.userId === userId,
            followersCount: updatedPost.user._count.followers,
            followingCount: updatedPost.user._count.following,
            postsCount: updatedPost.user._count.posts,
          },
        } satisfies PostWithRelations;
      },
      { timeout: 10_000 },
    );

    return {
      success: true,
      data: transformedPost,
      message: 'Post edited successfully',
    };
  } catch (err) {
    console.log(err);

    return { success: false, message: 'Could not edit post' };
  }
}

export async function deletePostAction(
  postId: string,
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
  postId: string,
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
