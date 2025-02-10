"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import NavbarItem from "../atoms/NavbarItem";
import { NAVBAR_CONTENT } from "@/app/admin/constants";
import Link from "next/link";

const Navbar: React.FC = () => {
  const openBillingPortal = async () => {
    try {
      const res = await fetch("/api/stripe/billing-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect user to Stripe billing portal
      } else {
        console.error("Error fetching billing portal URL:", data.error);
      }
    } catch (err) {
      console.error("Failed to open billing portal:", err);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
      <div className="text-lg font-bold">
        <Link href="/admin">KnexAI</Link>
      </div>

      <div className="flex space-x-6">
        {NAVBAR_CONTENT.map((navbarItem, index) => (
          <NavbarItem href={navbarItem.href} key={index} icon={navbarItem.icon}>
            {navbarItem.title}
          </NavbarItem>
        ))}
        <NavbarItem href="#" onClick={openBillingPortal} icon={UserCircleIcon}>
          Kundenportal
        </NavbarItem>
      </div>
    </nav>
  );
};

export default Navbar;
