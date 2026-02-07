import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { TUserFromDB, UserWithRelations } from '@/features/profile/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { username } = await params;

    const userId = session.user.id;

    if (!username) {
      return NextResponse.json(
        { message: 'Username is required' },
        { status: 400 },
      );
    }

    const user = (await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        image: true,
        username: true,
        createdAt: true,
        bio: true,
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
        following: {
          where: { followingId: userId },
          select: { followingId: true },
        },
      },
    })) as TUserFromDB;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const isCurrentUser = session.user.id === user.id;

    const transFormedUser = {
      ...user,
      isCurrentUser,
      isFollowing: user.followers.length > 0,
      followsYou: user.following.length > 0,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      postsCount: user._count.posts,
    } satisfies UserWithRelations;

    return NextResponse.json(transFormedUser);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
