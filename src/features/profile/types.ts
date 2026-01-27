import { Prisma } from '@/generated/prisma/client';

export type TUserFromDB = Prisma.UserGetPayload<{
  include: {
    followers: {
      select: {
        followerId: true;
      };
    };
    _count: {
      select: {
        followers: true;
        following: true;
        posts: true;
      };
    };
  };
}>;

export type UserWithRelations = TUserFromDB & {
  isCurrentUser: boolean;
  isFollowing: boolean;
};

export type TPostLikeFromDB = Prisma.PostLikeGetPayload<{
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
            followers: {
              select: { followerId: true };
            };
          };
        };
        images: { select: { id: true; url: true; fileId: true } };
        postLikes: { select: { id: true } };
        bookmarks: { select: { id: true } };
        _count: { select: { postLikes: true; comments: true } };
      };
    };
  };
}>;

interface Author {
  name: string;
  id: string;
  image: string | null;
  username: string;
  bio: string | null;
  isFollowing: boolean;
  // isCurrentUser: boolean;
  _count: {
    followers: number;
    following: number;
  };
}
export interface SuggestedUsers {
  name: string;
  id: string;
  image: string | null;
  username: string;
  bio: string | null;
  isFollowing: boolean;
}

export interface AuthorCardProps {
  user: Author | undefined;
  isPending: boolean;
  error: Error | null;
}
