import Navbar from "@/lib/components/organisms/Narbar";
import { ClerkProvider } from "@clerk/nextjs";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="">
        <Navbar />
      </div>
      <div className="ml-[12em] pl-[1em]">
      {children}
      </div>
    </ClerkProvider>
  );
}
