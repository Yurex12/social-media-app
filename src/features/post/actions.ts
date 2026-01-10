'use server';

import { getRequiredSession } from '@/lib/session';

export async function createPost() {}
export async function updatePost() {}

export async function deletePostPost(postId: string) {
  const { user } = await getRequiredSession();
}
