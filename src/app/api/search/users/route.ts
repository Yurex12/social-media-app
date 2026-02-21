import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { UserFromDB, User } from '@/features/profile/types';
import { getUserSelect } from '@/lib/prisma-fragments';
import { Prisma } from '@/generated/prisma/client';
import { LIMIT } from '@/constants';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = decodeURIComponent(searchParams.get('q') || '').trim();
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || LIMIT);

    const userId = session.user.id;

    let whereClause: Prisma.UserWhereInput = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
      ],
      NOT: { id: userId },
    };

    if (cursor) {
      const [datePart, idPart] = cursor.split('_');

      whereClause = {
        AND: [
          whereClause,
          {
            OR: [
              { createdAt: { lt: new Date(datePart) } },
              {
                createdAt: new Date(datePart),
                id: { lt: idPart },
              },
            ],
          },
        ],
      };
    }

    const users = (await prisma.user.findMany({
      take: limit + 1,
      where: whereClause,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: getUserSelect(userId),
    })) as unknown as UserFromDB[];

    const hasNextPage = users.length > limit;
    const usersToReturn = hasNextPage ? users.slice(0, -1) : users;
    const lastUser = usersToReturn[usersToReturn.length - 1];

    const transformedUsers = usersToReturn.map((user) => {
      const { followers, following, _count, ...restUser } = user;

      return {
        ...restUser,
        isFollowing: followers.length > 0,
        followsYou: following.length > 0,
        isCurrentUser: restUser.id === userId,
        followersCount: _count.followers,
        followingCount: _count.following,
        postsCount: _count.posts,
      };
    }) satisfies User[];

    return NextResponse.json({
      users: transformedUsers,
      nextCursor: hasNextPage
        ? `${lastUser.createdAt.toISOString()}_${lastUser.id}`
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
