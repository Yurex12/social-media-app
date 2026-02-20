import { Card, CardHeader } from '@/components/ui/card';
import { UpdateUsernameForm } from '@/features/settings/components/UpdateUsernameForm';
import { getRequiredSession } from '@/lib/session';
import { generateSuggestions } from '@/lib/suggestion';
import { UserIcon } from 'lucide-react';

export default async function Page() {
  const { user } = await getRequiredSession();
  const usernames = generateSuggestions(user.name);

  return (
    <Card className='w-full max-w-sm border'>
      <CardHeader className='flex flex-col items-center justify-center'>
        <div className='inline-flex size-14 items-center justify-center rounded-full bg-primary-foreground/90 dark:bg-primary-foreground/10'>
          <UserIcon className='h-7 w-7 text-primary' />
        </div>
        <h1 className='text-2xl font-semibold'>Set Your Username</h1>
        <p className='text-muted-foreground'>Make it uniquely yours</p>
      </CardHeader>

      <UpdateUsernameForm
        currentUsername={user.username!}
        usernameSuggestions={usernames}
        showSkip={true}
        redirectUrl='/onboarding/details'
      />
    </Card>
  );
}
