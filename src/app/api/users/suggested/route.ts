import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : null;

    const userId = session.user.id;

    const result = await prisma.user.findMany({
      where: {
        id: { not: userId },
        followers: {
          none: {
            followerId: userId,
          },
        },
      },
      take: 50,
    });

    const shuffled = result.sort(() => 0.5 - Math.random());

    const users = limit ? shuffled.slice(0, limit) : shuffled;

    const transformedUsers = users.map((user) => ({
      ...user,
      isFollowing: false,
    }));

    return NextResponse.json(transformedUsers);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
