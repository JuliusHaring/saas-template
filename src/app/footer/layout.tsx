import DefaultNavBar from "@/lib/components/shared/organisms/DefaultNavBar";
import Footer from "@/lib/components/shared/organisms/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DefaultNavBar />
      <div className="lg:px-[15em] px-[2em] py-[2em] mb-[72px]">{children}</div>
      <Footer />
    </div>
  );
}
