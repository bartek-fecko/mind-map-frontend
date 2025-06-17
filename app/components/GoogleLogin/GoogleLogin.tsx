'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import Button from '../Button/Button';
import GoogleIcon from '../Icons/GoogleIcon';

function GoogleLogin() {
  const { data: session } = useSession();

  return (
    <div>
      {!session?.user && (
        <Button
          className="w-full bg-red-500 hover:bg-red-600 text-white "
          variant="google"
          onClick={() => signIn('google')}
        >
          <GoogleIcon />
          <span className="ml-2">Continue with Google</span>
        </Button>
      )}
      {session?.user && (
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white" variant="google" onClick={() => signOut()}>
          <GoogleIcon />
          <span className="ml-2">Sign out</span>
        </Button>
      )}
    </div>
  );
}

export default GoogleLogin;
