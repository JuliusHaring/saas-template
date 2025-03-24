"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";

import NavBar from "@/lib/components/shared/organisms/NavBar";
import NavbarItem from "@/lib/components/shared/atoms/NavbarItem";
import { Logo } from "@/lib/components/shared/atoms/Logo";
import Button from "@/lib/components/admin/molecules/Button";
import { fetchJson } from "@/lib/utils/fetch";
import { openBillingPortal } from "@/lib/utils/frontend/open-billing-portal";

const DefaultNavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => setLoggedIn(res.ok))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleLogOut = async () => {
    await fetchJson("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const isOnLanding = pathname === "/";

  const navItems = [
    ["explanation", "Startseite"],
    ["pricing", "Preise"],
    ["testimonials", "Kundenbewertungen"],
    ["code-example", "Code-Beispiel"],
  ];

  return (
    <NavBar className="lg:justify-between flex flex-col lg:flex-row items-center w-full px-4">
      <Link href="/">
        <Logo className="cursor-pointer" />
      </Link>

      <button
        className="lg:hidden absolute right-4 top-4 text-gray-800 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } lg:flex lg:items-center lg:space-x-6 w-full lg:w-auto mt-4 lg:mt-0 flex flex-col lg:flex-row space-y-4 lg:space-y-0`}
      >
        {loggedIn === null ? null : loggedIn ? (
          <>
            <NavbarItem href="/blog">Blog</NavbarItem>
            <NavbarItem href="#" onClick={openBillingPortal}>
              Kundenportal
            </NavbarItem>
            <NavbarItem href="#" onClick={handleLogOut}>
              <Button>Abmelden</Button>
            </NavbarItem>
          </>
        ) : (
          <>
            {navItems.map(([target, label]) => (
              <NavbarItem key={target}>
                {isOnLanding ? (
                  <ScrollLink
                    to={target}
                    smooth={true}
                    duration={500}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </ScrollLink>
                ) : (
                  <Link href={`/#${target}`}>{label}</Link>
                )}
              </NavbarItem>
            ))}
            <NavbarItem href="/blog">Blog</NavbarItem>
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
