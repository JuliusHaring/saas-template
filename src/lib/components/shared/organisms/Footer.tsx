"use client";

import NavbarItem from "@/lib/components/admin/atoms/NavbarItem";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={`w-full border-t border-gray-300 px-6 py-4 bg-white fixed bottom-0 left-0 right-0 z-50 mt-20 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center text-gray-600">
        <p>© {new Date().getFullYear()} KnexAI</p>
        <div className="flex space-x-6">
          <NavbarItem href="/footer/impressum">Impressum</NavbarItem>
          <NavbarItem href="/footer/kontakt">Kontakt</NavbarItem>
          <NavbarItem href="/footer/datenschutz">Datenschutz</NavbarItem>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
