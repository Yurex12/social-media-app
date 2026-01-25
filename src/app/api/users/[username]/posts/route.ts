import { PostWithRelations } from '@/features/post/types';
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

  try {
    const posts = (await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      where: { user: { username } },
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
          select: { postLikes: true, comments: true },
        },
      },
    })) as PostWithRelations[];

    const transformedPosts = posts.map((post) => {
      const { postLikes, bookmarks, _count, ...rest } = post;

      return {
        ...rest,
        isBookmarked: bookmarks.length > 0,
        isLiked: postLikes.length > 0,
        likeCount: _count.postLikes,
        commentCount: _count.comments,
      };
    });

    return NextResponse.json(transformedPosts);
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
