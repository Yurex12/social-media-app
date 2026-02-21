import { NextRequest, NextResponse } from 'next/server';

import { getSession } from '@/lib/session';

import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { getPostSelect } from '@/lib/prisma-fragments';
import { BookmarkFromDB } from '@/features/bookmark/types';
import { Post } from '@/features/post/types';

import { LIMIT } from '@/constants';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || LIMIT);

  let whereClause: Prisma.BookmarkWhereInput = { userId };

  if (cursor) {
    const [datePart, idPart] = cursor.split('_');
    whereClause = {
      userId,
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
    const bookmarks = (await prisma.bookmark.findMany({
      where: whereClause,
      take: limit + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        post: { select: getPostSelect(userId) },
      },
    })) as unknown as BookmarkFromDB[];

    const hasNextPage = bookmarks.length > limit;
    const itemsToReturn = hasNextPage ? bookmarks.slice(0, -1) : bookmarks;
    const lastItem = itemsToReturn[itemsToReturn.length - 1];

    const transformedPosts = itemsToReturn.map((bookmark) => {
      const {
        postLikes,
        _count,
        user: { followers, following, _count: userCount, ...restUser },
        bookmarks,
        ...restPost
      } = bookmark.post;

      return {
        ...restPost,
        //  isBookmarked -> always true
        isBookmarked: bookmarks.length > 0,
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
