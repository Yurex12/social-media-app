import { Post, PostFromDB } from '@/features/post/types';

import prisma from '@/lib/prisma';
import { getPostSelect } from '@/lib/prisma-fragments';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const userId = session.user.id;

  try {
    const post = (await prisma.post.findUnique({
      where: { id },
      select: getPostSelect(userId),
    })) as unknown as PostFromDB | null;

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const {
      postLikes,
      bookmarks,
      _count,
      user: { followers, following, _count: userCount, ...restUser },
      ...restPost
    } = post;

    const transformedPost = {
      ...restPost,
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
    } satisfies Post;

    return NextResponse.json(transformedPost);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
