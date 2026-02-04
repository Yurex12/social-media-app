import { StateCreator } from 'zustand';

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
    set((state) => ({
      comments: {
        ...state.comments,
        [comment.id]: {
          ...state.comments[comment.id],
          ...comment,
        },
      },
    })),

  addComments: (comments) =>
    set((state) => {
      const next = { ...state.comments };
      comments.forEach((comment) => {
        next[comment.id] = {
          ...next[comment.id],
          ...comment,
        };
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
