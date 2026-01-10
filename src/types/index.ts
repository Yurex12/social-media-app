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
