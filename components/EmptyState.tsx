import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

const EmptyState = ({
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) => {
  return (
    <div className="rounded-xl border border-accent-3 bg-accent-1 p-6 text-contrast">
      <h2 className="text-lg font-semibold text-brand">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm text-contrast/70">{description}</p>
      ) : null}
      {(actionLabel && actionHref) || (secondaryLabel && secondaryHref) ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {actionLabel && actionHref ? (
            <Link
              href={actionHref}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary"
            >
              {actionLabel}
            </Link>
          ) : null}
          {secondaryLabel && secondaryHref ? (
            <Link
              href={secondaryHref}
              className="rounded-lg border border-accent-3 px-4 py-2 text-sm font-semibold text-contrast"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default EmptyState;
