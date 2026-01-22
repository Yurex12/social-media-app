import { Prisma } from '@/generated/prisma/client';

export type Bookmark = { id: string; content: string; images: [] };

export type BookmarkWithRelations = Prisma.BookmarkGetPayload<{
  include: {
    post: {
      include: {
        _count: { select: { comments: true; postLikes: true } };
        images: { select: { id: true; url: true; fileId: true } };
        user: {
          select: {
            id: true;
            name: true;
            username: true;
            image: true;
          };
        };
        postLikes: { select: { id: true } };
      };
    };
  };
}> & {
  isBookmarked: boolean;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
};
