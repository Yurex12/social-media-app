import { PostWithRelations } from '@/features/post/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const posts = (await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, image: true, username: true } },
        images: { select: { id: true, url: true, fileId: true } },

        postLikes: {
          where: { userId: session.user.id },
          select: { userId: true },
        },

        bookmarks: {
          where: { userId: session.user.id },
          select: { userId: true },
        },

        _count: {
          select: { postLikes: true },
        },
      },
    })) as PostWithRelations[];

    const transformedPosts = posts.map((p) => {
      const { postLikes, bookmarks, _count, ...rest } = p;

      return {
        ...rest,
        isBookmarked: bookmarks.length > 0,
        isLiked: postLikes.length > 0,
        likesCount: _count.postLikes,
      };
    });

    return NextResponse.json(transformedPosts);
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
