import { SignedIn, SignOutButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  return (
    <nav className="flex flex-col w-64 h-screen bg-gray-800 text-white">
      <SignedIn>
        <SignOutButton>Ausloggen</SignOutButton>
      </SignedIn>
    </nav>
  );
};

export default Navbar;
