"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import NavbarItem from "../atoms/NavbarItem";
import { NAVBAR_CONTENT } from "@/app/admin/constants";

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
    } finally {
    }
  };

  return (
    <nav className="h-screen fixed flex flex-col bg-blue-300 w-[12em] inset-shadow-sm inset-shadow-blue-800">
      {NAVBAR_CONTENT.map((navbarItem, index) => (
        <NavbarItem href={navbarItem.href} key={index} icon={navbarItem.icon}>
          {navbarItem.title}
        </NavbarItem>
      ))}

      <NavbarItem href="#" onClick={openBillingPortal} icon={UserCircleIcon}>
        Kundenportal
      </NavbarItem>
    </nav>
  );
};

export default Navbar;
