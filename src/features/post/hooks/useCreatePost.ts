import { useEntityStore } from '@/entities/store';
import { normalizePost } from '@/entities/utils';
import { uploadImages } from '@/lib/imagekit';
import { ImageUploadResponse } from '@/types';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { createPostAction } from '../actions';
import { PostIdsPage } from '../types';

export function useCreatePost() {
  const queryClient = useQueryClient();
  const addPost = useEntityStore((state) => state.addPost);
  const addUser = useEntityStore((state) => state.addUser);
  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async ({
      content,
      images,
    }: {
      content: string;
      images: File[];
    }) => {
      let uploadedImages: ImageUploadResponse[] = [];

      if (images.length) {
        const res = await uploadImages(images);

        if (!res.success)
          throw new Error('Post could not be uploaded, try again');

        uploadedImages = res.data;
      }

      const res = await createPostAction({
        content: content,
        images: uploadedImages,
      });

      if (!res.success) throw new Error(res.message);

      return res;
    },

    onSuccess(res) {
      toast.success(res.message);

      const { post: normalizedPost, user: normalizedUser } = normalizePost(
        res.data,
      );
      addPost(normalizedPost);
      addUser(normalizedUser);

      queryClient.setQueryData<InfiniteData<PostIdsPage>>(
        ['posts', 'home'],
        (oldPostIds) => {
          if (!oldPostIds) return oldPostIds;

          return {
            ...oldPostIds,
            pages: oldPostIds.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  postIds: [normalizedPost.id, ...page.postIds],
                };
              }

              return page;
            }),
          };
        },
      );
    },

    onError(err) {
      toast.error(err.message || 'Something went wrong');
    },
  });
  return { createPost, isPending };
}
