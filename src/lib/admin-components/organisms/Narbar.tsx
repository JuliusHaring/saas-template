"use client";

import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { NAVBAR_CONTENT } from "@/app/admin/constants";
import Link from "next/link";
import { openBillingPortal } from "@/lib/utils/frontend/open-billing-portal";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import NavbarItem from "@/lib/admin-components/atoms/NavbarItem";

const Navbar: React.FC = () => {
  const { signOut } = useClerk();
  const router = useRouter();

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

        <NavbarItem
          href="#"
          icon={ArrowRightStartOnRectangleIcon}
          onClick={() => {
            signOut().then(() => {
              router.push("/");
            });
          }}
        >
          Ausloggen
        </NavbarItem>
      </div>
    </nav>
  );
};

export default Navbar;
