import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { TUserFromDB, UserWithRelations } from '@/features/profile/types';

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = decodeURIComponent(searchParams.get('q') || '');

    const userId = session.user.id;

    const users = (await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
        ],
        NOT: { id: userId },
      },
      include: {
        _count: {
          select: { followers: true, following: true },
        },
        followers: {
          where: { followerId: userId },
          select: { followerId: true },
        },
      },
    })) as TUserFromDB[];

    const transformedUsers = users.map((user) => ({
      ...user,
      isFollowing: user.followers.length > 0,
      isCurrentUser: user.id === userId,
    })) satisfies UserWithRelations[];

    return NextResponse.json(transformedUsers);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
