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
      {children}
    </ClerkProvider>
  );
}
