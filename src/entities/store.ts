import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PostEntitySlice, postEntitySlice } from './postEntity';
import { UserEntitySlice, userEntitySlice } from './userEntity';
import { CommentEntitySlice, commentEntitySlice } from './commentEntity';

type EntityStore = PostEntitySlice & UserEntitySlice & CommentEntitySlice;

export const useEntityStore = create<EntityStore>()(
  devtools(
    (...args) => ({
      ...postEntitySlice(...args),
      ...userEntitySlice(...args),
      ...commentEntitySlice(...args),
    }),
    { name: 'EntityStore' },
  ),
);
