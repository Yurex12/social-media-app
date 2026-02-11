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
    following: {
      select: {
        followingId: true;
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
  followsYou: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
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
            following: {
              select: { followingId: true };
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
  include: {
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
        following: {
          where: { followingId: 'some-user-id' };
          select: { followingId: true };
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
  include: {
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
        following: {
          where: { followingId: 'some-user-id' };
          select: { followingId: true };
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

export interface AuthorCardProps {
  postId: string | undefined;
  isPending: boolean;
  error: Error | null;
}

export interface UserResponse {
  users: UserWithRelations[];
  nextCursor: string | null;
}
