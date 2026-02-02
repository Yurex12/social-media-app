import { PostEntity } from './postEntity';

type PostState = { posts: Record<string, PostEntity> };

export const selectPostById =
  (postId: string | undefined) => (state: PostState) =>
    postId ? state.posts[postId] : undefined;

export const selectPostsByIds =
  (postIds: string[] | undefined) => (state: PostState) =>
    postIds ? postIds.map((id) => state.posts[id]).filter(Boolean) : [];
