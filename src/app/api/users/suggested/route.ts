import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { UserFromDB, User } from '@/features/profile/types';
import { getUserSelect } from '@/lib/prisma-fragments';

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : null;

    const userId = session.user.id;

    const result = (await prisma.user.findMany({
      where: {
        id: { not: userId },
        followers: { none: { followerId: userId } },
      },
      select: getUserSelect(userId),
      take: 50,
    })) as unknown as UserFromDB[];

    const shuffled = result.sort(() => 0.5 - Math.random());
    const users = limit ? shuffled.slice(0, limit) : shuffled;

    const transformedUsers = users.map((user) => {
      const { followers, following, _count, ...restUser } = user;

      return {
        ...restUser,
        //  isFollowing -> always false
        isFollowing: followers.length > 0,
        followsYou: following.length > 0,
        isCurrentUser: false,
        followersCount: _count.followers,
        followingCount: _count.following,
        postsCount: _count.posts,
      };
    }) satisfies User[];

    return NextResponse.json(transformedUsers);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
