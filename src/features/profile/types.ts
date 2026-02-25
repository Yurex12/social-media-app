import { Prisma } from '@/generated/prisma/client';
import { getUserSelect } from '@/lib/prisma-fragments';
import { useEditProfile } from './hooks/useEditProfile';

import { User as UserFromSession } from '@/lib/auth';

type EditProfileMutate = ReturnType<typeof useEditProfile>['editProfile'];

export type UserFromDB = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserSelect>;
}>;

export type User = Omit<UserFromDB, 'followers' | 'following' | '_count'> & {
  isCurrentUser: boolean;
  isFollowing: boolean;
  followsYou: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
};

export type FollowerFromDB = Prisma.FollowGetPayload<{
  select: {
    createdAt: true;
    followerId: true;
    follower: { select: ReturnType<typeof getUserSelect> };
  };
}>;

export type FollowingFromDB = Prisma.FollowGetPayload<{
  select: {
    createdAt: true;
    followingId: true;
    following: { select: ReturnType<typeof getUserSelect> };
  };
}>;

export interface AuthorCardProps {
  userId: string | undefined;
  isPending: boolean;
  error: Error | null;
}

export interface UserResponse {
  users: User[];
  nextCursor: string | null;
}

export type EditProfilePayload = {
  bio?: string;
  name?: string;
  image?: string | File | null;
  coverImage?: string | File | null;
  imageFileId?: string | null;
  coverImageFileId?: string | null;
};

export type EditProfileFormProps = {
  user: UserFromSession;
  isEditingProfile: boolean;
  refetchSession: VoidFunction;
  onClose: VoidFunction;
  onEditProfile: EditProfileMutate;
};
