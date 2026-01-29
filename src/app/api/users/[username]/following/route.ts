import { TFollowingFromBD, UserWithRelations } from '@/features/profile/types';
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

    const followingList = (await prisma.follow.findMany({
      where: { followerId: targetUser.id },
      select: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
            createdAt: true,
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
    })) as TFollowingFromBD[];

    const transformedFollowing = followingList.map((f) => {
      const user = f.following;

      return {
        ...user,
        isCurrentUser: userId === user.id,
        isFollowing: user.followers.length > 0,
      };
    }) satisfies UserWithRelations[];

    return NextResponse.json(transformedFollowing);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
