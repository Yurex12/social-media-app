import { NotificationType, Prisma } from '@/generated/prisma/client';

export type NotificationWithRelations = Prisma.NotificationGetPayload<{
  include: {
    issuer: {
      select: {
        name: true;
        image: true;
        username: true;
      };
    };
  };
}>;

export type NotificationData = {
  type: NotificationType;
  commentId?: string;
  issuerId: string;
  postId?: string;
  name: string;
  image: string;
};
