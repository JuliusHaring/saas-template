"use client";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import NavbarItem from "../atoms/NavbarItem";
import { NAVBAR_CONTENT } from "@/app/admin/constants";
import { useUser } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const user = useUser();
  const email = user.user?.primaryEmailAddress;

  return (
    <nav className="h-screen fixed flex flex-col bg-blue-300 w-[12em] inset-shadow-sm  inset-shadow-blue-800">
      {NAVBAR_CONTENT.map((navbarItem, index) => (
        <NavbarItem href={navbarItem.href} key={index} icon={navbarItem.icon}>
          {navbarItem.title}
        </NavbarItem>
      ))}

      <NavbarItem
        href={`https://billing.stripe.com/p/login/test_6oE6qx7tggif4XmcMM?prefilled_email=${email}`}
        icon={UserCircleIcon}
      >
        Kundenportal
      </NavbarItem>
    </nav>
  );
};

export default Navbar;
