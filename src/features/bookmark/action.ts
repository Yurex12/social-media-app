'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { ActionResponse } from '@/types';

export async function toggleBookmarkAction(
  postId: string
): Promise<ActionResponse<{ isBookmarked: boolean }>> {
  try {
    if (!postId || typeof postId !== 'string') {
      throw new Error('Valid Post ID is required');
    }

    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

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
  } catch {
    return { success: false, message: 'Failed to update bookmark' };
  }
}
