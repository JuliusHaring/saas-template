import AdminNavbar from "@/lib/components/admin/organisms/AdminNavbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminNavbar />
      <div className="lg:px-[15em] px-[2em] py-[2em]">{children}</div>
    </div>
  );
}
