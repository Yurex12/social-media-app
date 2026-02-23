import SettingsPage from '@/features/settings/components/SettingsPage';

import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { getRequiredSession } from '@/lib/session';

export default async function Page() {
  const { user } = await getRequiredSession();
  return (
    <div className='sm:space-y-4'>
      <Header>
        <BackButton />
        <h3 className='text-lg font-semibold'>Settings</h3>
      </Header>

      <div className='flex items-center justify-center flex-col gap-4 sm:px-4 w-full'>
        <SettingsPage email={user.email} />
      </div>
    </div>
  );
}
