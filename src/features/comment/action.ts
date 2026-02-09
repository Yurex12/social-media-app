'use server';

'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

import { CommentFormValues, commentSchema } from './schema';

import { ActionResponse } from '@/types';

import { Prisma } from '@/generated/prisma/client';
import { CommentWithRelations } from './types';
import { pusherServer } from '@/lib/pusher';

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

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return {
        success: false,
        error: 'NOT_FOUND',
        message: 'This post no longer exists',
      };
    }

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
        commentLikes: {
          where: { userId },
          select: { userId: true },
        },
        _count: {
          select: { commentLikes: true },
        },
      },
    });

    if (userId !== post.userId) {
      try {
        const existingNotif = await prisma.notification.findFirst({
          where: {
            type: 'COMMENT_POST',
            commentId: comment.id,
          },
        });

        if (!existingNotif) {
          await prisma.notification.create({
            data: {
              type: 'COMMENT_POST',
              commentId: comment.id,
              postId: comment.postId,
              issuerId: userId,
              recipientId: post.userId,
            },
          });

          await pusherServer.trigger(
            `user-${post.userId}`,
            'new-notification',
            {
              type: 'COMMENT_POST',
              commentId: comment.id,
              postId: comment.postId,
              issuerId: userId,
            },
          );
        }
      } catch (error) {
        console.log('Notification Error:', error);
      }
    }

    const transformedComment = {
      ...comment,
      isLiked: comment.commentLikes.length > 0,
      likesCount: comment._count.commentLikes,
      user: {
        ...comment.user,
        isCurrentUser: comment.user.id === userId,
        followsYou: comment.user.following.length > 0,
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

    console.error('Create Comment Error:', error);
    return {
      success: false,
      message: 'Failed to post comment',
      error: 'SERVER_ERROR',
    };
  }
}

export async function deleteCommentAction(
  commentId: string,
): Promise<ActionResponse<string>> {
  try {
    if (!commentId || typeof commentId !== 'string') {
      return {
        success: false,
        error: 'INVALID_DATA',
        message: 'Valid Comment ID is required',
      };
    }

    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Please log in to delete your comment',
      };
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      data: commentId,
      message: 'Comment deleted successfully.',
    };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'Comment not found',
        };
      }
    }

    return {
      success: false,
      error: 'SERVER_ERROR',
      message: 'Comment could not be deleted.',
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
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: { userId: true, postId: true },
    });

    if (!comment) {
      return {
        success: false,
        error: 'NOT_FOUND',
        message: 'This comment no longer exists',
      };
    }

    await prisma.commentLike.create({
      data: { userId, commentId },
    });

    if (userId !== comment.userId) {
      try {
        const existingNotif = await prisma.notification.findFirst({
          where: {
            type: 'LIKE_COMMENT',
            issuerId: userId,
            commentId,
          },
        });

        if (!existingNotif) {
          await prisma.notification.create({
            data: {
              type: 'LIKE_COMMENT',
              commentId,
              postId: comment.postId,
              issuerId: userId,
              recipientId: comment.userId,
            },
          });

          await pusherServer.trigger(
            `user-${comment.userId}`,
            'new-notification',
            {
              type: 'LIKE_COMMENT',
              commentId,
              issuerId: userId,
              postId: comment.postId,
            },
          );
        }
      } catch (error) {
        console.error('Notification Error:', error);
      }
    }
    return { success: true, data: { liked: true }, message: 'Liked comment' };
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

    console.log(error);

    return {
      success: false,
      error: 'SERVER_ERROR',
      message: 'Could not update like',
    };
  }
}
