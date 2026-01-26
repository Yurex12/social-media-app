import {
  PostLikeWithRelations,
  PostWithRelations,
} from '@/features/post/types';
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

  const userId = session?.user.id;

  if (session.user.username !== username)
    return NextResponse.json(
      { error: 'You do not have permission to view these likes' },
      { status: 403 },
    );

  try {
    const posts = (await prisma.postLike.findMany({
      where: { user: { username } },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          include: {
            user: {
              select: { id: true, name: true, image: true, username: true },
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
        },
      },
    })) as PostLikeWithRelations[];

    const transformedPosts = posts.map((postLikeData) => {
      const { postLikes, bookmarks, _count, ...rest } = postLikeData.post;

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
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
