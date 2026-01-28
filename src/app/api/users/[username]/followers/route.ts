import { TFollowersFromBD, UserWithRelations } from '@/features/profile/types';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;

    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 },
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const followersList = (await prisma.follow.findMany({
      where: { followingId: targetUser.id },
      select: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
            followers: {
              where: { followerId: userId },
              select: { followerId: true },
            },
            _count: {
              select: {
                posts: true,
                followers: true,
                following: true,
              },
            },
          },
        },
      },
    })) as TFollowersFromBD[];

    const transformedFollowers = followersList.map((f) => {
      const user = f.follower;

      return {
        ...user,
        isCurrentUser: userId === user.id,
        isFollowing: user.followers.length > 0,
      } satisfies UserWithRelations;
    });

    NextResponse.json(transformedFollowers);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
