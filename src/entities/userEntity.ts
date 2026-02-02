import { StateCreator } from 'zustand';

export interface UserEntity {
  id: string;
  name: string;
  username: string;
  image: string | null;
  bio: string | null;
  isFollowing: boolean;
  isCurrentUser: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
}

export interface UserEntitySlice {
  users: Record<string, UserEntity>;

  addUser: (user: UserEntity) => void;
  addUsers: (users: UserEntity[]) => void;
  updateUser: (userId: string, updates: Partial<UserEntity>) => void;
  removeUser: (userId: string) => void;
}

export const createUserEntitySlice: StateCreator<UserEntitySlice> = (set) => ({
  users: {},

  addUser: (user) =>
    set((state) => ({
      users: {
        ...state.users,
        [user.id]: {
          ...state.users[user.id],
          ...user,
        },
      },
    })),

  addUsers: (users) =>
    set((state) => {
      const next = { ...state.users };
      users.forEach((user) => {
        next[user.id] = {
          ...next[user.id],
          ...user,
        };
      });
      return { users: next };
    }),

  updateUser: (userId, updates) =>
    set((state) => ({
      users: {
        ...state.users,
        [userId]: state.users[userId]
          ? { ...state.users[userId], ...updates }
          : state.users[userId],
      },
    })),

  removeUser: (userId) =>
    set((state) => {
      const { [userId]: _, ...rest } = state.users;
      return { users: rest };
    }),
});
