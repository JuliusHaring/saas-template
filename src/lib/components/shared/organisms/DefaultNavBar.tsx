import NavbarItem from "@/lib/components/admin/atoms/NavbarItem";
import Headline from "@/lib/components/shared/molecules/Headline";
import NavBar from "@/lib/components/shared/organisms/NavBar";

const DefaultNavBar: React.FC = () => {
  return (
    <NavBar>
      <NavbarItem href={"/"}>
        <Headline level={1}>KnexAI</Headline>
      </NavbarItem>
    </NavBar>
  );
};

export default DefaultNavBar;
