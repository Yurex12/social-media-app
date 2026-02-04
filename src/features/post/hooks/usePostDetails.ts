import { selectPostById } from '@/entities/postSelectors';
import { useEntityStore } from '@/entities/store';
import { normalizePost } from '@/entities/utils';
import { useQuery } from '@tanstack/react-query';
import { getPostById } from '../api';

export function usePostDetails(id: string) {
  const addPost = useEntityStore((state) => state.addPost);
  const addUser = useEntityStore((state) => state.addUser);

  const postInStore = useEntityStore((state) => selectPostById(state, id));

  const { isPending, error } = useQuery({
    queryKey: ['posts', id],
    enabled: !!id,
    queryFn: async () => {
      const post = await getPostById(id);

      const { post: normalizedPost, user: normalizedUser } =
        normalizePost(post);

      addPost(normalizedPost);
      addUser(normalizedUser);

      return normalizedPost.id;
    },
  });

  return {
    postId: postInStore ? postInStore.id : undefined,
    isPending: isPending && !postInStore,
    error,
  };
}
