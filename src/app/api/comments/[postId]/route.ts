import { CommentWithRelations, TCommentFromBD } from '@/features/comment/types';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

const LIMIT = 10;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId } = await params;
  const { searchParams } = new URL(req.url);

  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || LIMIT.toString());
  const userId = session.user.id;

  let whereClause: Prisma.CommentWhereInput = { postId };

  if (cursor) {
    const [datePart, idPart] = cursor.split('_');

    whereClause = {
      postId,
      OR: [
        { createdAt: { lt: new Date(datePart) } },
        {
          createdAt: new Date(datePart),
          id: { lt: idPart },
        },
      ],
    };
  }

  try {
    const comments = (await prisma.comment.findMany({
      take: limit + 1,
      where: whereClause,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            image: true,
            createdAt: true,
            _count: {
              select: {
                posts: true,
                followers: true,
                following: true,
              },
            },
            followers: {
              where: { followerId: userId },
              select: { followerId: true },
            },
            following: {
              where: { followingId: userId },
              select: { followingId: true },
            },
          },
        },
        commentLikes: {
          where: {
            userId,
          },
          select: { userId: true },
        },
        _count: {
          select: {
            commentLikes: true,
          },
        },
      },
    })) as TCommentFromBD[];

    const hasNextPage = comments.length > limit;
    const itemsToReturn = hasNextPage ? comments.slice(0, -1) : comments;
    const lastItem = itemsToReturn[itemsToReturn.length - 1];

    const transformedComments = itemsToReturn.map((comment) => {
      return {
        ...comment,
        isLiked: comment.commentLikes.length > 0,
        likesCount: comment._count.commentLikes,
        user: {
          ...comment.user,
          isCurrentUser: comment.user.id === userId,
          followsYou: comment.user.following.length > 0,
          isFollowing: comment.user.followers.length > 0,
          followersCount: comment.user._count.followers,
          followingCount: comment.user._count.following,
          postsCount: comment.user._count.posts,
        },
      };
    }) satisfies CommentWithRelations[];

    return NextResponse.json({
      comments: transformedComments,
      nextCursor: hasNextPage
        ? `${lastItem.createdAt.toISOString()}_${lastItem.id}`
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
