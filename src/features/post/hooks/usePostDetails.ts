import { selectPostById } from '@/entities/postSelectors';
import { useEntityStore } from '@/entities/store';
import { normalizePost } from '@/entities/utils';
import { useQuery } from '@tanstack/react-query';
import { getPostById } from '../api';

export function usePostDetails(id: string) {
  const addPost = useEntityStore((state) => state.addPost);
  const addUser = useEntityStore((state) => state.addUser);
  const removePost = useEntityStore((state) => state.removePost);

  const postInStore = useEntityStore((state) => selectPostById(state, id));

  const { isPending, error } = useQuery({
    queryKey: ['posts', id],
    enabled: !!id,
    staleTime: 0,
    gcTime: 1000 * 60 * 15,
    queryFn: async () => {
      const post = await getPostById(id);

      if (!post) {
        removePost(id);
        throw new Error('Post not found');
      }

      const { post: normalizedPost, user: normalizedUser } =
        normalizePost(post);

      addPost(normalizedPost);
      addUser(normalizedUser);

      return normalizedPost.id;
    },
  });

  return {
    post: postInStore,
    isPending: isPending && !postInStore,
    error,
  };
}
