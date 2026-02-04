import { PostEntity } from './postEntity';

type PostState = { posts: Record<string, PostEntity> };

export const selectPostById = (state: PostState, postId: string | undefined) =>
  postId ? state.posts[postId] : undefined;

export const selectPostsByIds = (
  state: PostState,
  postIds: string[] | undefined,
) => (postIds ? postIds.map((id) => state.posts[id]).filter(Boolean) : []);
