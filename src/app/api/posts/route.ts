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
            bio: true,
            followers: {
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
        },
        isBookmarked: post.bookmarks.length > 0,
        isLiked: post.postLikes.length > 0,
        likeCount: post._count.postLikes,
        commentCount: post._count.comments,
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
