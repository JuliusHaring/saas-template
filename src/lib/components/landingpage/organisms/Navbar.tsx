import NavbarItem from "@/lib/components/admin/atoms/NavbarItem";
import Button from "@/lib/components/admin/molecules/Button";
import { useRouter } from "next/navigation";
import { Link } from "react-scroll";

interface NavBarProps {
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const router = useRouter();

  return (
    <nav
      className={`md:flex md:items-center md:justify-end px-6 py-4 border-b border-gray-300 gap-4 ${className}`}
    >
      {/* Workaround that removes <a></a> to mitigate hydration errors.  */}
      <NavbarItem href={"#"} onClick={() => {}}>
        <Link to="eyecatcher" duration={500}>
          Startseite
        </Link>
      </NavbarItem>

      <NavbarItem href={"#"} onClick={() => {}}>
        <Link to="howto" duration={500}>
          Anleitung
        </Link>
      </NavbarItem>

      <NavbarItem href={"#"} onClick={() => {}}>
        <Link to="code-example" duration={500}>
          Code-Beispiel
        </Link>
      </NavbarItem>

      <NavbarItem href="#" onClick={() => router.push("/admin/chatbots")}>
        <Button>Anmelden</Button>
      </NavbarItem>
    </nav>
  );
};

export default NavBar;
