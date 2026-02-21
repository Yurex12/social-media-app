import { LIMIT } from '@/constants';
import { FollowerFromDB, User } from '@/features/profile/types';
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
      followingId: targetUser.id,
    };

    if (cursor) {
      const [datePart, idPart] = cursor.split('_');

      whereClause = {
        AND: [
          { followingId: targetUser.id },
          {
            OR: [
              { createdAt: { lt: new Date(datePart) } },
              {
                createdAt: new Date(datePart),
                followerId: { lt: idPart },
              },
            ],
          },
        ],
      };
    }

    const followersList = (await prisma.follow.findMany({
      take: limit + 1,
      where: whereClause,
      orderBy: [{ createdAt: 'desc' }, { followerId: 'desc' }],
      select: {
        createdAt: true,
        followerId: true,
        follower: { select: getUserSelect(userId) },
      },
    })) as unknown as FollowerFromDB[];

    const hasNextPage = followersList.length > limit;
    const followersToReturn = hasNextPage
      ? followersList.slice(0, -1)
      : followersList;
    const lastFollower = followersToReturn[followersToReturn.length - 1];

    const transformedFollowers = followersToReturn.map((f) => {
      const { followers, following, _count, ...restUser } = f.follower;

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
      users: transformedFollowers,
      nextCursor: hasNextPage
        ? `${lastFollower.createdAt.toISOString()}_${lastFollower.followerId}`
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
