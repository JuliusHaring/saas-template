import Headline from "@/lib/components/shared/molecules/Headline";

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
    <div className={`border border-gray-300 divide-y divide-gray-300`}>
      {typeof header !== "undefined" && (
        <div className="px-4 py-2">
          <Headline level={3}>{header}</Headline>
        </div>
      )}

      <div
        className={`p-4 inset-shadow-sm  inset-shadow-black-100  ${className}`}
      >
        {children}
      </div>

      {typeof footer !== "undefined" && (
        <div className="px-4 py-2">{footer}</div>
      )}
    </div>
  );
}
