import {
  NotificationWithRelations,
  TNotificationFromDB,
} from '@/features/notification/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  try {
    const notifications = (await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        issuer: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            image: true,
            createdAt: true,
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
        },
      },
    })) as TNotificationFromDB[];

    const transformedNotifications = notifications.map((notification) => {
      return {
        ...notification,
        issuer: {
          ...notification.issuer,
          isCurrentUser: notification.issuer.id === userId,
          followsYou: notification.issuer.following.length > 0,
          isFollowing: notification.issuer.followers.length > 0,
          followersCount: notification.issuer._count.followers,
          followingCount: notification.issuer._count.following,
          postsCount: notification.issuer._count.posts,
        },
      };
    }) satisfies NotificationWithRelations[];

    return NextResponse.json(transformedNotifications);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
