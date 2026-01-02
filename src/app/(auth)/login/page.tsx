import Link from 'next/link';

import Logo from '@/components/Logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SocialLogin } from '@/features/auth/components/SocialLogin';

export default function Page() {
  return (
    <div className='flex h-svh flex-col items-center justify-center p-2 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Logo className='mx-auto' />
        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='text-xl'>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <LoginForm />
            <SocialLogin />
            <div className='text-center text-sm text-foreground/70'>
              Don&apos;t have an account?{' '}
              <Link href='/signup' className='underline underline-offset-4'>
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
