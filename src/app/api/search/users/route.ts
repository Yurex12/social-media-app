import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { TUserFromDB, UserWithRelations } from '@/features/profile/types';
import { Prisma } from '@/generated/prisma/client';

const LIMIT = 10;

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = decodeURIComponent(searchParams.get('q') || '').trim();
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || LIMIT.toString());

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
      select: {
        id: true,
        name: true,
        image: true,
        username: true,
        createdAt: true,
        bio: true,
        coverImage: true,
        _count: {
          select: { followers: true, following: true, posts: true },
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
    })) as unknown as TUserFromDB[];

    const hasNextPage = users.length > limit;
    const usersToReturn = hasNextPage ? users.slice(0, -1) : users;
    const lastUser = usersToReturn[usersToReturn.length - 1];

    const transformedUsers = usersToReturn.map((user) => ({
      ...user,
      isFollowing: user.followers.length > 0,
      followsYou: user.following.length > 0,
      isCurrentUser: user.id === userId,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      postsCount: user._count.posts,
    })) satisfies UserWithRelations[];

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
