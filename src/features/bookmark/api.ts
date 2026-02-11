import axios from 'axios';
import { PostFeedResponse } from '../post/types';

export async function getBookmarks(cursor?: string) {
  try {
    const { data } = await axios.get<PostFeedResponse>('/api/bookmarks', {
      params: {
        cursor,
      },
    });

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch bookmarks');
    }
    throw error;
  }
}
