"use client";

import { useMemo, useRef } from "react";

type Step = {
  key: string;
  label: string;
  description?: string;
};

export type StepperTheme = {
  connectorWidthPx: number;
  connectorGapPx: number;

  connectorDurationMs: number;
  dotDurationMs: number;

  brand: string;
  track: string;

  dotBg: string;
  inactiveBorder: string;
  inactiveText: string;

  activeText: string;
  completeText: string;

  labelInactive: string;
};

type JoinStepperProps = {
  steps: Step[];
  activeStep: number;
  pendingStep: number | null;
  theme: StepperTheme;
  onCommitStep: (step: number) => void;
};

const Stepper = ({
  steps,
  activeStep,
  pendingStep,
  theme,
  onCommitStep,
}: JoinStepperProps) => {
  const isAnimating = pendingStep !== null;

  const from = activeStep;
  const to = pendingStep ?? activeStep;
  const direction = to > from ? "forward" : "backward";

  // forward: mark current step complete immediately, but don't activate next until commit
  const visualCompleteUpto =
    isAnimating && direction === "forward" ? from + 1 : from;

  const vars = useMemo(
    () =>
      ({
        ["--st-brand" as any]: theme.brand,
        ["--st-dotBg" as any]: theme.dotBg,
        ["--st-completeText" as any]: theme.completeText,
        ["--st-activeText" as any]: theme.activeText,
        ["--st-track" as any]: theme.track,
        ["--st-inactiveBorder" as any]: theme.inactiveBorder,
        ["--st-inactiveText" as any]: theme.inactiveText,
        ["--st-labelInactive" as any]: theme.labelInactive,
        ["--st-connW" as any]: `${theme.connectorWidthPx}px`,
        ["--st-gap" as any]: `${theme.connectorGapPx}px`,
        ["--st-connDur" as any]: `${theme.connectorDurationMs}ms`,
        ["--st-dotDur" as any]: `${theme.dotDurationMs}ms`,
      }) as React.CSSProperties,
    [theme],
  );

  // guard so transitionend fires once
  const committedRef = useRef(false);
  if (!isAnimating) committedRef.current = false;

  const shouldCommitOnEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (!isAnimating) return;
    if (e.propertyName !== "transform") return;
    if (committedRef.current) return;
    committedRef.current = true;
    onCommitStep(to);
  };

  return (
    <div className="flex justify-center" style={vars}>
      <div className="flex flex-col items-center">
        {/* DOTS + CONNECTORS */}
        <div className="flex items-center">
          {steps.map((step, index) => {
            const isComplete = index < visualCompleteUpto;
            const isActive = isAnimating
              ? index === from
              : index === activeStep;

            const dotBase =
              "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold shadow-sm";

            const dotMotion =
              "transition-all ease-out duration-[var(--st-dotDur)]";

            const dotState = isComplete
              ? "bg-[var(--st-brand)] border-[var(--st-brand)] text-[var(--st-completeText)] scale-105"
              : isActive
                ? "bg-[var(--st-dotBg)] border-[var(--st-brand)] text-[var(--st-activeText)] scale-110"
                : "bg-[var(--st-dotBg)] border-[var(--st-inactiveBorder)] text-[var(--st-inactiveText)] scale-100";

            return (
              <div key={step.key} className="flex items-center">
                <div className={`${dotBase} ${dotMotion} ${dotState}`}>
                  {isComplete ? "✓" : index + 1}
                </div>

                {index < steps.length - 1 && (
                  <Connector
                    index={index}
                    from={from}
                    to={to}
                    isAnimating={isAnimating}
                    direction={direction}
                    activeStep={activeStep}
                    onMovingTransitionEnd={shouldCommitOnEnd}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* LABELS */}
        <div className="mt-3 flex">
          {steps.map((step, index) => {
            const isActive = isAnimating
              ? index === from
              : index === activeStep;

            return (
              <div
                key={step.key}
                className="w-8 text-center text-xs font-semibold"
                style={{
                  marginRight:
                    index < steps.length - 1
                      ? `calc(var(--st-connW) + 2 * var(--st-gap))`
                      : undefined,
                }}
              >
                <span
                  className={`transition-colors duration-[var(--st-dotDur)] ${
                    isActive
                      ? "text-[var(--st-brand)]"
                      : "text-[var(--st-labelInactive)]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function Connector({
  index,
  from,
  to,
  isAnimating,
  direction,
  activeStep,
  onMovingTransitionEnd,
}: {
  index: number;
  from: number;
  to: number;
  activeStep: number;
  isAnimating: boolean;
  direction: "forward" | "backward";
  onMovingTransitionEnd: (e: React.TransitionEvent<HTMLDivElement>) => void;
}) {
  // which connector is “moving”?
  const isMoving =
    isAnimating &&
    ((direction === "forward" && index === from) ||
      (direction === "backward" && index === to));

  // connectors that should remain filled while animating
  const stableFilled = isAnimating
    ? direction === "forward"
      ? index < from
      : index < to
    : index < activeStep;

  // final scale for this connector’s fill
  const targetScale = isMoving
    ? direction === "forward"
      ? 1
      : 0
    : stableFilled
      ? 1
      : 0;

  return (
    <div className="mx-[var(--st-gap)]" style={{ width: "var(--st-connW)" }}>
      <div className="relative h-1 overflow-hidden rounded-full bg-[var(--st-track)]">
        <div
          className={[
            "absolute inset-0 rounded-full bg-[var(--st-brand)] origin-left",
            "transition-transform ease-in-out",
            isMoving ? "duration-[var(--st-connDur)]" : "duration-0",
          ].join(" ")}
          style={{ transform: `scaleX(${targetScale})` }}
          onTransitionEnd={isMoving ? onMovingTransitionEnd : undefined}
        />
      </div>
    </div>
  );
}

export default Stepper;
