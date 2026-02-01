import React from "react";

type SubscriptionCardProps = {
  title: string;
  price: string;
  interval: string;
  description: string;
  features: string[];
  action: React.ReactNode;
  badge?: string;
  highlighted?: boolean;
};

const SubscriptionCard = ({
  title,
  price,
  interval,
  description,
  features,
  action,
  badge,
  highlighted = false,
}: SubscriptionCardProps) => {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border px-6 py-7 ${
        highlighted
          ? "border-brand/60 bg-gradient-to-br from-accent-1 via-accent-1/80 to-primary/70 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.7)]"
          : "border-accent-3 bg-accent-1"
      }`}
    >
      {badge ? (
        <span className="absolute right-5 top-5 rounded-full bg-brand/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand">
          {badge}
        </span>
      ) : null}
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-contrast/60">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-contrast">{price}</span>
          <span className="text-xs text-contrast/60">{interval}</span>
        </div>
        <p className="text-sm text-contrast/75">{description}</p>
      </div>

      <ul className="mt-5 space-y-2 text-sm text-contrast/80">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">{action}</div>
    </section>
  );
};

export default SubscriptionCard;
