import axios from 'axios';
import { CommentResponse } from './types';

export async function getComments(postId: string, cursor?: string) {
  try {
    const comments = await axios.get<CommentResponse>(
      `/api/comments/${postId}`,
      { params: { cursor } },
    );
    return comments.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch comments');
    }
    throw error;
  }
}
