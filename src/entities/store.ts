import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PostEntitySlice, createPostEntitySlice } from './postEntity';
import { UserEntitySlice, createUserEntitySlice } from './userEntity';

type EntityStore = PostEntitySlice & UserEntitySlice;

export const useEntityStore = create<EntityStore>()(
  devtools(
    (...args) => ({
      ...createPostEntitySlice(...args),
      ...createUserEntitySlice(...args),
    }),
    { name: 'EntityStore' },
  ),
);
