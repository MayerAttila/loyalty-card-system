const FeaturesPanel = () => {
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
      description:
        "See every stamp and redemption with a full activity log.",
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
      description:
        "Send reminders and reward updates to bring customers back.",
    },
  ];

  return (
    <section className="rounded-2xl border border-accent-3 bg-accent-1 p-6">
      <p className="text-xs uppercase tracking-wide text-contrast/60">
        What you get
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-accent-3 bg-primary/40 p-4"
          >
            <p className="text-sm font-semibold text-contrast">
              {feature.title}
            </p>
            <p className="mt-2 text-xs text-contrast/70">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesPanel;
