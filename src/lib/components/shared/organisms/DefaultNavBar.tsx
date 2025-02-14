import NavbarItem from "@/lib/components/admin/atoms/NavbarItem";
import NavBar from "@/lib/components/shared/organisms/NavBar";

const DefaultNavBar: React.FC = () => {
  return (
    <NavBar>
      <NavbarItem href={"/"}>
        <p className="font-semibold">KnexAI</p>
      </NavbarItem>
    </NavBar>
  );
};

export default DefaultNavBar;
