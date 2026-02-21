import { Prisma } from '@/generated/prisma/client';
import { getPostSelect } from '@/lib/prisma-fragments';

export type BookmarkFromDB = Prisma.BookmarkGetPayload<{
  select: {
    id: true;
    createdAt: true;
    post: { select: ReturnType<typeof getPostSelect> };
  };
}>;
