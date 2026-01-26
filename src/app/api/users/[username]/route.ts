import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

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

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
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
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isCurrentUser = session.user.id === user.id;

    return NextResponse.json({
      ...user,
      isCurrentUser,
      isFollowing: user.followers.length > 0,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
