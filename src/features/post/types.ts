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
      };
    };
    bookmarks: { select: { id: true } };
    postLikes: { select: { id: true } };
    _count: { select: { bookmarks: true; postLikes: true } };
  };
}> & { isBookmarked: boolean; isLiked: boolean; likesCount: number };

export type PostHeaderProps = {
  user: { image: string | null; name: string; username: string };
};
