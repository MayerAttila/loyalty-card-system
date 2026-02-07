"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FeaturesPanel = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const features = [
    {
      title: "Customize every card",
      description:
        "Choose your colors, logo, and stamp style so the card feels like your brand.",
    },
    {
      title: "Invite your staff",
      description:
        "Add team members with roles so your team can stamp cards securely.",
    },
    {
      title: "Track stamping history",
      description: "See every stamp and redemption with a full activity log.",
    },
    {
      title: "Google Wallet ready",
      description:
        "Customers save the card on their phone and never forget it.",
    },
    {
      title: "Apple Wallet ready (Coming soon)",
      description: "Let iPhone customers add their card in one tap.",
    },
    {
      title: "Customer notifications (Coming soon)",
      description: "Send reminders and reward updates to bring customers back.",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-feature-item]");
      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: index * 0.05,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="glass-card p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="md:w-1/2">
          <div className="mt-5 grid gap-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                data-feature-item
                className="rounded-xl border border-accent-2 bg-primary/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-brand">
                      {feature.title}
                    </p>
                    <p className="text-sm text-contrast/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block md:h-full">
          <div className="flex h-full items-start">
            <img
              src="/what-you-get.png"
              alt="Loyalty card preview"
              className="h-full w-full object-contain object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesPanel;
