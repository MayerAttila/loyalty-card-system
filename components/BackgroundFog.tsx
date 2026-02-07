"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const COLORS = ["#e6345a", "#f15b85", "#d92d57"];

type Blob = {
  x: number;
  y: number;
  r: number;
  color: string;
  opacity: number;
  dir: 1 | -1;
};

type BackgroundFogProps = {
  showBounds?: boolean;
  showScrollPercent?: boolean;
  scrollScale?: number;
  centerGapRatioX?: number;
  centerGapRatioY?: number;
};

const BackgroundFog = ({
  showBounds = false,
  showScrollPercent = false,
  scrollScale = 900,
  centerGapRatioX = 0.75,
  centerGapRatioY = 0.75,
}: BackgroundFogProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollOffsetRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      sizeRef.current = { width, height };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const getSpawnPosition = () => {
      const centerGapX = window.innerWidth * centerGapRatioX;
      const centerGapY = window.innerHeight * centerGapRatioY;
      const centerStartX = (window.innerWidth - centerGapX) / 2;
      const centerEndX = centerStartX + centerGapX;
      const centerStartY = (window.innerHeight - centerGapY) / 2;
      const centerEndY = centerStartY + centerGapY;

      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;
      let guard = 0;
      while (
        x > centerStartX &&
        x < centerEndX &&
        y > centerStartY &&
        y < centerEndY &&
        guard < 20
      ) {
        x = Math.random() * window.innerWidth;
        y = Math.random() * window.innerHeight;
        guard += 1;
      }
      return { x, y };
    };

    const blobs: Blob[] = Array.from({ length: 8 }).map((_, index) => {
      const pos = getSpawnPosition();
      const minViewport = Math.min(window.innerWidth, window.innerHeight);
      return {
        x: pos.x,
        y: pos.y,
        r: minViewport * (0.22 + Math.random() * 0.12),
        color: COLORS[index % COLORS.length],
        opacity: 0.45 + Math.random() * 0.2,
        dir: Math.random() > 0.5 ? 1 : -1,
      };
    });
    const driftRefs = blobs.map(() => ({ x: 0 }));
    const renderRefs = blobs.map((blob) => ({ x: blob.x, y: blob.y }));
    const hitRefs = blobs.map(() => false);
    const dirRefs = blobs.map((blob) => blob.dir);

    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollOffsetRef.current = self.progress * scrollScale;
        scrollProgressRef.current = self.progress;
      },
    });

    let animationFrame = 0;
    const render = () => {
      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const scrollOffset = scrollOffsetRef.current;
      const scrollPercent = Math.round(scrollProgressRef.current * 100);
      const centerGapX = width * centerGapRatioX;
      const centerGapY = height * centerGapRatioY;
      const centerStartX = (width - centerGapX) / 2;
      const centerEndX = centerStartX + centerGapX;
      const centerStartY = (height - centerGapY) / 2;
      const centerEndY = centerStartY + centerGapY;
      const centerX = width / 2;
      const centerY = height / 2;
      const halfGapX = centerGapX / 2;
      const halfGapY = centerGapY / 2;
      const softRadius = 220;

      blobs.forEach((blob, index) => {
        dirRefs[index] += (blob.dir - dirRefs[index]) * 0.05;
        const offset = dirRefs[index] * scrollOffset * 0.35;
        const drift = driftRefs[index];
        const renderPos = renderRefs[index];
        drift.x += (offset - drift.x) * 0.08;
        let x = blob.x + drift.x;
        let y = blob.y + offset * 0.25;
        const relX = x - centerX;
        const relY = y - centerY;
        const dx = Math.abs(relX) - halfGapX;
        const dy = Math.abs(relY) - halfGapY;

        if (dx < softRadius && dy < softRadius) {
          const nx = Math.max(dx, 0);
          const ny = Math.max(dy, 0);
          const dist = Math.hypot(nx, ny);
          const force = dist > 0 ? (softRadius - dist) / softRadius : 1;
          const vx = relX || 1;
          const vy = relY || 1;
          const len = Math.hypot(vx, vy) || 1;
          x += (vx / len) * force * 22;
          y += (vy / len) * force * 22;
        }

        const insideCore =
          Math.abs(relX) < halfGapX && Math.abs(relY) < halfGapY;
        if (insideCore) {
          if (!hitRefs[index]) {
            blob.dir = blob.dir === 1 ? -1 : 1;
            hitRefs[index] = true;
          }
          const penX = halfGapX - Math.abs(relX);
          const penY = halfGapY - Math.abs(relY);
          if (penX < penY) {
            x = centerX + Math.sign(relX || 1) * (halfGapX + 3);
          } else {
            y = centerY + Math.sign(relY || 1) * (halfGapY + 3);
          }
        } else if (hitRefs[index]) {
          hitRefs[index] = false;
        }

        renderPos.x += (x - renderPos.x) * 0.1;
        renderPos.y += (y - renderPos.y) * 0.1;
        x = renderPos.x;
        y = renderPos.y;
        x = Math.max(0, Math.min(width, x));
        y = Math.max(0, Math.min(height, y));

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, blob.r);
        const alpha = Math.round(blob.opacity * 255)
          .toString(16)
          .padStart(2, "0");
        gradient.addColorStop(0, `${blob.color}${alpha}`);
        gradient.addColorStop(1, `${blob.color}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, blob.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";
      if (showScrollPercent) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.font = "700 28px system-ui, -apple-system, Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${scrollPercent}%`, width / 2, height / 2);
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      scrollTrigger.kill();
      window.removeEventListener("resize", resize);
    };
  }, [centerGapRatioX, centerGapRatioY, scrollScale, showScrollPercent]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-primary/45" />
      {showBounds ? (
        <div
          className="pointer-events-none fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 border border-brand/40 bg-brand/5"
          style={{
            width: `${centerGapRatioX * 100}vw`,
            height: `${centerGapRatioY * 100}vh`,
          }}
        />
      ) : null}
    </>
  );
};

export default BackgroundFog;
