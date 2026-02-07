import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

import { PostWithRelations, TPostFromDB } from '@/features/post/types';
export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  try {
    const posts = (await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
            createdAt: true,
            bio: true,
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
          },
        },
        images: { select: { id: true, url: true, fileId: true } },

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
      },
    })) as TPostFromDB[];

    const transformedPosts = posts.map((post) => {
      return {
        ...post,
        user: {
          ...post.user,
          isFollowing: post.user.followers.length > 0,
          followsYou: post.user.following.length > 0,
          isCurrentUser: post.user.id === userId,
          followersCount: post.user._count.followers,
          followingCount: post.user._count.following,
          postsCount: post.user._count.posts,
        },
        isBookmarked: post.bookmarks.length > 0,
        isLiked: post.postLikes.length > 0,
        likesCount: post._count.postLikes,
        commentsCount: post._count.comments,
      };
    }) satisfies PostWithRelations[];

    return NextResponse.json(transformedPosts);
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
