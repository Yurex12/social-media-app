import { useEntityStore } from '@/entities/store';
import { normalizePost } from '@/entities/utils';
import { uploadImages } from '@/lib/imagekit';
import { ImageUploadResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { editPostAction } from '../actions';
import { PostEditSchema } from '../schema';
import { ActionError } from '../types';

let toastId: string | number;

export function useEditPost() {
  const updatePost = useEntityStore((state) => state.updatePost);
  const removePost = useEntityStore((state) => state.removePost);

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
      toastId = toast.loading('Saving changes...', {});

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

      if (!res.success)
        throw { code: res.error, message: res.message } as ActionError;

      return res;
    },

    onSuccess(res) {
      toast.success(res.message, { id: toastId });

      const { post: normalizedPost } = normalizePost(res.data);

      updatePost(normalizedPost.id, normalizedPost);
    },

    onError(err: Error | ActionError, variables) {
      if ('code' in err && err.code === 'NOT_FOUND') {
        removePost(variables.postId);
      }

      toast.error(err.message || 'Something went wrong', { id: toastId });
    },
  });

  return { editPost, isPending };
}
