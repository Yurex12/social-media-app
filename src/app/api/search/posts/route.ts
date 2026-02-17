import { PostWithRelations, TPostFromDB } from '@/features/post/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';

const LIMIT = 10;

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = decodeURIComponent(searchParams.get('q') || '').trim();
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || LIMIT.toString());

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
    })) as TPostFromDB[];

    const hasNextPage = posts.length > limit;
    const postToReturn = hasNextPage ? posts.slice(0, -1) : posts;
    const lastPost = postToReturn[postToReturn.length - 1];

    const transformedPosts = postToReturn.map((post) => {
      return {
        ...post,
        user: {
          ...post.user,
          isFollowing: post.user.followers.length > 0,
          followsYou: post.user.following.length > 0,
          isCurrentUser: post.user.id === userId,
          followersCount: post.user._count.followers,
          followingCount: post.user._count.following,
          postsCount: post.user._count.posts,
        },
        isBookmarked: post.bookmarks.length > 0,
        isLiked: post.postLikes.length > 0,
        likesCount: post._count.postLikes,
        commentsCount: post._count.comments,
      };
    }) satisfies PostWithRelations[];

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
