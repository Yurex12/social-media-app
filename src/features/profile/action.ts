'use server';

import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { ActionResponse } from '@/types';

export async function toggleFollowAction(
  followingId: string,
): Promise<ActionResponse<{ followed: boolean }>> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Please log in to follow users',
      };
    }

    const followerId = session.user.id;

    if (followerId === followingId) {
      return {
        success: false,
        error: 'INVALID_DATA',
        message: 'You cannot follow yourself',
      };
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
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003' || error.code === 'P2025') {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'User no longer exists',
        };
      }
    }
    return {
      success: false,
      error: 'SERVER_ERROR',
      message: 'Could not update follow status',
    };
  }
}
