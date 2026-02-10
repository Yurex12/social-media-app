import { Prisma } from '@/generated/prisma/client';

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
