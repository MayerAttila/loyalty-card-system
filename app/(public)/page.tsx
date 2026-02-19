import CardDemo from "@/components/CardDemo";
import FeaturesPanel from "@/components/FeaturesPanel";
import HowItWorks from "@/components/HowItWorks";
import PricingTeaser from "@/components/PricingTeaser";
import FaqSection from "@/components/FaqSection";
import SecuritySection from "@/components/SecuritySection";
import BenefitsSection from "@/components/BenefitsSection";

const page = () => {
  return (
    <main className="min-h-screen bg-transparent text-contrast">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="mt-3 text-4xl text-center font-semibold text-contrast md:text-5xl mb-10">
          Turn every visit into a reason to come back.
        </h1>

        <section id="features" className="scroll-mt-24">
          <FeaturesPanel />
        </section>

        <section id="demo" className="scroll-mt-24">
          <CardDemo />
        </section>

        <section id="how-it-works" className="scroll-mt-24">
          <HowItWorks />
        </section>

        <section id="pricing" className="scroll-mt-24">
          <PricingTeaser />
        </section>

        <section id="benefits" className="scroll-mt-24">
          <BenefitsSection />
        </section>

        <section id="faq" className="scroll-mt-24">
          <FaqSection />
        </section>
      </div>
    </main>
  );
};

export default page;
