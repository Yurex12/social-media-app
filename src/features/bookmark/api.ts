import axios from 'axios';
import { PostWithRelations } from '../post/types';

export async function getBookmarks() {
  try {
    const bookmarks = await axios.get<PostWithRelations[]>('/api/bookmarks');
    return bookmarks.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch bookmarks');
    }
    throw error;
  }
}
