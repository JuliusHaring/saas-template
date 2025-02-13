import Navbar from "@/lib/components/admin/organisms/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Navbar />
      <div className="lg:px-[15em] px-[2em] py-[2em]">{children}</div>
    </ClerkProvider>
  );
}
