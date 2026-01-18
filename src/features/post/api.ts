import axios from 'axios';
import { PostWithRelations } from './types';

export async function getPosts() {
  try {
    const posts = await axios.get<PostWithRelations[]>('/api/posts');
    return posts.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch posts');
    }
    throw error;
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await axios.get<PostWithRelations>(`/api/posts/${postId}`);
    return post.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch post');
    }
    throw error;
  }
}
