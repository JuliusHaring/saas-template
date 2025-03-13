import AdminNavbar from "@/lib/components/admin/organisms/AdminNavbar";
import Footer from "@/lib/components/shared/organisms/Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminNavbar />
      <div className="lg:px-[15em] px-[2em] py-[2em] mb-[72px]">{children}</div>
      <Footer />
    </div>
  );
}
