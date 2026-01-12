import { ImageUploadResponse, ImageUploadResult } from '@/types';
import { upload, UploadResponse } from '@imagekit/next';

async function fetchAuth() {
  const response = await fetch('/api/upload-auth');
  if (!response.ok) throw new Error('Authentication failed');
  return await response.json();
}

export async function uploadImages(images: File[]): Promise<ImageUploadResult> {
  const abortController = new AbortController();

  try {
    const uploadPromises = images.map(async (image) => {
      const auth = await fetchAuth();

      const result: UploadResponse = await upload({
        publicKey: auth.publicKey,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        file: image,
        fileName: image.name,
        folder: '/posts',
        abortSignal: abortController.signal,
      });

      return result;
    });

    const results = await Promise.all(uploadPromises);

    const formattedData: ImageUploadResponse[] = results.map((res) => ({
      fileId: res.fileId!,
      url: res.url!,
    }));

    return {
      success: true,
      message: 'Upload successful',
      data: formattedData,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'An error occurred during upload',
    };
  }
}
