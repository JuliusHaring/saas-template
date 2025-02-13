"use client";

import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import NavbarItem from "../atoms/NavbarItem";
import { NAVBAR_CONTENT } from "@/app/admin/constants";
import Link from "next/link";
import { openBillingPortal } from "@/lib/utils/frontend/open-billing-portal";
import { SignOutButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
      <div className="text-lg font-bold">
        <Link href="/admin">KnexAI</Link>
      </div>

      <div className="flex space-x-6">
        {NAVBAR_CONTENT.map((navbarItem, index) => (
          <NavbarItem href={navbarItem.href} key={index} icon={navbarItem.icon}>
            {navbarItem.title}
          </NavbarItem>
        ))}
        <NavbarItem href="#" onClick={openBillingPortal} icon={UserCircleIcon}>
          Kundenportal
        </NavbarItem>

        <SignOutButton>
          <NavbarItem href="#" icon={ArrowRightStartOnRectangleIcon}>
            Ausloggen
          </NavbarItem>
        </SignOutButton>
      </div>
    </nav>
  );
};

export default Navbar;
