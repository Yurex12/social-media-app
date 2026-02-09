import { Prisma } from '@/generated/prisma/client';

export type TNotificationFromDB = Prisma.NotificationGetPayload<{
  include: {
    issuer: {
      select: {
        id: true;
        name: true;
        image: true;
        username: true;
        bio: true;
        createdAt: true;
        followers: { select: { followerId: true } };
        following: { select: { followingId: true } };
        _count: { select: { followers: true; following: true; posts: true } };
      };
    };
  };
}>;

export type NotificationWithRelations = Omit<TNotificationFromDB, 'issuer'> & {
  issuer: TNotificationFromDB['issuer'] & {
    isFollowing: boolean;
    followsYou: boolean;
    isCurrentUser: boolean;
    followersCount: number;
    followingCount: number;
    postsCount: number;
  };
};
