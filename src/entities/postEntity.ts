import { StateCreator } from 'zustand';
import { reconcileCount } from './helpers';
import { Post } from '@/features/post/types';

export interface PostImage {
  id: string;
  url: string;
  fileId: string;
  width: number;
  height: number;
}

export type PostEntity = Omit<Post, 'user'>;

export interface PostEntitySlice {
  posts: Record<string, PostEntity>;

  addPost: (post: PostEntity) => void;
  addPosts: (post: PostEntity[]) => void;
  updatePost: (postId: string, post: Partial<PostEntity>) => void;
  removePost: (postId: string) => void;
  incrementPostCount: (
    postId: string,
    field: 'likesCount' | 'commentsCount',
  ) => void;
  decrementPostCount: (
    postId: string,
    field: 'likesCount' | 'commentsCount',
  ) => void;
}

export const postEntitySlice: StateCreator<PostEntitySlice> = (set) => ({
  posts: {},

  addPost: (post) =>
    set((state) => {
      const existing = state.posts[post.id];

      if (!existing) return { posts: { ...state.posts, [post.id]: post } };

      return {
        posts: {
          ...state.posts,
          [post.id]: {
            ...post,
            isLiked: existing.isLiked,
            isBookmarked: existing.isBookmarked,

            likesCount: reconcileCount(
              existing.isLiked,
              post.isLiked,
              post.likesCount,
            ),
          },
        },
      };
    }),

  addPosts: (posts) =>
    set((state) => {
      const next = { ...state.posts };

      posts.forEach((post) => {
        const existing = next[post.id];

        if (!existing) {
          next[post.id] = post;
        } else {
          next[post.id] = {
            ...post,
            isLiked: existing.isLiked,
            isBookmarked: existing.isBookmarked,
            likesCount: reconcileCount(
              existing.isLiked,
              post.isLiked,
              post.likesCount,
            ),
          };
        }
      });

      return { posts: next };
    }),

  updatePost: (postId, updates) => {
    set((state) => ({
      posts: {
        ...state.posts,
        [postId]: state.posts[postId]
          ? { ...state.posts[postId], ...updates }
          : state.posts[postId],
      },
    }));
  },

  removePost: (postId) =>
    set((state) => {
      const { [postId]: _, ...rest } = state.posts;
      return { posts: rest };
    }),

  incrementPostCount: (postId, field) =>
    set((state) => {
      const post = state.posts[postId];
      if (!post) return state;
      return {
        posts: {
          ...state.posts,
          [postId]: { ...post, [field]: post[field] + 1 },
        },
      };
    }),

  decrementPostCount: (postId, field) =>
    set((state) => {
      const post = state.posts[postId];
      if (!post || post[field] <= 0) return state;
      return {
        posts: {
          ...state.posts,
          [postId]: { ...post, [field]: post[field] - 1 },
        },
      };
    }),
});
