import Link from 'next/link';

import Logo from '@/components/Logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignupForm } from '@/features/auth/components/SignUpForm';
import { SocialLogin } from '@/features/auth/components/SocialLogin';

export default function Page() {
  return (
    <div className='flex h-svh flex-col items-center justify-center p-2'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Logo className='mx-auto' />
        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='text-xl'>Create an account</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <SignupForm />
            <SocialLogin />
            <div className='text-center text-sm text-foreground/70'>
              Already have an account?
              <Link href='/login' className='underline underline-offset-4'>
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
