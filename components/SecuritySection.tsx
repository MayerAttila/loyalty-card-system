const SecuritySection = () => {
  const points = [
    {
      title: "Stripe-secured payments",
      description: "All billing is handled by Stripe with industry-leading security.",
    },
    {
      title: "Data privacy",
      description: "Customer data stays in your account and is never sold.",
    },
    {
      title: "Reliable access",
      description: "Works on modern browsers and mobile devices without extra apps.",
    },
  ];

  return (
    <section className="mt-16">
      <div className="rounded-2xl border border-accent-3 bg-accent-2 p-8">
        <h2 className="text-2xl font-semibold text-contrast">Security</h2>
        <p className="mt-2 text-sm text-contrast/80">
          Built for businesses that need trust and reliability.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {points.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-accent-3 bg-primary/40 p-4"
            >
              <p className="text-sm font-semibold text-contrast">
                {point.title}
              </p>
              <p className="mt-2 text-xs text-contrast/70">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
