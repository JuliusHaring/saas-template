export default function Card({
  header,
  children,
  footer,
  className,
}: Readonly<{
  header?: string | number | React.ReactNode;
  children: React.ReactNode;
  footer?: string | number | React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={`border border-gray-300 divide-y divide-gray-300 ${className}`}
    >
      {typeof header !== "undefined" && (
        <div className="px-4 py-2 font-semibold truncate">{header}</div>
      )}

      <div className="p-4 truncate inset-shadow-sm  inset-shadow-black-100">
        {children}
      </div>

      {typeof footer !== "undefined" && (
        <div className="px-4 py-2 truncate">{footer}</div>
      )}
    </div>
  );
}
