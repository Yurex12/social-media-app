'use server';

import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

import { ActionResponse } from '@/types';

export async function markNotificationAsRead(
  id: string,
): Promise<ActionResponse<null>> {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Please log in to perform this action',
      };
    }

    const userId = session.user.id;

    await prisma.notification.update({
      where: {
        id,
        recipientId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return {
      success: true,
      data: null,
      message: 'Notification marked as read',
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003' || error.code === 'P2025') {
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'This notification does not exist',
        };
      }
    }
    return {
      success: false,
      message: 'Failed to update notifications',
      error: 'SERVER_ERROR',
    };
  }
}

export async function markAllNotificationsAsRead(): Promise<
  ActionResponse<null>
> {
  try {
    const session = await getSession();
    if (!session)
      return { success: false, error: 'UNAUTHORIZED', message: 'Unauthorized' };

    await prisma.notification.updateMany({
      where: {
        recipientId: session.user.id,
        read: false,
      },
      data: { read: true },
    });

    return { success: true, data: null, message: 'All marked as read' };
  } catch {
    return {
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to update',
    };
  }
}
