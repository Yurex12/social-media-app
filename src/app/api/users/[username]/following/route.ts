import { LIMIT } from '@/constants';
import { FollowingFromDB, User } from '@/features/profile/types';
import { getUserSelect } from '@/lib/prisma-fragments';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const session = await getSession();

    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const { username } = await params;

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || LIMIT);

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

    let whereClause: Prisma.FollowWhereInput = {
      followerId: targetUser.id,
    };

    if (cursor) {
      const [datePart, idPart] = cursor.split('_');

      whereClause = {
        AND: [
          { followerId: targetUser.id },
          {
            OR: [
              { createdAt: { lt: new Date(datePart) } },
              {
                createdAt: new Date(datePart),
                followingId: { lt: idPart },
              },
            ],
          },
        ],
      };
    }

    const followingList = (await prisma.follow.findMany({
      take: limit + 1,
      where: whereClause,
      orderBy: [{ createdAt: 'desc' }, { followingId: 'desc' }],
      select: {
        createdAt: true,
        followingId: true,
        following: { select: getUserSelect(userId) },
      },
    })) as unknown as FollowingFromDB[];

    const hasNextPage = followingList.length > limit;
    const followingToReturn = hasNextPage
      ? followingList.slice(0, -1)
      : followingList;
    const lastItem = followingToReturn[followingToReturn.length - 1];

    const transformedFollowing = followingToReturn.map((f) => {
      const { followers, following, _count, ...restUser } = f.following;

      return {
        ...restUser,
        isCurrentUser: userId === restUser.id,
        isFollowing: followers.length > 0,
        followsYou: following.length > 0,
        followersCount: _count.followers,
        followingCount: _count.following,
        postsCount: _count.posts,
      };
    }) satisfies User[];

    return NextResponse.json({
      users: transformedFollowing,
      nextCursor: hasNextPage
        ? `${lastItem.createdAt.toISOString()}_${lastItem.followingId}`
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
