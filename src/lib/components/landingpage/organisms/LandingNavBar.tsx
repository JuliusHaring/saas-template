"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

import NavbarItem from "@/lib/components/shared/atoms/NavbarItem";
import DefaultNavBar from "@/lib/components/shared/organisms/DefaultNavBar";

const LandingNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full">
      <DefaultNavBar>
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
          {[
            ["explanation", "Startseite"],
            ["pricing", "Preise"],
            ["testimonials", "Kundenbewertungen"],
            ["code-example", "Code-Beispiel"],
          ].map(([target, label]) => (
            <NavbarItem key={target}>
              <ScrollLink
                to={target}
                duration={500}
                smooth={true}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </ScrollLink>
            </NavbarItem>
          ))}
        </div>
      </DefaultNavBar>
    </div>
  );
};

export default LandingNavBar;
