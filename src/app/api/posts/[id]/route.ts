import { PostWithRelations } from '@/features/post/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const post = (await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
            bio: true,
            _count: {
              select: {
                followers: true,
                following: true,
              },
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
    })) as PostWithRelations;

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const transformedPost: PostWithRelations = {
      ...post,
      isBookmarked: post.bookmarks.length > 0,
      isLiked: post.postLikes.length > 0,
      likeCount: post._count.postLikes,
      commentCount: post._count.comments,
    };

    return NextResponse.json(transformedPost);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
