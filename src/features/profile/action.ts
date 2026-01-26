'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { ActionResponse } from '@/types';

export async function toggleFollowAction(
  followingId: string,
): Promise<ActionResponse<{ followed: boolean }>> {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const followerId = session.user.id;

    if (followerId === followingId) {
      throw new Error('You cannot follow yourself');
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
      return {
        success: true,
        data: { followed: false },
        message: 'Unfollowed user',
      };
    } else {
      await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
      return {
        success: true,
        data: { followed: true },
        message: 'Followed user',
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Could not update follow',
    };
  }
}
