"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WalletCardPreview from "@/app/(protected)/[businessSlug]/cards/WalletCardPreview";

const CardDemo = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const desktopPinRef = useRef<HTMLDivElement | null>(null);
  const desktopStageRef = useRef<HTMLDivElement | null>(null);
  const desktopCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopPrevRelativeRef = useRef<number[]>([]);
  const captionTitleRef = useRef<HTMLHeadingElement | null>(null);
  const captionBodyRef = useRef<HTMLParagraphElement | null>(null);
  const captionIndexRef = useRef(0);

  const mobileListRef = useRef<HTMLDivElement | null>(null);
  const mobileWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const demos = [
    {
      text1: "Brew&Bean",
      text2: "Coffee Club",
      maxPoints: 10,
      filledPoints: 4,
      rewardsCollected: 1,
      cardColor: "#31230c",
      logoSrc: "/demo/demo1/logo.png",
      filledStampSrc: "/demo/demo1/stampon.png",
      emptyStampSrc: "/demo/demo1/stampoff.png",
      captionTitle: "Coffee stamps that drive repeat visits",
      captionBody:
        "Reward regulars with a free drink after 10 stamps and keep morning traffic consistent all week.",
    },
    {
      text1: "Grande Slice",
      text2: "Pizza Perks",
      maxPoints: 10,
      filledPoints: 7,
      rewardsCollected: 1,
      cardColor: "#f9e02e",
      logoSrc: "/demo/demo2/logo.png",
      filledStampSrc: "/demo/demo2/stampon.png",
      emptyStampSrc: "/demo/demo2/stampoff.png",
      captionTitle: "Pizza stamps that keep them coming back",
      captionBody:
        "Reward loyal customers with a free pizza after 10 stamps and turn first-time visitors into regulars every week.",
    },
    {
      text1: "Sweet Delights",
      text2: "Cake Rewards",
      maxPoints: 8,
      filledPoints: 6,
      rewardsCollected: 0,
      cardColor: "#ff8da1",
      logoSrc: "/demo/demo3/logo.png",
      filledStampSrc: "/demo/demo3/stampon.png",
      emptyStampSrc: "/demo/demo3/stampoff.png",
      captionTitle: "Sweet stamps that turn cravings into loyalty",
      captionBody:
        "Reward every visit with a stamp and treat customers to a free slice after 8 — keeping dessert lovers coming back for more.",
    },
    {
      text1: "Velvet Lounge",
      text2: "Cocktail Rewards",
      maxPoints: 8,
      filledPoints: 5,
      rewardsCollected: 2,
      cardColor: "#088F8F",
      logoSrc: "/demo/demo4/logo.png",
      filledStampSrc: "/demo/demo4/stampon.png",
      emptyStampSrc: "/demo/demo4/stampoff.png",
      captionTitle: "Sip, collect, celebrate.",
      captionBody:
        "Reward every cocktail with a stamp and treat loyal guests to a free signature drink — turning casual nights into unforgettable rituals.",
    },

    {
      text1: "Sugar Loop",
      text2: "Donut Rewards",

      maxPoints: 8,
      filledPoints: 2,
      rewardsCollected: 0,
      cardColor: "#FB5581",
      logoSrc: "/demo/demo5/logo.png",
      filledStampSrc: "/demo/demo5/stampon.png",
      emptyStampSrc: "/demo/demo5/stampoff.png",
      captionTitle: "Sweet rewards in every bite",
      captionBody:
        "Collect a stamp with every donut and enjoy a free treat after 6 — turning quick cravings into loyal daily visits.",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const titleEls = gsap.utils.toArray<HTMLElement>("[data-carddemo-title]");
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
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, sectionRef);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const stageEl = desktopStageRef.current;
      if (!stageEl || !sectionRef.current) return;

      const updateCaption = (nextIndex: number) => {
        const titleEl = captionTitleRef.current;
        const bodyEl = captionBodyRef.current;
        const next = demos[nextIndex];
        if (!titleEl || !bodyEl || !next) return;
        if (captionIndexRef.current === nextIndex) return;

        captionIndexRef.current = nextIndex;
        gsap.to([titleEl, bodyEl], {
          opacity: 0,
          y: 8,
          duration: 0.16,
          ease: "power2.out",
          overwrite: "auto",
          onComplete: () => {
            titleEl.textContent = next.captionTitle;
            bodyEl.textContent = next.captionBody;
            gsap.to([titleEl, bodyEl], {
              opacity: 1,
              y: 0,
              duration: 0.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          },
        });
      };

      const applyDepth = () => {
        const viewportCenter = window.innerWidth / 2;
        desktopCardRefs.current.forEach((cardEl) => {
          if (!cardEl) return;
          const rect = cardEl.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(cardCenter - viewportCenter);
          const normalized = Math.min(1, distance / 420);
          const scale = 1 - normalized * 0.16;
          const zIndex = 1000 - Math.round(normalized * 1000);
          gsap.set(cardEl, { scale, zIndex, force3D: true });
        });
      };

      const overlapStep = 156;
      const half = demos.length / 2;
      const state = { index: 0 };
      const wrapRelative = gsap.utils.wrap(-half, half);

      const renderStack = (progressIndex: number) => {
        const clampedIndex = Math.max(
          0,
          Math.min(demos.length - 1, Math.round(progressIndex)),
        );
        updateCaption(clampedIndex);

        desktopCardRefs.current.forEach((cardEl, cardIndex) => {
          if (!cardEl) return;
          const relative = wrapRelative(cardIndex - progressIndex) as number;
          const distance = Math.abs(relative);
          const x = relative * overlapStep;
          const scale = Math.max(0.8, 1 - distance * 0.08);
          const zIndex = 1000 - Math.round(distance * 100);
          const prevRelative = desktopPrevRelativeRef.current[cardIndex];
          const wrappedJump =
            prevRelative !== undefined &&
            Math.abs(relative - prevRelative) > half;

          if (wrappedJump) {
            // Smooth the side switch: card exits one edge then re-enters from the opposite edge.
            const movingLeftToRight = prevRelative < 0 && relative > 0;
            const offscreenX = movingLeftToRight
              ? -(half + 0.65) * overlapStep
              : (half + 0.65) * overlapStep;

            gsap.killTweensOf(cardEl);
            gsap.set(cardEl, {
              x: offscreenX,
              scale,
              zIndex,
              opacity: 0,
              force3D: true,
            });
            gsap.to(cardEl, {
              x,
              opacity: 1,
              duration: 0.24,
              ease: "power2.out",
              overwrite: "auto",
              force3D: true,
            });
          } else {
            gsap.set(cardEl, { x, scale, opacity: 1, zIndex, force3D: true });
          }

          desktopPrevRelativeRef.current[cardIndex] = relative;
        });

        applyDepth();
      };

      desktopPrevRelativeRef.current = [];
      renderStack(0);

      gsap.to(state, {
        index: demos.length - 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => {
            const vh = window.innerHeight || 900;
            const perStep = vh * 0.45;
            const min = vh * 1.25;
            const total = Math.max(
              min,
              perStep * Math.max(1, demos.length - 1),
            );
            return `+=${Math.round(total)}`;
          },
          pin: sectionRef.current,
          scrub: true,
          ...(demos.length > 1
            ? {
                snap: {
                  snapTo: 1 / (demos.length - 1),
                  duration: { min: 0.15, max: 0.35 },
                  ease: "power2.out",
                },
              }
            : {}),
          invalidateOnRefresh: true,
        },
        onUpdate: () => renderStack(state.index),
      });
    });

    mm.add("(max-width: 767px)", () => {
      const listEl = mobileListRef.current;
      const wrappers = mobileWrapperRefs.current.filter(
        Boolean,
      ) as HTMLDivElement[];
      const cards = mobileCardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!listEl || !wrappers.length || !cards.length) return;

      wrappers.forEach((wrapper, i) => {
        const card = cards[i];
        if (!card) return;
        const isLast = i === cards.length - 1;
        const scale = isLast ? 1 : 0.9 + 0.025 * i;
        const rotationX = isLast ? 0 : -8;

        gsap.to(card, {
          scale,
          rotationX,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: `top ${62 + 8 * i}px`,
            ...(isLast
              ? {
                  end: () =>
                    `+=${Math.round((window.innerHeight || 800) * 0.45)}`,
                }
              : {
                  end: "bottom 500px",
                  endTrigger: listEl,
                }),
            scrub: true,
            pin: wrapper,
            pinSpacing: false,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="mt-16">
      <div className="md:hidden">
        <div className="flex flex-col gap-4">
          <h2
            data-carddemo-title
            className="text-2xl font-semibold text-contrast"
          >
            Card designs your customers will love
          </h2>
          <p data-carddemo-title className="mt-2 text-sm text-contrast/80">
            Create clean, modern loyalty cards that match your brand.
          </p>
        </div>
      </div>

      <div
        ref={desktopPinRef}
        className="mt-6 hidden md:flex md:min-h-[calc(100vh-6rem)] md:flex-col md:items-center md:justify-center md:gap-6 md:pb-4"
      >
        <div className="w-full">
          <h2
            data-carddemo-title
            className="text-2xl font-semibold text-contrast"
          >
            Card designs your customers will love
          </h2>
          <p data-carddemo-title className="mt-2 text-sm text-contrast/80">
            Create clean, modern loyalty cards that match your brand.
          </p>
        </div>

        <div
          ref={desktopStageRef}
          className="relative mx-auto h-[390px] w-full max-w-[1080px] overflow-hidden"
          data-carddemo-track
        >
          {demos.map((demo, index) => (
            <div
              key={`desktop-${demo.text2}`}
              data-carddemo-card
              ref={(el) => {
                desktopCardRefs.current[index] = el;
              }}
              className="absolute left-1/2 top-0 w-[320px] -translate-x-1/2 will-change-transform"
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
          ))}
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <h3
            ref={captionTitleRef}
            className="text-xl font-semibold text-contrast md:text-2xl"
          >
            {demos[0].captionTitle}
          </h3>
          <p
            ref={captionBodyRef}
            className="mx-auto mt-3 max-w-2xl text-sm text-contrast/75 md:text-base"
          >
            {demos[0].captionBody}
          </p>
        </div>
      </div>

      <div
        ref={mobileListRef}
        className="mt-6 mx-auto w-full max-w-[1080px] px-2 md:hidden"
        data-mobile-carddemo-list
      >
        {demos.map((demo, index) => (
          <div
            key={`mobile-${demo.text2}`}
            ref={(el) => {
              mobileWrapperRefs.current[index] = el;
            }}
            className="mb-10 last:mb-0 [perspective:800px]"
          >
            <div
              ref={(el) => {
                mobileCardRefs.current[index] = el;
              }}
              className="will-change-transform"
            >
              <div className="flex justify-center">
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CardDemo;
