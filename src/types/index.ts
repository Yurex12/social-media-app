export type ActionResponse<T> =
  | { success: true; data: T; message: string }
  | {
      success: false;
      error: 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR' | 'INVALID_DATA';
      message: string;
    };

export type ImageUploadResponse = { fileId: string; url: string };

export type ImageUploadResult =
  | { success: true; message: string; data: ImageUploadResponse[] }
  | { success: false; message: string };
