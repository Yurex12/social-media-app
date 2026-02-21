type Code = 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR' | 'INVALID_DATA';

export type ActionResponse<T> =
  | { success: true; data: T; message: string }
  | {
      success: false;
      error: Code;
      message: string;
    };

export type ImageUploadResponse = {
  fileId: string;
  url: string;
  width: number;
  height: number;
};

export type ImageUploadResult =
  | { success: true; message: string; data: ImageUploadResponse[] }
  | { success: false; message: string };

export type ActionError = { code: Code; message: string };
