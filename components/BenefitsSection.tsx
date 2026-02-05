const BenefitsSection = () => {
  const benefits = [
    {
      title: "Simple for staff",
      description:
        "Scan a customer QR code and add stamps instantly. No training, no confusion.",
    },
    {
      title: "Delight customers",
      description:
        "Customers always have their card on their phone, with clear progress to the next reward.",
    },
    {
      title: "Track loyalty",
      description:
        "See redemptions, customer activity, and team performance in one place.",
    },
  ];

  return (
    <section className="mt-16">
      <div className="grid gap-6 md:grid-cols-3">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-xl border border-accent-3 bg-accent-1 p-6"
          >
            <h2 className="text-lg font-semibold text-contrast">
              {benefit.title}
            </h2>
            <p className="mt-2 text-sm text-contrast/80">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
