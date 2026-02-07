import { useEntityStore } from '@/entities/store';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteCommentAction } from '../action';

export function useDeleteComment() {
  const removeComment = useEntityStore((state) => state.removeComment);
  const addComment = useEntityStore((state) => state.addComment);
  const updatePost = useEntityStore((state) => state.updatePost);

  const { mutate: deleteComment, isPending } = useMutation({
    mutationFn: deleteCommentAction,

    onMutate: async (commentId) => {
      const state = useEntityStore.getState();
      const comment = state.comments[commentId];
      if (!comment) return;

      const postId = comment.postId;
      const post = state.posts[postId];

      if (!post) return;

      removeComment(commentId);

      if (post) updatePost(postId, { commentsCount: post.commentsCount - 1 });

      return { comment, post };
    },

    onSuccess: () => {
      toast.success('Comment deleted');
    },

    onError: (error, commentId, context) => {
      if (context?.comment) addComment(context.comment);
      if (context?.post) {
        updatePost(context.post.id, {
          commentsCount: context.post.commentsCount,
        });
      }
      toast.error('Delete failed');
    },
  });

  return { deleteComment, isPending };
}
