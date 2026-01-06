import "./globals.css";
import MainFooter from "@/components/MainFooter";
import MainHeader from "@/components/MainHeader";
import TopBrandWave from "@/components/TopBrandWave";
import BottomBrandWave from "@/components/BottomBrandWave";

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
        {children}
        <BottomBrandWave />
        <MainFooter />
      </body>
    </html>
  );
}
