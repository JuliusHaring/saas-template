"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";

import NavBar from "@/lib/components/shared/organisms/NavBar";
import NavbarItem from "@/lib/components/shared/atoms/NavbarItem";
import { Logo } from "@/lib/components/shared/atoms/Logo";
import Button from "@/lib/components/admin/molecules/Button";
import { fetchJson } from "@/lib/utils/fetch";
import { openBillingPortal } from "@/lib/utils/frontend/open-billing-portal";

interface Props {
  children?: React.ReactNode;
}

const DefaultNavBar: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => setLoggedIn(res.ok))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleLogOut = async () => {
    await fetchJson("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <NavBar className="md:justify-between w-full flex flex-col lg:flex-row items-center px-4">
      <Link href="/">
        <Logo className="cursor-pointer" />
      </Link>

      <div className="flex flex-col lg:flex-row items-center lg:space-x-6 mt-4 lg:mt-0 space-y-2 lg:space-y-0">
        {children}

        {loggedIn === null ? null : loggedIn ? (
          <>
            <NavbarItem href="#" onClick={openBillingPortal} icon={User}>
              Kundenportal
            </NavbarItem>
            <NavbarItem href="#" onClick={handleLogOut}>
              <Button>Abmelden</Button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem href="/auth/login">
              <Button>Anmelden</Button>
            </NavbarItem>
            <NavbarItem href="/auth/signup">
              <Button>Registrieren</Button>
            </NavbarItem>
          </>
        )}
      </div>
    </NavBar>
  );
};

export default DefaultNavBar;
