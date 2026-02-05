const HowItWorks = () => {
  const steps = [
    {
      title: "Create your account",
      description: "Sign up to start your loyalty program.",
    },
    {
      title: "Save business details",
      description: "Add your logo, location, and brand colors.",
    },
    {
      title: "Design your card",
      description: "Customize stamps, rewards, and the card look.",
    },
    {
      title: "Invite your staff",
      description: "Add team members so they can stamp cards.",
    },
    {
      title: "Share the QR code",
      description: "Let customers scan to get their card instantly.",
    },
    {
      title: "Start stamping",
      description: "Scan customer cards and reward loyalty.",
    },
  ];

  return (
    <section className="mt-16">
      <div className="rounded-2xl border border-accent-3 bg-accent-2 p-8">
        <h2 className="text-2xl font-semibold text-contrast">How it works</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-xl border border-accent-3 bg-primary/40 p-5"
            >
              <p className="text-xs uppercase tracking-wide text-contrast/60">
                Step {index + 1}
              </p>
              <p className="mt-2 text-sm font-semibold text-contrast">
                {step.title}
              </p>
              <p className="mt-2 text-xs text-contrast/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
