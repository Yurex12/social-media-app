'use server';

import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
import { getSession } from '@/lib/session';
import { ActionResponse } from '@/types';

import { deleteImages } from '@/lib/action';
import { editProfileServerSchema, EditProfileServerSchema } from './schema';
import { UserWithRelations } from './types';

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
    }

    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    try {
      const existingNotif = await prisma.notification.findFirst({
        where: {
          type: 'FOLLOW',
          issuerId: followerId,
          recipientId: followingId,
        },
      });

      if (!existingNotif) {
        await prisma.notification.create({
          data: {
            type: 'FOLLOW',
            issuerId: followerId,
            recipientId: followingId,
          },
        });

        await pusherServer.trigger(`user-${followingId}`, 'new-notification', {
          type: 'FOLLOW',
          issuerId: followerId,
          name: session.user.name,
          image: session.user.image,
        });
      }
    } catch (error) {
      console.error('Notification Error:', error);
    }

    return {
      success: true,
      data: { followed: true },
      message: 'Followed user',
    };
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
    console.error('Toggle Follow Error:', error);
    return {
      success: false,
      error: 'SERVER_ERROR',
      message: 'Could not update follow status',
    };
  }
}

export async function editProfileAction(
  values: EditProfileServerSchema,
): Promise<ActionResponse<UserWithRelations>> {
  try {
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Please log in to update your profile',
      };
    }

    const userId = session.user.id;

    const validated = editProfileServerSchema.safeParse(values);
    if (!validated.success) {
      return {
        success: false,
        error: 'INVALID_DATA',
        message: 'Invalid profile data provided',
      };
    }

    const profileData = validated.data;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { imageFileId: true, coverImageFileId: true },
    });

    if (!currentUser) {
      return {
        success: false,
        error: 'NOT_FOUND',
        message: 'User account not found',
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: profileData,
      select: {
        id: true,
        name: true,
        image: true,
        username: true,
        createdAt: true,
        coverImage: true,
        bio: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
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
    });

    const transFormedUser = {
      ...updatedUser,
      isCurrentUser: true,
      isFollowing: false,
      followsYou: false,
      followersCount: updatedUser._count.followers,
      followingCount: updatedUser._count.following,
      postsCount: updatedUser._count.posts,
    } satisfies UserWithRelations;

    try {
      const idsToDelete: string[] = [];

      if (
        currentUser?.imageFileId &&
        currentUser.imageFileId !== profileData.imageFileId
      ) {
        idsToDelete.push(currentUser.imageFileId);
      }

      if (
        currentUser?.coverImageFileId &&
        currentUser.coverImageFileId !== profileData.coverImageFileId
      ) {
        idsToDelete.push(currentUser.coverImageFileId);
      }

      if (idsToDelete.length > 0) {
        await deleteImages(idsToDelete);
      }
    } catch (error) {
      console.error('ImageKit Cleanup Error:', error);
    }

    return {
      success: true,
      data: transFormedUser,
      message: 'Profile updated successfully',
    };
  } catch (error: unknown) {
    console.error('Edit Profile Error:', error);
    return {
      success: false,
      error: 'SERVER_ERROR',
      message: 'Could not update profile',
    };
  }
}
