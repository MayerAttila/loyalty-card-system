type HelpCardProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

const HelpCard = ({ title, description, children }: HelpCardProps) => {
  return (
    <div className="rounded-xl border border-accent-3 bg-primary/60 p-5 text-contrast">
      <h3 className="text-lg font-semibold text-brand">{title}</h3>
      <p className="mt-2 text-sm text-contrast/80">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
};

export default HelpCard;
