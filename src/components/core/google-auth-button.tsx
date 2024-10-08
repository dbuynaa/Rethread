'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '../ui/button';
import { Icons } from '../icons';

export function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() => signIn('google', { callbackUrl: callbackUrl ?? '/' })}
    >
      <Icons.google fill="white" className="mr-2 h-6 w-6" />
      Sign with Google
    </Button>
  );
}
