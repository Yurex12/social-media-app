import { UserEntity } from './userEntity';

type UserState = {
  users: Record<string, UserEntity>;
};

export const selectUserById = (userId: string) => (state: UserState) =>
  state.users[userId];

export const selectUsersByIds = (userIds: string[]) => (state: UserState) =>
  userIds.map((id) => state.users[id]).filter(Boolean);
