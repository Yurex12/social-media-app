'use server';

import { imagekitAdmin } from '@/lib/imagekit-admin';

export async function deleteImages(fileIds: string[]) {
  const idsToDelete = fileIds.filter(Boolean);

  if (!idsToDelete?.length) return { success: true };

  try {
    const result = await imagekitAdmin.files.bulk.delete({
      fileIds: idsToDelete,
    });

    return {
      success: true,
      deletedCount: result.successfullyDeletedFileIds?.length,
    };
  } catch (error) {
    console.error('ImageKit Bulk Delete Error:', error);
    return { success: false, message: 'Failed to delete files' };
  }
}
