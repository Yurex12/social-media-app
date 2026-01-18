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
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const post = (await prisma.post.findUnique({
      where: { id: id },
      include: {
        user: { select: { id: true, name: true, image: true, username: true } },
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
          select: { postLikes: true },
        },
      },
    })) as PostWithRelations;

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const transformedPost: PostWithRelations = {
      ...post,
      isBookmarked: post.bookmarks.length > 0,
      isLiked: post.postLikes.length > 0,
      likesCount: post._count.postLikes,
    };

    return NextResponse.json(transformedPost);
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch post' },
      { status: 500 },
    );
  }
}
