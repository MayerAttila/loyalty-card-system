import type { CSSProperties } from "react";

type LoyaleLogoProps = {
  className?: string;
  color?: string;
  label?: string;
};

export default function LoyaleLogo({
  className,
  color = "currentColor",
  label = "Loyale",
}: LoyaleLogoProps) {
  const resolvedColor = /^var\(--color-[^)]+\)$/.test(color)
    ? `rgb(${color} / 1)`
    : color;

  const style: CSSProperties = {
    backgroundColor: resolvedColor,
    WebkitMaskImage: "url('/loyale-logo.svg')",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    WebkitMaskSize: "contain",
    maskImage: "url('/loyale-logo.svg')",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    maskSize: "contain",
  };

  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-block ${className ?? ""}`.trim()}
      style={style}
    />
  );
}
