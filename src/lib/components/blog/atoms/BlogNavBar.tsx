"use client";
import { Link as ScrollLink } from "react-scroll";
import NavbarItem from "@/lib/components/shared/atoms/NavbarItem";
import Button from "@/lib/components/admin/molecules/Button";
import NavBar from "@/lib/components/shared/organisms/NavBar";
import { Logo } from "@/lib/components/shared/atoms/Logo";
import { useState } from "react";
import { Menu } from "lucide-react";

const BlogNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <NavBar className="lg:justify-between flex flex-col lg:flex-row items-center w-full px-4">
      <Logo className="cursor-default" />
      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden absolute right-4 top-4 text-gray-800 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Menu Items */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } lg:flex lg:items-center lg:space-x-6 w-full lg:w-auto mt-4 lg:mt-0 flex flex-col lg:flex-row space-y-4 lg:space-y-0`}
      >
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-2 lg:space-y-0 w-full lg:w-auto text-center">
          <NavbarItem>
            <ScrollLink
              to="pricing"
              duration={500}
              onClick={() => setMenuOpen(false)}
            >
              Preise
            </ScrollLink>
          </NavbarItem>
        </div>

        {/* Buttons */}
        <div className="flex flex-col lg:flex-row lg:space-x-4 lg:space-y-0 space-y-2 mt-4 lg:mt-0 text-center">
          <NavbarItem href="/auth/login">
            <Button>Anmelden</Button>
          </NavbarItem>
          <NavbarItem href="/auth/signup">
            <Button>Registrieren</Button>
          </NavbarItem>
        </div>
      </div>
    </NavBar>
  );
};

export default BlogNavBar;
