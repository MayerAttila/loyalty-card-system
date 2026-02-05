import { FiBell, FiGlobe } from "react-icons/fi";
import { FaRegCreditCard } from "react-icons/fa";
import { HiOutlineDeviceMobile } from "react-icons/hi";

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Customizable cards",
      description:
        "Match your brand with custom colors, logos, and stamp styles.",
      icon: <FaRegCreditCard className="h-8 w-8 text-brand" />,
    },
    {
      title: "Modern wallet integration",
      description:
        "Let customers save their card to Google Wallet instantly.",
      icon: <HiOutlineDeviceMobile className="h-8 w-8 text-brand" />,
    },
    {
      title: "No application needed",
      description: "Everything works in the browser with simple QR scanning.",
      icon: <FiGlobe className="h-8 w-8 text-brand" />,
    },
    {
      title: "Direct customer notifications",
      description:
        "Send reward updates and reminders to bring customers back.",
      icon: <FiBell className="h-8 w-8 text-brand" />,
    },
  ];

  return (
    <section className="mt-16">
      <div className="rounded-2xl border border-accent-3 bg-accent-1 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-contrast">
            Why choose us?
          </h2>
          <p className="mt-2 text-sm text-contrast/80">
            Engage customers and grow your business with our loyalty features.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
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
