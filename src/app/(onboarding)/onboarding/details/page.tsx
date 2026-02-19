import { Card, CardHeader } from '@/components/ui/card';
import { UserIcon } from 'lucide-react';
import { OnboardingProfileForm } from '@/features/onboarding/components/OnboardingProfileForm';
import { getRequiredSession } from '@/lib/session';

export default async function Page() {
  const { user } = await getRequiredSession();
  return (
    <Card className='w-full max-w-sm border-gray-200 bg-white shadow'>
      <CardHeader className='flex flex-col items-center justify-center'>
        <div className='inline-flex size-14 items-center justify-center rounded-full bg-blue-100'>
          <UserIcon className='h-7 w-7 text-blue-600' />
        </div>
        <h1 className='text-2xl font-semibold text-gray-900'>Update Profile</h1>
        <p className='text-gray-600'>How the others see you</p>
      </CardHeader>

      <OnboardingProfileForm user={user} />
    </Card>
  );
}
