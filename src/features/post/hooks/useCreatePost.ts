import { useEntityStore } from '@/entities/store';
import { normalizePost } from '@/entities/utils';
import { uploadImages } from '@/lib/imagekit';
import { ImageUploadResponse } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createPostAction } from '../actions';

let toastId: string | number;

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
      toastId = toast.loading('Uploading your post...');

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
      toast.success(res.message, { id: toastId });

      const { post: normalizedPost, user: normalizedUser } = normalizePost(
        res.data,
      );
      addPost(normalizedPost);
      addUser(normalizedUser);

      queryClient.setQueryData<string[]>(['posts', 'home'], (oldIds) => {
        if (!oldIds) return oldIds;
        return [normalizedPost.id, ...oldIds];
      });
    },

    onError(err) {
      toast.error(err.message || 'Something went wrong', {
        id: toastId,
      });
    },
  });
  return { createPost, isPending };
}
