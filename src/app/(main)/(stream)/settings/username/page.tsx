import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { UpdateUsernameForm } from '@/features/settings/components/UpdateUsernameForm';

import { getRequiredSession } from '@/lib/session';
import { generateSuggestions } from '@/lib/suggestion';

export default async function Page() {
  const { user } = await getRequiredSession();
  const usernames = generateSuggestions(user.name);
  return (
    <div className='sm:space-y-4'>
      <Header>
        <BackButton />
        <h3 className='text-lg font-semibold'>Update username</h3>
      </Header>

      <div className='flex items-center justify-center flex-col gap-4 sm:px-4 w-full'>
        <UpdateUsernameForm
          currentUsername={user.username!}
          usernameSuggestions={usernames}
          className='mt-4 rounded-lg border py-8'
          redirectUrl='/home'
        />
      </div>
    </div>
  );
}
