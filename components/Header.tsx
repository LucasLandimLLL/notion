'use client';

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { user } = useUser();
// biblioteca clerk para login e etc
  return (
    <div className="flex items-center justify-between p-5">
      {user && (
        <h1 className="text-2xl">{user.firstName}{`'s`} Space</h1>
      )}

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
