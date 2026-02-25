import MainFooter from "@/components/MainFooter";
import MainHeader from "@/components/MainHeader";
import TopBrandWave from "@/components/TopBrandWave";
import BottomBrandWave from "@/components/BottomBrandWave";
import BackgroundFog from "@/components/BackgroundFog";
import ReferralCapture from "@/components/ReferralCapture";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark">
      <div className="relative">
        <BackgroundFog />
        <div className="relative z-10">
          <Suspense fallback={null}>
            <ReferralCapture />
          </Suspense>
          <MainHeader />
          <TopBrandWave />
          {children}
          <BottomBrandWave />
          <MainFooter />
        </div>
      </div>
    </div>
  );
}
