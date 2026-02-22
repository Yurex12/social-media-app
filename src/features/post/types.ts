import { ReactNode } from 'react';

import { Prisma } from '@/generated/prisma/client';
import { getPostSelect } from '@/lib/prisma-fragments';

import { User } from '../profile/types';

export type CreatePostResponse = { id: string };

export type GetPostsResponse = { content: string; id: string }[];

export type PostFromDB = Prisma.PostGetPayload<{
  select: ReturnType<typeof getPostSelect>;
}>;

export type Post = Omit<
  PostFromDB,
  'postLikes' | 'bookmarks' | '_count' | 'user'
> & {
  user: User;
  isBookmarked: boolean;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
};

export type PostLikeFromDB = Prisma.PostLikeGetPayload<{
  select: {
    id: true;
    createdAt: true;
    post: { select: ReturnType<typeof getPostSelect> };
  };
}>;
export interface PostFeedProps {
  posts: Post[] | undefined;
  isPending: boolean;
  error: Error | null;
  emptyMessage?: string | ReactNode;
}

export interface PostFeedResponse {
  posts: Post[];
  nextCursor: string | null;
}

export interface PostIdsPage {
  postIds: string[];
  nextCursor: string | null;
}

export type PostImagesProps = {
  images: { id: string; url: string; width: number; height: number }[];
};
