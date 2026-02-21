import { Prisma } from '@/generated/prisma/client';

export const getUserSelect = (userId: string) =>
  ({
    id: true,
    name: true,
    image: true,
    username: true,
    createdAt: true,
    bio: true,
    coverImage: true,

    _count: {
      select: { followers: true, following: true, posts: true },
    },
    followers: {
      where: { followerId: userId },
      select: { followerId: true },
    },
    following: {
      where: { followerId: userId },
      select: { followerId: true },
    },
  }) satisfies Prisma.UserSelect;

export const getPostSelect = (userId: string) =>
  ({
    id: true,
    content: true,
    createdAt: true,
    userId: true,
    user: { select: getUserSelect(userId) },
    images: {
      select: { id: true, url: true, fileId: true, width: true, height: true },
    },
    postLikes: {
      where: { userId },
      select: { id: true },
    },
    bookmarks: {
      where: { userId },
      select: { id: true },
    },
    _count: {
      select: { postLikes: true, comments: true },
    },
  }) satisfies Prisma.PostSelect;
