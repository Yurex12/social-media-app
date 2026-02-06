import { useEntityStore } from '@/entities/store';
import { normalizePost } from '@/entities/utils';
import { uploadImages } from '@/lib/imagekit';
import { ImageUploadResponse } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createPostAction } from '../actions';

const toastId = '123456';

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
      toast.loading('Uploading your post...', {
        duration: Infinity,
        id: toastId,
      });

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
      toast.success(res.message, {
        id: toastId,
        duration: 3000,
      });

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
      toast.success(err.message, {
        id: toastId,
        duration: 3000,
      });
    },
  });
  return { createPost, isPending };
}
