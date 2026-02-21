import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

import { getPostSelect } from '@/lib/prisma-fragments';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';

import { Post, PostFromDB } from '@/features/post/types';

import { LIMIT } from '@/constants';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = decodeURIComponent(searchParams.get('q') || '').trim();
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || LIMIT);

    const userId = session.user.id;

    let whereClause: Prisma.PostWhereInput = {
      content: { contains: query, mode: 'insensitive' },
    };

    if (cursor) {
      const [datePart, idPart] = cursor.split('_');

      whereClause = {
        AND: [
          { content: { contains: query, mode: 'insensitive' } },
          {
            OR: [
              { createdAt: { lt: new Date(datePart) } },
              {
                createdAt: new Date(datePart),
                id: { lt: idPart },
              },
            ],
          },
        ],
      };
    }

    const posts = (await prisma.post.findMany({
      take: limit + 1,
      where: whereClause,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: getPostSelect(userId),
    })) as unknown as PostFromDB[];

    const hasNextPage = posts.length > limit;
    const postToReturn = hasNextPage ? posts.slice(0, -1) : posts;
    const lastPost = postToReturn[postToReturn.length - 1];

    const transformedPosts = postToReturn.map((post) => {
      const {
        postLikes,
        bookmarks,
        _count,
        user: { followers, following, _count: userCount, ...restUser },
        ...restPost
      } = post;

      return {
        ...restPost,
        user: {
          ...restUser,
          isFollowing: followers.length > 0,
          followsYou: following.length > 0,
          isCurrentUser: restUser.id === userId,
          followersCount: userCount.followers,
          followingCount: userCount.following,
          postsCount: userCount.posts,
        },
        isBookmarked: bookmarks.length > 0,
        isLiked: postLikes.length > 0,
        likesCount: _count.postLikes,
        commentsCount: _count.comments,
      };
    }) satisfies Post[];

    return NextResponse.json({
      posts: transformedPosts,
      nextCursor: hasNextPage
        ? `${lastPost.createdAt.toISOString()}_${lastPost.id}`
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
