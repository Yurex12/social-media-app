import { GoogleLoginButton } from './GoogleLoginButton';

export function SocialLogin() {
  return (
    <>
      <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
        <span className='text-foreground bg-card relative z-10 px-2'>
          Or continue with
        </span>
      </div>
      <GoogleLoginButton />
    </>
  );
}
