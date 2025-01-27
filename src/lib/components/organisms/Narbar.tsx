import { SignedIn, SignOutButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  return (
    <nav className="h-screen fixed flex flex-col bg-blue-300 w-[12em] py-5">
      <div className="">
      <SignedIn>
        <SignOutButton>Ausloggen</SignOutButton>
      </SignedIn>
      </div>

      <div className="">
        <a>Link 1</a>
      </div>

      <div className="">
        <a>Link 2</a>
      </div>
    </nav>
  );
};

export default Navbar;
