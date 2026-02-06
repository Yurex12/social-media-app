'use server';

'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

import { CommentFormValues, commentSchema } from './schema';

import { ActionResponse } from '@/types';

import { CommentWithRelations } from './types';
import z from 'zod';
import { Prisma } from '@/generated/prisma/client';

export async function createCommentAction(
  postId: string,
  data: CommentFormValues,
): Promise<ActionResponse<CommentWithRelations>> {
  try {
    if (!postId || typeof postId !== 'string') {
      return {
        success: false,
        error: 'INVALID_DATA',
        message: 'Post ID is required',
      };
    }
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Please log in to post a comment',
      };
    }

    const result = commentSchema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        message: 'Invalid comment content',
        error: 'INVALID_DATA',
      };
    }

    const userId = session.user.id;

    const comment = await prisma.comment.create({
      data: {
        content: result.data.content,
        userId,
        postId,
      },
      include: {
        user: {
          include: {
            _count: {
              select: {
                followers: true,
                following: true,
                posts: true,
              },
            },
            followers: {
              where: { followerId: userId },
              select: { followerId: true },
            },
          },
        },
        commentLikes: {
          where: {
            userId,
          },
          select: { userId: true },
        },
        _count: {
          select: {
            commentLikes: true,
          },
        },
      },
    });

    const transformedComment = {
      ...comment,
      isLiked: comment.commentLikes.length > 0,
      likesCount: comment._count.commentLikes,
      user: {
        ...comment.user,
        isCurrentUser: comment.user.id === userId,
        isFollowing: comment.user.followers.length > 0,
        followersCount: comment.user._count.followers,
        followingCount: comment.user._count.following,
        postsCount: comment.user._count.posts,
      },
    } satisfies CommentWithRelations;

    return {
      success: true,
      data: transformedComment,
      message: 'Comment posted successfully',
    };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'This post no longer exists',
        };
      }
    }

    return {
      success: false,
      message: 'Failed to post comment',
      error: 'SERVER_ERROR',
    };
  }
}

export async function toggleCommentLikeAction(
  commentId: string,
): Promise<ActionResponse<{ liked: boolean }>> {
  try {
    if (!commentId || typeof commentId !== 'string') {
      return {
        success: false,
        error: 'INVALID_DATA',
        message: 'Comment ID is required',
      };
    }

    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Please log in to like comments',
      };
    }

    const userId = session.user.id;

    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: { commentId, userId },
      },
    });

    if (existingLike) {
      await prisma.commentLike.delete({
        where: {
          commentId_userId: { commentId, userId },
        },
      });
      return {
        success: true,
        data: { liked: false },
        message: 'Un-liked comment',
      };
    } else {
      await prisma.commentLike.create({
        data: { userId, commentId },
      });
      return { success: true, data: { liked: true }, message: 'Liked comment' };
    }
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003' || error.code === 'P2025') {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'This comment no longer exists',
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
