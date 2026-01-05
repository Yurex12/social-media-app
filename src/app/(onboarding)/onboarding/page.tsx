import { Card, CardHeader } from '@/components/ui/card';
import { UsernameForm } from '@/features/onboarding/components/UsernameForm';
import { getRequiredSession } from '@/lib/session';
import { generateSuggestions } from '@/lib/suggestion';
import { UserIcon } from 'lucide-react';

export default async function Page() {
  const { user } = await getRequiredSession();
  const usernames = generateSuggestions(user.name);

  return (
    <Card className='w-full max-w-sm border-gray-200 bg-white shadow'>
      <CardHeader className='flex flex-col items-center justify-center'>
        <div className='inline-flex size-14 items-center justify-center rounded-full bg-blue-100'>
          <UserIcon className='h-7 w-7 text-blue-600' />
        </div>
        <h1 className='text-2xl font-semibold text-gray-900'>
          Set Your Username
        </h1>
        <p className='text-gray-600'>Make it uniquely yours</p>
      </CardHeader>

      <UsernameForm
        currentUsername={user.username!}
        usernameSuggestions={usernames}
      />
    </Card>
  );
}
