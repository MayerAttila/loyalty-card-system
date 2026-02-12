"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WalletCardPreview from "@/app/(protected)/[businessSlug]/cards/WalletCardPreview";
import Button from "@/components/Button";

const CardDemo = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
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
    {
      text1: "Slice Spot",
      text2: "Pizza Perks",
      maxPoints: 10,
      filledPoints: 7,
      rewardsCollected: 1,
      cardColor: "#2a1a14",
      logoSrc: "/demo/demo1/logo.png",
      filledStampSrc: "/demo/demo1/stampon.png",
      emptyStampSrc: "/demo/demo1/stampoff.png",
    },
    {
      text1: "Leaf Market",
      text2: "Green Rewards",
      maxPoints: 6,
      filledPoints: 2,
      rewardsCollected: 0,
      cardColor: "#143024",
      logoSrc: "/demo/demo2/logo.png",
      filledStampSrc: "/demo/demo2/stampon.png",
      emptyStampSrc: "/demo/demo2/stampoff.png",
    },
  ];
  const middleIndex = Math.floor(demos.length / 2);

  const getRelativePosition = (index: number) => {
    const total = demos.length;
    const raw = index - activeIndex;
    const wrapped = ((raw + total + middleIndex) % total) - middleIndex;
    return wrapped;
  };

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

  useEffect(() => {
    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const relative = getRelativePosition(index);
      const distance = Math.abs(relative);
      const zIndex = demos.length - distance;
      const scale = Math.max(0.78, 1 - distance * 0.08);
      const opacity = Math.max(0.5, 1 - distance * 0.12);
      const x = relative * 180;

      gsap.to(el, {
        x,
        scale,
        opacity,
        zIndex,
        duration: 0.55,
        ease: "power3.out",
      });
    });
  }, [activeIndex, demos.length]);

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % demos.length);
  };

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
        <Button type="button" variant="neutral" onClick={goToNext}>
          Next Card
        </Button>
      </div>

      <div className="mt-8 w-full overflow-hidden">
        <div className="relative mx-auto h-[390px] w-full max-w-[1080px]">
          {demos.map((demo, index) => {
            return (
              <div
                key={demo.text2}
                data-carddemo-card
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="absolute left-1/2 top-0 flex -translate-x-1/2 justify-center will-change-transform"
              >
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CardDemo;
