import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PostEntitySlice, postEntitySlice } from './postEntity';
import { UserEntitySlice, userEntitySlice } from './userEntity';

type EntityStore = PostEntitySlice & UserEntitySlice;

export const useEntityStore = create<EntityStore>()(
  devtools(
    (...args) => ({
      ...postEntitySlice(...args),
      ...userEntitySlice(...args),
    }),
    { name: 'EntityStore' },
  ),
);
