import { LIMIT } from '@/constants';
import { Post, PostLikeFromDB } from '@/features/post/types';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { getPostSelect } from '@/lib/prisma-fragments';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const session = await getSession();
  const { username } = await params;

  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (session.user.username !== username)
    return NextResponse.json(
      { error: 'You do not have permission to view these likes' },
      { status: 403 },
    );

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || LIMIT);

  let whereClause: Prisma.PostLikeWhereInput = { user: { username } };

  if (cursor) {
    const [datePart, idPart] = cursor.split('_');

    whereClause = {
      user: { username },
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
    const likedPostsData = (await prisma.postLike.findMany({
      where: whereClause,
      take: limit + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        createdAt: true,
        post: { select: getPostSelect(userId) },
      },
    })) as unknown as PostLikeFromDB[];

    const hasNextPage = likedPostsData.length > limit;
    const itemsToReturn = hasNextPage
      ? likedPostsData.slice(0, -1)
      : likedPostsData;
    const lastItem = itemsToReturn[itemsToReturn.length - 1];

    const transformedPosts = itemsToReturn.map((postLikeData) => {
      const {
        postLikes,
        bookmarks,
        _count,
        user: { followers, following, _count: userCount, ...restUser },
        ...restPost
      } = postLikeData.post;

      return {
        ...restPost,
        isBookmarked: bookmarks.length > 0,
        //  isLiked -> always true
        isLiked: postLikes.length > 0,
        likesCount: _count.postLikes,
        commentsCount: _count.comments,
        user: {
          ...restUser,
          isFollowing: followers.length > 0,
          followsYou: following.length > 0,
          isCurrentUser: restUser.id === userId,
          followersCount: userCount.followers,
          followingCount: userCount.following,
          postsCount: userCount.posts,
        },
      };
    }) satisfies Post[];

    return NextResponse.json({
      posts: transformedPosts,
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
