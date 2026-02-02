import { TBookmarkFromDB } from '@/features/bookmark/types';
import { PostWithRelations } from '@/features/post/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  try {
    const bookmarks = (await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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
                _count: {
                  select: { followers: true, following: true, posts: true },
                },
                followers: {
                  where: { followerId: userId },
                  select: { followerId: true },
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

    const transformedBookmarks = bookmarks.map((bookmark) => {
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
          isCurrentUser: post.user.id === userId,
          followersCount: post.user._count.followers,
          followingCount: post.user._count.following,
          postsCount: post.user._count.posts,
        },
      };
    }) satisfies PostWithRelations[];

    return NextResponse.json(transformedBookmarks);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
