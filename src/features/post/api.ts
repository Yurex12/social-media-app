import axios from 'axios';
import { PostFeedResponse, Post } from './types';

export async function getPosts(cursor?: string) {
  try {
    const posts = await axios.get<PostFeedResponse>('/api/posts', {
      params: { cursor },
    });
    return posts.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch posts');
    }
    throw error;
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await axios.get<Post>(`/api/posts/${postId}`);
    return post.data;
  } catch (error: unknown) {
    console.log(error);

    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch post');
    }
    throw error;
  }
}
