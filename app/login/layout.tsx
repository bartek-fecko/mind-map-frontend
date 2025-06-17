export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          {children}
        </div>
      </body>
    </html>
  );
}
