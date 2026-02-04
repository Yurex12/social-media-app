import { UserEntity } from './userEntity';

type UserState = {
  users: Record<string, UserEntity>;
};

export const selectUserById = (state: UserState, userId: string | undefined) =>
  userId ? state.users[userId] : undefined;

export const selectUsersByIds = (
  state: UserState,
  userIds: string[] | undefined,
) => (userIds ? userIds.map((id) => state.users[id]).filter(Boolean) : []);
