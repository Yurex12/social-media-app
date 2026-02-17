import { TBookmarkFromDB } from '@/features/bookmark/types';
import { PostWithRelations } from '@/features/post/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';

const LIMIT = 10;

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || LIMIT.toString());

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
      include: {
        post: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true,
                bio: true,
                createdAt: true,
                coverImage: true,
                _count: {
                  select: { followers: true, following: true, posts: true },
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
            images: { select: { id: true, url: true, fileId: true } },
            postLikes: {
              where: { userId: userId },
              select: { id: true },
            },
            _count: {
              select: { postLikes: true, comments: true },
            },
          },
        },
      },
    })) as TBookmarkFromDB[];

    const hasNextPage = bookmarks.length > limit;
    const itemsToReturn = hasNextPage ? bookmarks.slice(0, -1) : bookmarks;
    const lastItem = itemsToReturn[itemsToReturn.length - 1];

    const transformedPosts = itemsToReturn.map((bookmark) => {
      const post = bookmark.post;

      return {
        ...post,
        isBookmarked: true,
        isLiked: post.postLikes.length > 0,
        likesCount: post._count.postLikes,
        commentsCount: post._count.comments,
        user: {
          ...post.user,
          isFollowing: post.user.followers.length > 0,
          followsYou: post.user.following.length > 0,
          isCurrentUser: post.user.id === userId,
          followersCount: post.user._count.followers,
          followingCount: post.user._count.following,
          postsCount: post.user._count.posts,
        },
      };
    }) satisfies PostWithRelations[];

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
