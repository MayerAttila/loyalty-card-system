import "./globals.css";
import MainFooter from "@/components/MainFooter";
import MainHeader from "@/components/MainHeader";
import TopBrandWave from "@/components/TopBrandWave";
import BottomBrandWave from "@/components/BottomBrandWave";
import ToastProvider from "@/components/ToastProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MainHeader />
        <TopBrandWave />
        <ToastProvider />
        {children}
        <BottomBrandWave />
        <MainFooter />
      </body>
    </html>
  );
}
