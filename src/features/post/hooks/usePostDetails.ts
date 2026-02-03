import { useEntityStore } from '@/entities/store';
import { useQuery } from '@tanstack/react-query';
import { getPostById } from '../api';
import { normalizePost } from '@/entities/utils';
import { useStore } from 'zustand';
import { selectPostById } from '@/entities/postSelectors';

export function usePostDetails(id: string) {
  const addPost = useEntityStore((state) => state.addPost);
  const addUser = useEntityStore((state) => state.addUser);

  const postInStore = useStore(useEntityStore, selectPostById(id));

  const { data, isPending, error } = useQuery({
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

    initialData: () => (postInStore ? id : undefined),
  });

  return { postId: data, isPending, error };
}
