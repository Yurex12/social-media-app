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
    if (!postId) throw new Error('Post ID is required');

    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const result = commentSchema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        message: 'Invalid data',
        error: z.treeifyError(result.error),
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
    let message = 'Failed to post comment';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        message = 'Post not found';
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, message };
  }
}

export async function toggleCommentLikeAction(
  commentId: string,
): Promise<ActionResponse<{ liked: boolean }>> {
  try {
    if (!commentId) throw new Error('Comment ID is required');

    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

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
        message: 'Unliked comment',
      };
    } else {
      await prisma.commentLike.create({
        data: { userId, commentId },
      });
      return { success: true, data: { liked: true }, message: 'Liked comment' };
    }
  } catch {
    return { success: false, message: 'Could not update like' };
  }
}
