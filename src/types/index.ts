export type ActionResponse<T = void> =
  | {
      success: true;
      message: string;
      data: T;
    }
  | {
      success: false;
      message: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error?: any;
    };

export type ImageUploadResponse = { fileId: string; url: string };

export type ImageUploadResult =
  | { success: true; message: string; data: ImageUploadResponse[] }
  | { success: false; message: string };
