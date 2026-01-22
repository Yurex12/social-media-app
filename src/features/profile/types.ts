import { Prisma } from '@/generated/prisma/client';

export type UserWithRelation = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: {
        followers: true;
        following: true;
        posts: true;
      };
    };
  };
}> & { isCurrentUser: boolean };

interface Author {
  name: string;
  id: string;
  image: string | null;
  username: string;
  bio: string | null;
  _count: {
    followers: number;
    following: number;
  };
}
export interface SuggestedUsers {
  name: string;
  id: string;
  image: string | null;
  username: string;
  bio: string | null;
}

export interface AuthorCardProps {
  user: Author | undefined;
  isPending: boolean;
  error: Error | null;
}
