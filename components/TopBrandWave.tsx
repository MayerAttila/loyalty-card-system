type Props = {
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
};

export default function TopBrandWave({
  className = "",
  topClassName = "fill-brand",
  bottomClassName = "fill-primary",
}: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect className={bottomClassName} x="0" y="0" width="1440" height="60" />
      <path
        className={topClassName}
        d="M 0 0 H 1440 V 60 C 700 10 700 10, 0 60 Z"
      />
    </svg>
  );
}
