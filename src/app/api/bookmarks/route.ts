import { BookmarkWithRelations } from '@/features/bookmark/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  try {
    const bookmarks = (await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          include: {
            user: {
              select: { id: true, name: true, image: true, username: true },
            },
            images: { select: { id: true, url: true, fileId: true } },

            postLikes: {
              where: { userId: session.user.id },
              select: { id: true },
            },

            _count: {
              select: { postLikes: true, comments: true },
            },
          },
        },
      },
    })) as BookmarkWithRelations[];

    const data = bookmarks.map((bookmark) => {
      return {
        ...bookmark.post,
        isBookmarked: true,
        isLiked: bookmark.post.postLikes.length > 0,
        likeCount: bookmark.post._count.postLikes,
        commentCount: bookmark.post._count.comments,
      };
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
