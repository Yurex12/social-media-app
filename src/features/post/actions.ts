'use server';

import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

import { getSession } from '@/lib/session';
import {
  postEditServerSchema,
  PostEditServerSchema,
  postServerSchema,
  PostServerSchema,
} from './schema';

import { Prisma } from '@/generated/prisma/client';
import { ActionResponse } from '@/types';
import { PostWithRelations } from './types';

export async function createPostAction(
  data: PostServerSchema,
): Promise<ActionResponse<PostWithRelations>> {
  const result = postServerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid data',
      error: 'INVALID_DATA',
    };
  }

  try {
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Please log in to create post',
      };
    }

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
            following: {
              where: { followingId: userId },
              select: { followingId: true },
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
        followsYou: post.user.following.length > 0,
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
  } catch {
    return {
      success: false,
      error: 'SERVER_ERROR',
      message: 'Post could not be created.',
    };
  }
}

export async function editPostAction(
  postId: string,
  data: PostEditServerSchema,
): Promise<ActionResponse<PostWithRelations>> {
  const result = postEditServerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid data',
      error: 'INVALID_DATA',
    };
  }

  try {
    if (!postId || typeof postId !== 'string')
      return {
        success: false,
        error: 'INVALID_DATA',
        message: 'Valid Post ID is required',
      };

    const session = await getSession();

    if (!session) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Please log in to edit post',
      };
    }

    const userId = session.user.id;

    const { content, images, imagesToDeleteId } = result.data;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return { success: false, error: 'NOT_FOUND', message: 'Post not found' };
    }

    if (post.userId !== userId) {
      return { success: false, error: 'UNAUTHORIZED', message: 'Unauthorized' };
    }

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
                following: {
                  where: { followingId: userId },
                  select: { followingId: true },
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
            followsYou: updatedPost.user.following.length > 0,
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'Post not found',
        };
      }
    }
    return {
      success: false,
      error: 'SERVER_ERROR',
      message: 'Could not edit post',
    };
  }
}

export async function deletePostAction(
  postId: string,
): Promise<ActionResponse<string>> {
  try {
    if (!postId || typeof postId !== 'string')
      return {
        success: false,
        error: 'INVALID_DATA',
        message: 'Valid Post ID is required',
      };
    const session = await getSession();

    if (!session)
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Please log in to delete post',
      };

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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'Post not found',
        };
      }
    }

    return {
      success: false,
      message: 'Post could not be deleted.',
      error: 'SERVER_ERROR',
    };
  }
}

export async function toggleLikeAction(
  postId: string,
): Promise<ActionResponse<{ liked: boolean }>> {
  try {
    const session = await getSession();
    if (!session)
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Please log in to like posts',
      };

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
      return {
        success: true,
        data: { liked: false },
        message: 'Un-liked post',
      };
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true, user: { select: { name: true, image: true } } },
    });

    if (!post)
      return { success: false, error: 'NOT_FOUND', message: 'Post not found' };

    await prisma.postLike.create({
      data: { userId, postId },
    });

    if (post.userId !== userId) {
      try {
        const existingNotif = await prisma.notification.findFirst({
          where: {
            type: 'LIKE_POST',
            postId,
            issuerId: userId,
          },
        });

        if (!existingNotif) {
          await prisma.notification.create({
            data: {
              type: 'LIKE_POST',
              postId,
              issuerId: userId,
              recipientId: post.userId,
            },
          });

          await pusherServer.trigger(
            `user-${post.userId}`,
            'new-notification',
            {
              type: 'LIKE_POST',
              postId,
              issuerId: userId,
              name: post.user.name,
              image: post.user.image,
            },
          );
        }
      } catch (error) {
        console.error('Notification Error:', error);
      }
    }

    return { success: true, data: { liked: true }, message: 'Liked post' };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003' || error.code === 'P2025') {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'Post not found',
        };
      }
    }
    return {
      success: false,
      error: 'SERVER_ERROR',
      message: 'Could not update like',
    };
  }
}
