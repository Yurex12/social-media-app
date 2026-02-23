import { EditProfileFormMobile } from '@/features/profile/components/EditProfileFormMobile';
import { getRequiredSession } from '@/lib/session';

export default async function Page() {
  const { user } = await getRequiredSession();
  return <EditProfileFormMobile user={user} />;
}
