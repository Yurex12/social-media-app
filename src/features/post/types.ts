import { Prisma } from '@/generated/prisma/client';

export type CreatePostResponse = { id: string };

export type GetPostsResponse = { content: string; id: string }[];

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    images: { select: { id: true; url: true; fileId: true } };
    user: {
      select: {
        id: true;
        name: true;
        username: true;
        image: true;
        bio: true;
        _count: { select: { followers: true; following: true } };
      };
    };
    bookmarks: { select: { id: true } };
    postLikes: { select: { id: true } };
    _count: { select: { comments: true; postLikes: true } };
  };
}> & {
  isBookmarked: boolean;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
};

export interface PostFeedProps {
  posts: PostWithRelations[] | undefined;
  isPending: boolean;
  error: Error | null;
  emptyMessage?: string;
}
