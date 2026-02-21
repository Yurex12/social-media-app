import { CreatePostFormMobile } from '@/features/post/components/CreatePostFormMobile';
import { getRequiredSession } from '@/lib/session';

export default async function Page() {
  const { user } = await getRequiredSession();
  return <CreatePostFormMobile user={user} />;
}
