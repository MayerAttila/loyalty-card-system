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
          <div>
            <h1 className="mt-3 text-4xl font-semibold text-contrast md:text-5xl">
              Turn every visit into a reason to come back.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-contrast/80">
              Launch digital stamp cards in minutes. Let customers scan, collect
              rewards, and keep your brand in their pocket with Google Wallet.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-primary"
                href="/register"
              >
                Start free trial
              </Link>
              <Link
                className="rounded-lg border border-accent-4 px-5 py-3 text-sm font-semibold text-contrast"
                href="/login"
              >
                Log in
              </Link>
            </div>
            <p className="mt-3 text-xs text-contrast/60">
              No hardware required. Works on any phone.
            </p>
          </div>

          <FeaturesPanel />
        </header>

        <BenefitsSection />

        <HowItWorks />

        <CardDemo />

        <SecuritySection />

        <FaqSection />
        <PricingTeaser />
      </div>
    </main>
  );
};

export default page;
