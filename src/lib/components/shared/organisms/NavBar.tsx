"use client";

interface NavBarProps {
  children: React.ReactNode;
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ children, className }) => {
  return (
    <nav
      className={`md:flex md:items-center px-6 py-4 border-b border-gray-300 gap-4 ${className}`}
    >
      {children}
    </nav>
  );
};

export default NavBar;
