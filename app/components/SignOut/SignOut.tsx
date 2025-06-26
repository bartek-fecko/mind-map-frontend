'use client';

import { signOut } from 'next-auth/react';
import Button from '../Button/Button';

function SignOut() {
  return (
    <div>
      <Button onClick={() => signOut()}>
        <span className="ml-2">Sign out</span>
      </Button>
    </div>
  );
}

export default SignOut;
