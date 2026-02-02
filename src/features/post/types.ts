import { Prisma } from '@/generated/prisma/client';
import { ReactNode } from 'react';

export type CreatePostResponse = { id: string };

export type GetPostsResponse = { content: string; id: string }[];

export type TPostFromDB = Prisma.PostGetPayload<{
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
        _count: { select: { followers: true; following: true; posts: true } };
      };
    };
    images: { select: { id: true; url: true; fileId: true } };
    postLikes: { select: { id: true } };
    bookmarks: { select: { id: true } };
    _count: { select: { postLikes: true; comments: true } };
  };
}>;

export type PostWithRelations = Omit<
  TPostFromDB,
  'postLikes' | 'bookmarks' | '_count' | 'user'
> & {
  isBookmarked: boolean;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  user: TPostFromDB['user'] & { isFollowing: boolean; isCurrentUser: boolean };
};

export interface PostFeedProps {
  posts: PostWithRelations[] | undefined;
  isPending: boolean;
  error: Error | null;
  emptyMessage?: string | ReactNode;
}
