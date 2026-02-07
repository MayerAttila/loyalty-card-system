import MainFooter from "@/components/MainFooter";
import MainHeader from "@/components/MainHeader";
import TopBrandWave from "@/components/TopBrandWave";
import BottomBrandWave from "@/components/BottomBrandWave";
import BackgroundFog from "@/components/BackgroundFog";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <BackgroundFog showBounds />
      <div className="relative z-10">
        <MainHeader />
        <TopBrandWave />
        {children}
        <BottomBrandWave />
        <MainFooter />
      </div>
    </div>
  );
}
