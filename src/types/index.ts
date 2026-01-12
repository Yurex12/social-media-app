export type ActionResponse<T = void> =
  | {
      success: boolean;
      message: string;
      data: T;
    }
  | {
      success: boolean;
      error: string;
      errors?: Record<string, string[]>;
    };

export type ImageUploadResponse = { fileId: string; url: string };

export type ImageUploadResult =
  | { success: true; message: string; data: ImageUploadResponse[] }
  | { success: false; message: string };
