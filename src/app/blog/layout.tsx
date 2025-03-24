import BlogNavBar from "@/lib/components/blog/atoms/BlogNavBar";
import Footer from "@/lib/components/shared/organisms/Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <BlogNavBar />
      <div className="flex-grow lg:px-[15em] px-[2em] py-[2em]">{children}</div>
      <div className="mt-auto w-full">
        <Footer className="w-full" />
      </div>
    </div>
  );
}
