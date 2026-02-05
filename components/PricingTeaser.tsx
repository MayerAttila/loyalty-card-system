import Link from "next/link";
import SubscriptionCard from "@/components/SubscriptionCard";

const PricingTeaser = () => {
  return (
    <section className="mt-16">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-contrast">Pricing</h2>
        <p className="mt-2 text-sm text-contrast/80">
          Choose the plan that fits your business. Start with a free trial.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SubscriptionCard
          title="Free trial"
          price="30 days"
          interval="no card required"
          description="Try the full product before adding payment details."
          features={["Full access during trial", "No payment required", "Cancel anytime"]}
          action={
            <Link
              className="block w-full rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-primary"
              href="/register"
            >
              Start free trial
            </Link>
          }
        />
        <SubscriptionCard
          title="Monthly"
          price="EUR 7.99"
          interval="per month"
          description="Flexible monthly plan for smaller teams."
          features={["Cancel anytime", "All core loyalty features", "Email support"]}
          action={
            <Link
              className="block w-full rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-primary"
              href="/register"
            >
              Subscribe monthly
            </Link>
          }
        />
        <SubscriptionCard
          title="Annual"
          price="EUR 79.99"
          interval="per year"
          description="Save with annual subscription for growing teams."
          features={["2 months free vs monthly", "Priority support", "All core loyalty features"]}
          badge="Best value"
          highlighted
          action={
            <Link
              className="block w-full rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-primary"
              href="/register"
            >
              Subscribe annually
            </Link>
          }
        />
      </div>
    </section>
  );
};

export default PricingTeaser;
