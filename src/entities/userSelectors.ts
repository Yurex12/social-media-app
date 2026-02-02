import { UserEntity } from './userEntity';

type UserState = {
  users: Record<string, UserEntity>;
};

export const selectUserById =
  (userId: string | undefined) => (state: UserState) =>
    userId ? state.users[userId] : undefined;

export const selectUsersByIds =
  (userIds: string[] | undefined) => (state: UserState) =>
    userIds ? userIds.map((id) => state.users[id]).filter(Boolean) : [];
