import { Prisma } from '@/generated/prisma/client';
import { UserWithRelations } from '../profile/types';

export type TCommentFromBD = Prisma.CommentGetPayload<{
  include: {
    user: {
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
    commentLikes: { select: { userId: true } };
    _count: { select: { commentLikes: true } };
  };
}>;

export type CommentWithRelations = Omit<TCommentFromBD, 'user'> & {
  user: UserWithRelations;
  likesCount: number;
  isLiked: boolean;
};

export type CommentResponse = {
  comments: CommentWithRelations[];
  nextCursor: string | null;
};
