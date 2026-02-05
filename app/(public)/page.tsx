import Link from "next/link";
import CardDemo from "@/components/CardDemo";
import FeaturesPanel from "@/components/FeaturesPanel";
import HowItWorks from "@/components/HowItWorks";
import PricingTeaser from "@/components/PricingTeaser";
import FaqSection from "@/components/FaqSection";
import SecuritySection from "@/components/SecuritySection";
import BenefitsSection from "@/components/BenefitsSection";

const page = () => {
  return (
    <main className="min-h-screen bg-primary text-contrast">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
          <h1 className="mt-3 text-4xl text-center font-semibold text-contrast md:text-5xl">
            Turn every visit into a reason to come back.
          </h1>

          <FeaturesPanel />
        </header>

        <CardDemo />

        <HowItWorks />

        <PricingTeaser />

        <BenefitsSection />

        <FaqSection />
      </div>
    </main>
  );
};

export default page;
