import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { UserFromDB, User } from '@/features/profile/types';
import { getUserSelect } from '@/lib/prisma-fragments';

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
      select: getUserSelect(userId),
    })) as unknown as UserFromDB | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { followers, following, _count, ...restUser } = user;

    const transformedUser = {
      ...restUser,
      isCurrentUser: userId === restUser.id,
      isFollowing: followers.length > 0,
      followsYou: following.length > 0,
      followersCount: _count.followers,
      followingCount: _count.following,
      postsCount: _count.posts,
    } satisfies User;

    return NextResponse.json(transformedUser);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
