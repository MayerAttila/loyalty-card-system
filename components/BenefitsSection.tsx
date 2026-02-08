"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiBell, FiGlobe } from "react-icons/fi";
import { FaRegCreditCard } from "react-icons/fa";
import { HiOutlineDeviceMobile } from "react-icons/hi";

const BenefitsSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const benefits = [
    {
      title: "Customizable cards",
      description:
        "Match your brand with custom colors, logos, and stamp styles.",
      icon: <FaRegCreditCard className="h-8 w-8 text-brand" />,
    },
    {
      title: "Modern wallet integration",
      description: "Let customers save their card to Google Wallet instantly.",
      icon: <HiOutlineDeviceMobile className="h-8 w-8 text-brand" />,
    },
    {
      title: "No application needed",
      description: "Everything works in the browser with simple QR scanning.",
      icon: <FiGlobe className="h-8 w-8 text-brand" />,
    },
    {
      title: "Direct customer notifications",
      description: "Send reward updates and reminders to bring customers back.",
      icon: <FiBell className="h-8 w-8 text-brand" />,
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const titleEls = gsap.utils.toArray<HTMLElement>("[data-benefits-title]");
      const itemEls = gsap.utils.toArray<HTMLElement>("[data-benefit-item]");

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

      if (itemEls.length) {
        itemEls.forEach((el, index) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              delay: index * 0.05,
              scrollTrigger: {
                trigger: el,
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
    <section className="mt-16">
      <div ref={sectionRef} className="glass-card p-8">
        <div className="text-center">
          <h2 data-benefits-title className="text-2xl font-semibold text-contrast">
            Why choose us?
          </h2>
          <p data-benefits-title className="mt-2 text-sm text-contrast/80">
            Engage customers and grow your business with our loyalty features.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} data-benefit-item className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/50">
                {benefit.icon}
              </div>
              <p className="mt-4 text-sm font-semibold text-contrast">
                {benefit.title}
              </p>
              <p className="mt-2 text-xs text-contrast/70">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
