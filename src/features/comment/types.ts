import { Prisma } from '@/generated/prisma/client';

export type CommentWithRelations = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        username: true;
        image: true;
      };
    };
    commentLikes: { select: { id: true } };
    _count: { select: { commentLikes: true } };
  };
}> & { likesCount: number; isLiked: boolean };
