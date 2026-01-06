type Props = {
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
};

export default function BottomBrandWave({
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
        d="M 0 60 H 1440 V 0 C 700 50 700 50, 0 0 Z"
      />
    </svg>
  );
}
