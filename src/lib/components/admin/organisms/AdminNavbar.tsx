"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { NAVBAR_CONTENT } from "@/app/admin/constants";
import NavbarItem from "@/lib/components/admin/atoms/NavbarItem";
import { openBillingPortal } from "@/lib/utils/frontend/open-billing-portal";
import NavBar from "@/lib/components/shared/organisms/NavBar";
import Link from "next/link";
import Headline from "@/lib/components/shared/molecules/Headline";

const AdminNavBar = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <NavBar className="md:justify-between">
      <Link href="/admin/chatbots">
        <Headline level={1}>KnexAI</Headline>
      </Link>

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
          onClick={() => signOut().then(() => router.push("/"))}
        >
          Ausloggen
        </NavbarItem>
      </div>
    </NavBar>
  );
};

export default AdminNavBar;
