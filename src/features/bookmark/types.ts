import { Prisma } from '@/generated/prisma/client';

export type TBookmarkFromDB = Prisma.BookmarkGetPayload<{
  include: {
    post: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            image: true;
            username: true;
            bio: true;
            _count: { select: { followers: true; following: true } };
            followers: { select: { followerId: true } };
          };
        };
        images: { select: { id: true; url: true; fileId: true } };
        postLikes: { select: { id: true } };
        _count: { select: { postLikes: true; comments: true } };
      };
    };
  };
}>;
