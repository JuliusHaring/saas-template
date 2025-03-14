import { Link as ScrollLink } from "react-scroll";
import NavbarItem from "@/lib/components/admin/atoms/NavbarItem";
import Button from "@/lib/components/admin/molecules/Button";
import NavBar from "@/lib/components/shared/organisms/NavBar";
import { Logo } from "@/lib/components/shared/atoms/Logo";

const LandingNavBar = () => {
  return (
    <NavBar className="md:justify-between">
      <Logo className="cursor-default" />

      <div className="flex space-x-6">
        <NavbarItem>
          <ScrollLink to="eyecatcher" duration={500}>
            Startseite
          </ScrollLink>
        </NavbarItem>
        <NavbarItem>
          <ScrollLink to="howto" duration={500}>
            Anleitung
          </ScrollLink>
        </NavbarItem>
        <NavbarItem>
          <ScrollLink to="code-example" duration={500}>
            Code-Beispiel
          </ScrollLink>
        </NavbarItem>
        <NavbarItem href="/admin">
          <Button>Anmelden</Button>
        </NavbarItem>
      </div>
    </NavBar>
  );
};

export default LandingNavBar;
