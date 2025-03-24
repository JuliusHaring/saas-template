"use client";

import { useRouter } from "next/navigation";
import NavbarItem from "@/lib/components/shared/atoms/NavbarItem";
import { openBillingPortal } from "@/lib/utils/frontend/open-billing-portal";
import NavBar from "@/lib/components/shared/organisms/NavBar";
import Link from "next/link";
import { fetchJson } from "@/lib/utils/fetch";
import { Logo } from "@/lib/components/shared/atoms/Logo";
import { LogOut, User } from "lucide-react";

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
        <Logo />
      </Link>

      <div className="flex space-x-6">
        <NavbarItem href="#" onClick={openBillingPortal} icon={User}>
          Kundenportal
        </NavbarItem>
        <NavbarItem href="#" icon={LogOut} onClick={handleLogOut}>
          Ausloggen
        </NavbarItem>
      </div>
    </NavBar>
  );
};

export default AdminNavBar;
