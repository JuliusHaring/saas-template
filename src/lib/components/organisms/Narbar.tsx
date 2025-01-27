import { SignedIn, SignOutButton } from "@clerk/nextjs";
import NavbarItem from "../atoms/NavbarItem";
import { NAVBAR_CONTENT } from "@/app/admin/constants";

const Navbar: React.FC = () => {
  return (
    <nav className="h-screen fixed flex flex-col bg-blue-300 w-[12em] py-5 border-r-1 border-gray-200">
      {NAVBAR_CONTENT.map((navbarItem, index) => (
        <NavbarItem href={navbarItem.href} key={index} icon={navbarItem.icon}>
          {navbarItem.title}
        </NavbarItem>
      ))}
    </nav>
  );
};

export default Navbar;
