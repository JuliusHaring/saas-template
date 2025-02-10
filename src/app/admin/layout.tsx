import Navbar from "@/lib/components/organisms/Narbar";
import { ClerkProvider } from "@clerk/nextjs";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Navbar />
      <div className="p-[1em]">{children}</div>
    </ClerkProvider>
  );
}
