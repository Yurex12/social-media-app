import { CommentWithRelations } from '@/features/comment/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId } = await params;

  const userId = session.user.id;

  try {
    const comments = (await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, image: true, username: true } },
        commentLikes: {
          where: {
            userId,
          },
          select: { id: true },
        },
        _count: {
          select: {
            commentLikes: true,
          },
        },
      },
    })) as CommentWithRelations[];

    const transformedComments = comments.map((comment) => {
      const { commentLikes, _count, ...rest } = comment;
      return {
        ...rest,
        isLiked: commentLikes.length > 0,
        likeCount: _count.commentLikes,
      };
    });

    return NextResponse.json(transformedComments);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
