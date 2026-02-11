"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import SubscriptionCard from "@/components/SubscriptionCard";
import { getSubscriptionPlanCatalog } from "@/lib/subscription/planCatalog";

const PricingTeaser = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const plans = getSubscriptionPlanCatalog(30);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const titleEls = gsap.utils.toArray<HTMLElement>("[data-pricing-title]");
      const cardEls = gsap.utils.toArray<HTMLElement>("[data-pricing-card]");

      if (titleEls.length) {
        gsap.fromTo(
          titleEls,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      if (cardEls.length) {
        cardEls.forEach((cardEl, index) => {
          gsap.fromTo(
            cardEl,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
              delay: index * 0.06,
              scrollTrigger: {
                trigger: cardEl,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="mt-16">
      <div className="mb-6">
        <h2 data-pricing-title className="text-2xl font-semibold text-contrast">
          Pricing
        </h2>
        <p data-pricing-title className="mt-2 text-sm text-contrast/80">
          Choose the plan that fits your business. Start with a free trial.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div data-pricing-card>
          <SubscriptionCard
            variant="glassy"
            title={plans.trial.title}
            price={plans.trial.price}
            interval={plans.trial.interval}
            description={plans.trial.description}
            features={plans.trial.features}
            action={
              <Button className="w-full" onClick={() => router.push("/register")}>
                Start free trial
              </Button>
            }
          />
        </div>
        <div data-pricing-card>
          <SubscriptionCard
            variant="glassy"
            title={plans.monthly.title}
            price={plans.monthly.price}
            interval={plans.monthly.interval}
            description={plans.monthly.description}
            features={plans.monthly.features}
            action={
              <Button className="w-full" onClick={() => router.push("/register")}>
                Subscribe monthly
              </Button>
            }
          />
        </div>
        <div data-pricing-card>
          <SubscriptionCard
            variant="glassy"
            title={plans.annual.title}
            price={plans.annual.price}
            interval={plans.annual.interval}
            description={plans.annual.description}
            features={plans.annual.features}
            badge={plans.annual.badge}
            highlighted
            action={
              <Button className="w-full" onClick={() => router.push("/register")}>
                Subscribe annually
              </Button>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default PricingTeaser;
