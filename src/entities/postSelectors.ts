import { PostEntity } from './postEntity';

type PostState = { posts: Record<string, PostEntity> };

export const selectPostById = (postId: string) => (state: PostState) =>
  state.posts[postId];

export const selectPostsByIds = (postIds: string[]) => (state: PostState) =>
  postIds.map((id) => state.posts[id]).filter(Boolean);
