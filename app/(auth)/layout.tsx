export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative max-w-md w-full">{children}</div>
    </div>
  );
}
