import { Prisma } from '@/generated/prisma/client';

export type UserWithRelation = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: {
        followers: true;
        following: true;
        posts: true;
      };
    };
  };
}> & { isCurrentUser: boolean };
