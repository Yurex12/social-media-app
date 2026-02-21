import { LIMIT } from '@/constants';
import { CommentFromDB, Comment } from '@/features/comment/types';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { getUserSelect } from '@/lib/prisma-fragments';
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
  const { searchParams } = new URL(req.url);

  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || LIMIT);
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
      select: {
        id: true,
        content: true,
        createdAt: true,
        postId: true,
        userId: true,
        user: { select: getUserSelect(userId) },
        commentLikes: { where: { userId }, select: { userId: true } },
        _count: { select: { commentLikes: true } },
      },
    })) as unknown as CommentFromDB[];

    const hasNextPage = comments.length > limit;
    const itemsToReturn = hasNextPage ? comments.slice(0, -1) : comments;
    const lastItem = itemsToReturn[itemsToReturn.length - 1];

    const transformedComments = itemsToReturn.map((comment) => {
      const {
        commentLikes,
        _count,
        user: { followers, following, _count: userCount, ...restUser },
        ...restComment
      } = comment;

      return {
        ...restComment,
        isLiked: commentLikes.length > 0,
        likesCount: _count.commentLikes,
        user: {
          ...restUser,
          isCurrentUser: restUser.id === userId,
          followsYou: following.length > 0,
          isFollowing: followers.length > 0,
          followersCount: userCount.followers,
          followingCount: userCount.following,
          postsCount: userCount.posts,
        },
      };
    }) satisfies Comment[];

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
