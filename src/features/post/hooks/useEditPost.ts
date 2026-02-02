import { useEntityStore } from '@/entities/store';
import { normalizePost } from '@/entities/utils';
import { uploadImages } from '@/lib/imagekit';
import { ImageUploadResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { editPostAction } from '../actions';
import { PostEditSchema } from '../schema';

const toastId = 'edit-post-toast';

export function useEditPost() {
  const updatePostEntity = useEntityStore((state) => state.updatePost);

  const { mutate: editPost, isPending } = useMutation({
    mutationFn: async ({
      postId,
      values,
      existingImages,
    }: {
      postId: string;
      values: PostEditSchema;
      existingImages: { fileId: string; url: string }[];
    }) => {
      toast.loading('Saving changes...', {
        duration: Infinity,
        id: toastId,
      });

      const filesToUpload = values.images.filter(
        (img) => img instanceof File,
      ) as File[];

      const keptImages = values.images.filter(
        (img) => !(img instanceof File),
      ) as { fileId: string; url: string }[];

      const keptFileIds = new Set(keptImages.map((img) => img.fileId));

      const imagesToDeleteId = existingImages
        .filter((img) => !keptFileIds.has(img.fileId))
        .map((img) => img.fileId);

      let newlyUploadedRes: ImageUploadResponse[] = [];
      if (filesToUpload.length > 0) {
        const uploadRes = await uploadImages(filesToUpload);
        if (!uploadRes.success) {
          throw new Error('Failed to upload new images');
        }
        newlyUploadedRes = uploadRes.data;
      }

      const res = await editPostAction(postId, {
        content: values.content,
        images: newlyUploadedRes,
        imagesToDeleteId: imagesToDeleteId,
      });

      if (!res.success) throw new Error(res.message);

      return res;
    },

    onSuccess(res) {
      toast.success(res.message, {
        id: toastId,
        duration: 3000,
      });

      const { post: normalizedPost } = normalizePost(res.data);

      updatePostEntity(normalizedPost.id, normalizedPost);
    },

    onError(error) {
      toast.error(error.message || 'An unexpected error occurred', {
        id: toastId,
        duration: 3000,
      });
    },
  });

  return { editPost, isPending };
}
