"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiUserPlus, FiUsers, FiGift } from "react-icons/fi";
import { FaRegCreditCard } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { HiOutlineQrcode } from "react-icons/hi";

const steps = [
  {
    title: "Create your account",
    description: "Sign up and set up your loyalty program in minutes.",
    icon: <FiUserPlus className="h-10 w-10 text-brand" />,
  },
  {
    title: "Customize your card",
    description: "Add your logo, stamps, rewards, and brand colors.",
    icon: <FaRegCreditCard className="h-10 w-10 text-brand" />,
  },
  {
    title: "Invite your staff",
    description: "Add team members so they can scan and stamp cards.",
    icon: <FiUsers className="h-10 w-10 text-brand" />,
  },
  {
    title: "Share the QR code",
    description: "Customers scan and instantly get their digital card.",
    icon: <HiOutlineQrcode className="h-10 w-10 text-brand" />,
  },
  {
    title: "Start stamping",
    description: "Scan customer QR codes and reward loyalty instantly.",
    icon: <FaRegCheckCircle className="h-10 w-10 text-brand" />,
  },
  {
    title: "Reward customers",
    description: "Celebrate redemptions and keep customers coming back.",
    icon: <FiGift className="h-10 w-10 text-brand" />,
  },
];

const roads = [
  {
    className:
      "right-[-180px] top-[100%] h-[200px] w-[220px] -translate-y-1/2 rotate-12",
    viewBox: "0 0 220 180",
    path: "M40 50 C60 50, 140 50, 160 140",
  },
  {
    className:
      "left-[-130px] top-[100%] h-[140px] w-[160px] -translate-y-1/2 -rotate-6",
    viewBox: "0 0 160 140",
    path: "M120 20 C70 20, 20 60, 30 120",
  },
  {
    className:
      "right-[-80px] top-[140%] h-[240px] w-[160px] -translate-y-1/2 rotate-90",
    viewBox: "0 0 160 140",
    path: "M20 60 C90 20, 140 60, 150 130",
  },
  {
    className:
      "left-[20px] top-[150%] h-[140px] w-[160px] -translate-y-1/2 -rotate-180",
    viewBox: "0 0 160 140",
    path: "M20 10 C90 20, 140 60, 140 120",
  },
  {
    className:
      "right-[0px] top-[180%] h-[140px] w-[160px] -translate-y-1/2 rotate-90",
    viewBox: "0 0 160 140",
    path: "M10 20 C30 20, 110 30, 120 90",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const titleEls = gsap.utils.toArray<HTMLElement>(
        "[data-howitworks-title]",
      );
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
          },
        );
      }

      const stepEls = gsap.utils.toArray<HTMLElement>("[data-howitworks-step]");

      stepEls.forEach((stepEl) => {
        const tileEl = stepEl.querySelector<HTMLElement>(
          "[data-howitworks-tile]",
        );
        const roadWrap = stepEl.querySelector<HTMLElement>(
          "[data-howitworks-road]",
        );
        const roadPath = stepEl.querySelector<SVGPathElement>(
          "[data-howitworks-road-path]",
        );

        // Don't touch transforms on the step element itself, because it uses Tailwind
        // translate-x for the zig-zag layout. Animate y on an inner wrapper instead.
        gsap.set(stepEl, { autoAlpha: 0 });
        if (tileEl) gsap.set(tileEl, { y: 18 });

        // Tile animation (fade + lift) lives on its own ScrollTrigger.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: stepEl,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          })
          .to(stepEl, { autoAlpha: 1, duration: 0.35, ease: "power1.out" }, 0)
          .to(tileEl, { y: 0, duration: 0.6, ease: "power2.out" }, 0);

        // Road animation is separated from tiles:
        // simple fade in/out (no continuous motion).
        if (roadPath) {
          gsap.set(roadPath, { opacity: 0 });

          ScrollTrigger.create({
            trigger: roadWrap ?? stepEl,
            start: "top 90%",
            end: "bottom 10%",
            onEnter: () => {
              gsap.to(roadPath, {
                opacity: 0.3,
                duration: 0.35,
                ease: "power1.out",
              });
            },
            onEnterBack: () => {
              gsap.to(roadPath, {
                opacity: 0.3,
                duration: 0.35,
                ease: "power1.out",
              });
            },
            onLeave: () => {
              gsap.to(roadPath, {
                opacity: 0,
                duration: 0.2,
                ease: "power1.out",
              });
            },
            onLeaveBack: () => {
              gsap.to(roadPath, {
                opacity: 0,
                duration: 0.2,
                ease: "power1.out",
              });
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mt-16">
      <div ref={sectionRef} className="glass-card p-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            data-howitworks-title
            className="text-2xl font-semibold text-contrast"
          >
            How it works
          </h2>
          <p data-howitworks-title className="mt-2 text-sm text-contrast/80">
            A simple flow your team and customers can follow in minutes.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-5xl">
          <div className="grid gap-16">
            {steps.map((step, index) => {
              const offsetClass =
                index % 3 === 0
                  ? "md:-translate-x-24"
                  : index % 3 === 1
                    ? "md:translate-x-20"
                    : "md:-translate-x-6";

              return (
                <div
                  key={step.title}
                  data-howitworks-step
                  className={`relative mx-auto flex w-full max-w-full rounded-2xl border border-accent-2 bg-accent-1/20 p-6 shadow-[0_16px_35px_-25px_rgba(0,0,0,0.6)] md:inline-flex md:w-fit md:min-w-[520px] md:max-w-[760px] ${offsetClass}`}
                >
                  {index < roads.length ? (
                    <div
                      data-howitworks-road
                      className={`pointer-events-none absolute hidden md:block ${roads[index].className}`}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox={roads[index].viewBox}
                        className="h-full w-full"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id={`howitworks-segment-${index}`}
                            x1="0"
                            y1="0"
                            x2="160"
                            y2="140"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#e6345a" stopOpacity="0.45" />
                            <stop
                              offset="1"
                              stopColor="#e6345a"
                              stopOpacity="0.2"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          data-howitworks-road-path
                          d={roads[index].path}
                          stroke={`url(#howitworks-segment-${index})`}
                          strokeWidth="6"
                          strokeDasharray="12 26"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  ) : null}
                  <div data-howitworks-tile>
                    <div className="flex flex-col gap-3 md:flex-row md:items-start">
                      <div className="flex items-center justify-center">
                        {step.icon}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-contrast md:text-left text-center">
                          {step.title}
                        </p>
                        <p className="mt-2 text-base text-contrast/75 md:text-left text-center">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
