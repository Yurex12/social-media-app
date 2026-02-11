import { StateCreator } from 'zustand';
import { reconcileCount } from './helpers';

export interface CommentEntity {
  id: string;
  content: string;
  userId: string;
  postId: string;
  isLiked: boolean;
  likesCount: number;
  createdAt: Date;
}

export interface CommentEntitySlice {
  comments: Record<string, CommentEntity>;

  addComment: (comment: CommentEntity) => void;
  addComments: (comments: CommentEntity[]) => void;
  updateComment: (commentId: string, updates: Partial<CommentEntity>) => void;
  removeComment: (commentId: string) => void;
}

export const commentEntitySlice: StateCreator<CommentEntitySlice> = (set) => ({
  comments: {},

  addComment: (comment) =>
    set((state) => {
      const existing = state.comments[comment.id];

      if (!existing)
        return { comments: { ...state.comments, [comment.id]: comment } };

      return {
        comments: {
          ...state.comments,
          [comment.id]: {
            ...comment, // Fresh text/metadata
            isLiked: existing.isLiked, // Local truth
            likesCount: reconcileCount(
              existing.isLiked,
              comment.isLiked,
              comment.likesCount,
            ),
          },
        },
      };
    }),

  addComments: (comments) =>
    set((state) => {
      const next = { ...state.comments };

      comments.forEach((comment) => {
        const existing = next[comment.id];

        if (!existing) {
          next[comment.id] = comment;
        } else {
          next[comment.id] = {
            ...comment,
            isLiked: existing.isLiked,
            likesCount: reconcileCount(
              existing.isLiked,
              comment.isLiked,
              comment.likesCount,
            ),
          };
        }
      });

      return { comments: next };
    }),

  updateComment: (commentId, updates) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [commentId]: state.comments[commentId]
          ? { ...state.comments[commentId], ...updates }
          : state.comments[commentId],
      },
    })),

  removeComment: (commentId) =>
    set((state) => {
      const { [commentId]: _, ...rest } = state.comments;
      return { comments: rest };
    }),
});
