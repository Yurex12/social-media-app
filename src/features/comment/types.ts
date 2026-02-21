import { Prisma } from '@/generated/prisma/client';
import { getUserSelect } from '@/lib/prisma-fragments';
import { User } from '../profile/types';

export type CommentFromDB = Prisma.CommentGetPayload<{
  select: {
    id: true;
    content: true;
    createdAt: true;
    postId: true;
    userId: true;
    user: { select: ReturnType<typeof getUserSelect> };
    commentLikes: { select: { userId: true } };
    _count: { select: { commentLikes: true } };
  };
}>;

export type Comment = Omit<
  CommentFromDB,
  'commentLikes' | '_count' | 'user'
> & {
  user: User;
  likesCount: number;
  isLiked: boolean;
};

export type CommentResponse = {
  comments: Comment[];
  nextCursor: string | null;
};
