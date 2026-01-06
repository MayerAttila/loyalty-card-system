type Props = { className?: string };

export default function BottomBrandWave({ className = "" }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 0 60 H 1440 V 0 C 700 50 700 50, 0 0 Z"
        fill="rgb(var(--color-brand))"
      />
    </svg>
  );
}
