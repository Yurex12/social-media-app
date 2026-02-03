import { StateCreator } from 'zustand';

export interface PostImage {
  id: string;
  url: string;
  fileId: string;
}

export interface PostEntity {
  id: string;
  content: string | null;
  images: PostImage[];
  userId: string;
  isLiked: boolean;
  isBookmarked: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}

export interface PostEntitySlice {
  posts: Record<string, PostEntity>;

  addPost: (post: PostEntity) => void;
  addPosts: (post: PostEntity[]) => void;
  updatePost: (postId: string, post: Partial<PostEntity>) => void;
  removePost: (postId: string) => void;
  toggleLike: (postId: string) => void;
}

export const createPostEntitySlice: StateCreator<PostEntitySlice> = (set) => ({
  posts: {},

  addPost: (post) =>
    set((state) => ({
      posts: {
        ...state.posts,
        [post.id]: {
          ...state.posts[post.id],
          ...post,
        },
      },
    })),

  addPosts: (posts) =>
    set((state) => {
      const next = { ...state.posts };

      posts.forEach((post) => {
        next[post.id] = {
          ...next[post.id],
          ...post,
        };
      });

      return { posts: next };
    }),

  updatePost: (postId, updates) =>
    set((state) => ({
      posts: {
        ...state.posts,
        [postId]: state.posts[postId]
          ? { ...state.posts[postId], ...updates }
          : state.posts[postId],
      },
    })),

  removePost: (postId) =>
    set((state) => {
      const { [postId]: _, ...rest } = state.posts;
      return { posts: rest };
    }),

  toggleLike: (postId: string) =>
    set((state) => {
      const post = state.posts[postId];
      if (!post) return state;

      const willBeLiked = !post.isLiked;

      return {
        posts: {
          ...state.posts,
          [postId]: {
            ...post,
            isLiked: willBeLiked,
            likesCount: willBeLiked
              ? post.likesCount + 1
              : Math.max(0, post.likesCount - 1),
          },
        },
      };
    }),
});
