import NavbarItem from "@/lib/components/admin/atoms/NavbarItem";
import Button from "@/lib/components/admin/molecules/Button";
import { useRouter } from "next/navigation";

interface NavBarProps {
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const router = useRouter();

  return (
    <nav
      className={`md:flex md:items-center md:justify-end px-6 py-4 border-b border-gray-300 ${className}`}
    >
      <NavbarItem href="#" onClick={() => router.push("/admin")}>
        <Button>Anmelden</Button>
      </NavbarItem>
    </nav>
  );
};

export default NavBar;
