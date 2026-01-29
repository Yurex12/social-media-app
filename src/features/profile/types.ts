import { Prisma } from '@/generated/prisma/client';

export type TUserFromDB = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    image: true;
    username: true;
    createdAt: true;
    bio: true;
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
            createdAt: true;
            bio: true;
            _count: {
              select: { followers: true; following: true; posts: true };
            };
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

export type TFollowersFromBD = Prisma.FollowGetPayload<{
  select: {
    follower: {
      select: {
        id: true;
        name: true;
        username: true;
        image: true;
        bio: true;
        createdAt: true;
        followers: {
          where: { followerId: 'some-user-id' };
          select: { followerId: true };
        };
        _count: {
          select: {
            posts: true;
            followers: true;
            following: true;
          };
        };
      };
    };
  };
}>;

export type TFollowingFromBD = Prisma.FollowGetPayload<{
  select: {
    following: {
      select: {
        id: true;
        name: true;
        username: true;
        image: true;
        bio: true;
        createdAt: true;
        followers: {
          where: { followerId: 'some-user-id' };
          select: { followerId: true };
        };
        _count: {
          select: {
            posts: true;
            followers: true;
            following: true;
          };
        };
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
  isCurrentUser: boolean;
  _count: {
    followers: number;
    following: number;
  };
}

export interface AuthorCardProps {
  user: Author | undefined;
  isPending: boolean;
  error: Error | null;
}
