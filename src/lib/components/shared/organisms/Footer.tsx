"use client";

import NavbarItem from "@/lib/components/shared/atoms/NavbarItem";
import SocialIcon from "@/lib/components/shared/atoms/SocialIcon";
import { Instagram, Linkedin, Mail } from "lucide-react";

interface FooterProps {
  className?: string;
}

// TODO: Replace REPLACE_TITLE

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={`w-full border-t border-gray-300 px-6 py-4 bg-white ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center text-gray-600 gap-4">
        {/* Row 1: Copyright */}
        <p>© {new Date().getFullYear()} REPLACE_TITLE</p>

        {/* Row 2–3 grouped */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-y-2 gap-x-6">
          {/* Row 2: Social Icons */}
          <div className="flex space-x-6 justify-center sm:justify-start">
            <SocialIcon
              href="https://www.instagram.com/knexai.app"
              icon={Instagram}
              label="Instagram"
            />
            <SocialIcon
              href="https://www.linkedin.com/in/juliusharing"
              label="LinkedIn"
              icon={Linkedin}
            />
            <SocialIcon
              href="mailto:info@juliusharing.com"
              label="E-Mail"
              icon={Mail}
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-5 w-px bg-gray-300" />

          {/* Row 3: Legal links */}
          <div className="flex space-x-6 justify-center sm:justify-start">
            <NavbarItem href="/footer/impressum">Impressum</NavbarItem>
            <NavbarItem href="/footer/kontakt">Kontakt</NavbarItem>
            <NavbarItem href="/footer/datenschutz">Datenschutz</NavbarItem>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
