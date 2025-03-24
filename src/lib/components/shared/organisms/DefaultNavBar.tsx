"use client";
import NavbarItem from "@/lib/components/shared/atoms/NavbarItem";
import { Logo } from "@/lib/components/shared/atoms/Logo";
import NavBar from "@/lib/components/shared/organisms/NavBar";

const DefaultNavBar: React.FC = () => {
  return (
    <NavBar>
      <NavbarItem href={"/"}>
        <Logo />
      </NavbarItem>
    </NavBar>
  );
};

export default DefaultNavBar;
