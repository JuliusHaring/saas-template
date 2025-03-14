"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import NavbarItem from "@/lib/components/admin/atoms/NavbarItem";
import { openBillingPortal } from "@/lib/utils/frontend/open-billing-portal";
import NavBar from "@/lib/components/shared/organisms/NavBar";
import Link from "next/link";
import Headline from "@/lib/components/shared/molecules/Headline";
import { fetchJson } from "@/lib/utils/fetch";
import Typical from "react-typical";

const AdminNavBar = () => {
  const router = useRouter();

  const handleLogOut = async () => {
    await fetchJson("/api/auth/logout", { method: "POST" }).then(() => {
      router.push("/");
    });
  };

  return (
    <NavBar className="md:justify-between">
      <Link href="/admin">
        <Headline level={1} className="hover:text-blue-600">
          <Typical steps={["", 100, "KnexAI", 500]} />
        </Headline>
      </Link>

      <div className="flex space-x-6">
        <NavbarItem href="#" onClick={openBillingPortal} icon={UserCircleIcon}>
          Kundenportal
        </NavbarItem>
        <NavbarItem
          href="#"
          icon={ArrowRightStartOnRectangleIcon}
          onClick={handleLogOut}
        >
          Ausloggen
        </NavbarItem>
      </div>
    </NavBar>
  );
};

export default AdminNavBar;
