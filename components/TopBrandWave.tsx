type Props = { className?: string };

export default function TopBrandWave({ className = "" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 0 0 H 1440 V 60 C 700 10 700 10, 0 60 Z"
        fill="rgb(var(--color-brand))"
      />
    </svg>
  );
}
