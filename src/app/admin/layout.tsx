import AdminNavbar from "@/lib/components/admin/organisms/AdminNavbar";
import { ClerkProvider } from "@clerk/nextjs";
import { deDE } from "@clerk/localizations";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={deDE}>
      <AdminNavbar />
      <div className="lg:px-[15em] px-[2em] py-[2em]">{children}</div>
    </ClerkProvider>
  );
}
