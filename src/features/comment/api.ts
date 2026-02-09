import axios from 'axios';
import { CommentWithRelations } from './types';

export async function getComments(postId: string) {
  try {
    const comments = await axios.get<CommentWithRelations[]>(
      `/api/comments/${postId}`,
    );
    return comments.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch comments');
    }
    throw error;
  }
}
