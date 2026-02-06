'use server';

import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { ActionResponse } from '@/types';

export async function toggleBookmarkAction(
  postId: string,
): Promise<ActionResponse<{ isBookmarked: boolean }>> {
  try {
    if (!postId || typeof postId !== 'string') {
      return {
        success: false,
        error: 'INVALID_DATA',
        message: 'Valid Post ID is required',
      };
    }

    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Please log in to bookmark posts',
      };
    }

    const userId = session.user.id;

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_postId: { userId, postId },
        },
      });
      return {
        success: true,
        data: { isBookmarked: false },
        message: 'Removed from bookmarks',
      };
    } else {
      await prisma.bookmark.create({
        data: { userId, postId },
      });
      return {
        success: true,
        data: { isBookmarked: true },
        message: 'Added to bookmarks',
      };
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003' || error.code === 'P2025') {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'Post no longer exists',
        };
      }
    }
    return {
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to update bookmark',
    };
  }
}
