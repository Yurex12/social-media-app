import { PostWithRelations, TPostFromDB } from '@/features/post/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const session = await getSession();
  const { username } = await params;

  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  try {
    const posts = (await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      where: { user: { username } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
            bio: true,
            _count: { select: { followers: true, following: true } },
            followers: {
              where: { followerId: userId },
              select: { followerId: true },
            },
          },
        },
        images: { select: { id: true, url: true, fileId: true } },

        postLikes: {
          where: { userId: session.user.id },
          select: { id: true },
        },

        bookmarks: {
          where: { userId: session.user.id },
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
