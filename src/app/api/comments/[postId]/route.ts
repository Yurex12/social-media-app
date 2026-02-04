import { CommentWithRelations, TCommentFromBD } from '@/features/comment/types';
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

    const transformedComments = comments.map((comment) => {
      return {
        ...comment,
        isLiked: comment.commentLikes.length > 0,
        likesCount: comment._count.commentLikes,
        user: {
          ...comment.user,
          isCurrentUser: comment.user.id === userId,
          isFollowing: comment.user.followers.length > 0,
          followersCount: comment.user._count.followers,
          followingCount: comment.user._count.following,
          postsCount: comment.user._count.posts,
        },
      };
    }) satisfies CommentWithRelations[];

    return NextResponse.json(transformedComments);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
