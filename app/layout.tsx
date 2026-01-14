// app/layout.tsx
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import ThemeProvider from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
