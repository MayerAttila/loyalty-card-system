"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WalletCardPreview from "@/app/(protected)/[businessSlug]/cards/WalletCardPreview";

const CardDemo = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const demos = [
    {
      text1: "Brew House",
      text2: "Coffee Club",
      maxPoints: 10,
      filledPoints: 4,
      rewardsCollected: 1,
      cardColor: "#141b2d",
      logoSrc: "/demo/demo1/logo.png",
      filledStampSrc: "/demo/demo1/stampon.png",
      emptyStampSrc: "/demo/demo1/stampoff.png",
    },
    {
      text1: "Glow Studio",
      text2: "Beauty Rewards",
      maxPoints: 8,
      filledPoints: 6,
      rewardsCollected: 0,
      cardColor: "#1c273a",
      logoSrc: "/demo/demo2/logo.png",
      filledStampSrc: "/demo/demo2/stampon.png",
      emptyStampSrc: "/demo/demo2/stampoff.png",
    },
    {
      text1: "Urban Fit",
      text2: "Fitness Pass",
      maxPoints: 12,
      filledPoints: 9,
      rewardsCollected: 2,
      cardColor: "#0f172a",
      logoSrc: "/demo/demo3/logo.png",
      filledStampSrc: "/demo/demo3/stampon.png",
      emptyStampSrc: "/demo/demo3/stampoff.png",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const titleEls = gsap.utils.toArray<HTMLElement>("[data-carddemo-title]");
      const cardEls = gsap.utils.toArray<HTMLElement>("[data-carddemo-card]");

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
        cardEls.forEach((el, index) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
              delay: index * 0.06,
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
    <section ref={sectionRef} className="mt-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 data-carddemo-title className="text-2xl font-semibold text-contrast">
            Card designs your customers will love
          </h2>
          <p data-carddemo-title className="mt-2 text-sm text-contrast/80">
            Create clean, modern loyalty cards that match your brand.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {demos.map((demo) => (
          <div key={demo.text2} data-carddemo-card className="flex justify-center">
            <WalletCardPreview
              text1={demo.text1}
              text2={demo.text2}
              maxPoints={demo.maxPoints}
              filledPoints={demo.filledPoints}
              rewardsCollected={demo.rewardsCollected}
              cardColor={demo.cardColor}
              logoSrc={demo.logoSrc}
              useLogo
              filledStampSrc={demo.filledStampSrc}
              emptyStampSrc={demo.emptyStampSrc}
              useStampImages
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CardDemo;
