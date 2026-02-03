import { PostWithRelations } from '@/features/post/types';
import { TPostLikeFromDB } from '@/features/profile/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
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
  try {
    const posts = (await prisma.postLike.findMany({
      where: { user: { username } },
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
        },
      },
    })) as TPostLikeFromDB[];

    const transformedPosts = posts.map((postLikeData) => {
      const post = postLikeData.post;

      return {
        ...post,
        isBookmarked: post.bookmarks.length > 0,
        isLiked: true,
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

    return NextResponse.json(transformedPosts);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
