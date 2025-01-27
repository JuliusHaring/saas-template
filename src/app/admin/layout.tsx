import Header from "@/lib/components/organisms/Header";
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
      <Header />
      <div className="ml-[12em] p-[1em]">{children}</div>
    </ClerkProvider>
  );
}
