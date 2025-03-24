"use client";

import NavbarItem from "@/lib/components/shared/atoms/NavbarItem";
import SocialIcon from "@/lib/components/shared/atoms/SocialIcon";
import { Instagram, Mail } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={`w-full border-t border-gray-300 px-6 py-4 bg-white ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center text-gray-600">
        <p>© {new Date().getFullYear()} KnexAI</p>
        <div className="flex space-x-6">
          <SocialIcon
            href="https://www.instagram.com/knexai.app"
            icon={Instagram}
            label="Instagram"
          />
          <SocialIcon
            href="mailto:info@juliusharing.com"
            label="E-Mail"
            icon={Mail}
          />

          <div className="h-5 w-px bg-gray-300" />

          <NavbarItem href="/footer/impressum">Impressum</NavbarItem>
          <NavbarItem href="/footer/kontakt">Kontakt</NavbarItem>
          <NavbarItem href="/footer/datenschutz">Datenschutz</NavbarItem>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
