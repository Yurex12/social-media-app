import { CommentEntity } from './commentEntity';

type CommentState = { comments: Record<string, CommentEntity> };

export const selectCommentById = (
  state: CommentState,
  commentId: string | undefined,
) => (commentId ? state.comments[commentId] : undefined);

export const selectCommentsByIds = (
  state: CommentState,
  commentIds: string[] | undefined,
) =>
  commentIds ? commentIds.map((id) => state.comments[id]).filter(Boolean) : [];
