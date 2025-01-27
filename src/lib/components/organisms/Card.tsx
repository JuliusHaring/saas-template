export default function Card({
  header,
  children,
  footer,
}: Readonly<{
  header?: string | number | React.ReactNode;
  children: React.ReactNode;
  footer?: string | number | React.ReactNode;
}>) {
  return (
    <div className="bg-gray-200 border border-gray-300 rounded-lg divide-y divide-gray-300">
      {typeof header !== "undefined" && (
        <div className="px-4 py-2 font-semibold">{header}</div>
      )}

      <div className="p-4 bg-gray-100">{children}</div>

      {typeof footer !== "undefined" && (
        <div className="px-4 py-2">{footer}</div>
      )}
    </div>
  );
}
