import { useEntityStore } from '@/entities/store';
import { uploadImages } from '@/lib/imagekit';
import { ActionError, ImageUploadResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { editProfileAction } from '../action';
import { EditProfileSchema } from '../schema';

let toastId: string | number;

export function useEditProfile() {
  const addUser = useEntityStore((state) => state.addUser);

  const { mutate: editProfile, isPending } = useMutation({
    mutationFn: async (
      values: EditProfileSchema & {
        coverImageFileId: string | null;
        imageFileId: string | null;
      },
    ) => {
      toastId = toast.loading('Updating profile...');

      const uploadTasks: Record<string, File> = {};
      if (values.image instanceof File) uploadTasks.image = values.image;
      if (values.coverImage instanceof File)
        uploadTasks.coverImage = values.coverImage;

      const taskKeys = Object.keys(uploadTasks);
      const filesToUpload = Object.values(uploadTasks);

      const uploadedMap: Record<string, ImageUploadResponse> = {};

      if (filesToUpload.length > 0) {
        const uploadRes = await uploadImages(filesToUpload);
        if (!uploadRes.success) throw new Error('Failed to upload images');

        taskKeys.forEach((key, index) => {
          uploadedMap[key] = uploadRes.data[index];
        });
      }

      const payload = {
        name: values.name,
        bio: values.bio,

        image: uploadedMap.image
          ? uploadedMap.image.url
          : (values.image as string | null),

        imageFileId: uploadedMap.image
          ? uploadedMap.image.fileId
          : values.imageFileId,

        coverImage: uploadedMap.coverImage
          ? uploadedMap.coverImage.url
          : (values.coverImage as string | null),

        coverImageFileId: uploadedMap.coverImage
          ? uploadedMap.coverImage.fileId
          : values.coverImageFileId,
      };

      const res = await editProfileAction(payload);

      if (!res.success)
        throw { code: res.error, message: res.message } as ActionError;

      return res;
    },

    onSuccess(res) {
      toast.success(res.message, { id: toastId });

      addUser(res.data);
    },

    onError(err: Error | ActionError) {
      toast.error(err.message || 'Something went wrong', { id: toastId });
    },
  });

  return { editProfile, isPending };
}
