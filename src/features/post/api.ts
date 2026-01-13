import axios from 'axios';
import { PostWithRelations } from './types';

export async function getPosts() {
  const posts = await axios.get<PostWithRelations[]>('/api/posts');
  return posts.data;
}
