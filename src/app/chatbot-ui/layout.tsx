export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
