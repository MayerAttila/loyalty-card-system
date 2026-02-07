"use client";

import { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const faqs = [
  {
    question: "How fast can I launch?",
    answer: "Most businesses set up their card in under 15 minutes.",
  },
  {
    question: "Do I need special hardware?",
    answer: "No. Any phone or tablet can scan QR codes and stamp cards.",
  },
  {
    question: "What do customers need?",
    answer: "Just their phone to save the card and show the QR code.",
  },
  {
    question: "Can I customize stamps and rewards?",
    answer: "Yes. You control stamp count, reward rules, and visuals.",
  },
  {
    question: "Can I invite staff?",
    answer: "Yes. Add team members and manage roles anytime.",
  },
  {
    question: "Does it work with Google Wallet?",
    answer: "Yes. Customers can save their card directly to Google Wallet.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Cancel at the end of your billing period from Stripe.",
  },
  {
    question: "Do you offer annual pricing?",
    answer: "Yes. Annual plans are discounted compared to monthly.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-faq-item]");
      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: index * 0.04,
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
    <section className="mt-16">
      <div ref={sectionRef} className="glass-card p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-contrast">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-contrast/70">
            Still have questions? Reach out and we will help.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <button
                key={faq.question}
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                data-faq-item
                className="w-full rounded-2xl border border-accent-3/60 bg-primary/25 px-6 py-4 text-left shadow-[0_12px_30px_-22px_rgba(0,0,0,0.6)] backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-lg font-semibold text-contrast">
                    {faq.question}
                  </span>
                  <AiOutlinePlus
                    className={`text-3xl text-brand transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </div>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="mt-3 text-base text-contrast/75">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
