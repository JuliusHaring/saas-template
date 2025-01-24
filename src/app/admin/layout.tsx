import { ClerkProvider, SignedIn, SignOutButton } from "@clerk/nextjs";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <SignedIn>
        <SignOutButton>Ausloggen</SignOutButton>
      </SignedIn>
      {children}
    </ClerkProvider>
  );
}
