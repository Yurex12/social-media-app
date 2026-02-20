import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { Prisma } from '@/generated/prisma/client';
import { LIMIT } from '@/constants';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);

  const limit = parseInt(searchParams.get('limit') || LIMIT);
  const cursor = searchParams.get('cursor');

  let whereClause: Prisma.NotificationWhereInput = {
    recipientId: userId,
  };

  if (cursor) {
    const [datePart, idPart] = cursor.split('_');

    whereClause = {
      ...whereClause,
      OR: [
        { createdAt: { lt: new Date(datePart) } },
        {
          createdAt: new Date(datePart),
          id: { lt: idPart },
        },
      ],
    };
  }

  try {
    const notifications = await prisma.notification.findMany({
      take: limit + 1,
      where: whereClause,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        issuer: {
          select: {
            name: true,
            image: true,
            username: true,
          },
        },
      },
    });

    const hasNextPage = notifications.length > limit;
    const itemsToReturn = hasNextPage
      ? notifications.slice(0, -1)
      : notifications;

    const lastItem = itemsToReturn[itemsToReturn.length - 1];

    return NextResponse.json({
      notifications: itemsToReturn,
      nextCursor: hasNextPage
        ? `${lastItem.createdAt.toISOString()}_${lastItem.id}`
        : null,
    });
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
