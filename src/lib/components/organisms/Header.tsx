import { SignedIn, SignOutButton } from "@clerk/nextjs";

const Header: React.FC = () => {
  return (
    <nav className="ml-[12em] p-[1em] bg-blue-300 text-right inset-shadow-xs  inset-shadow-blue-800">
      <SignedIn>
        <SignOutButton>Ausloggen</SignOutButton>
      </SignedIn>
    </nav>
  );
};

export default Header;
