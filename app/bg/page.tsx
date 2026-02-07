"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThemeSwitch from "@/components/ThemeSwitch";

const COLORS = ["#e6345a", "#f15b85", "#d92d57"];

type Blob = {
  x: number;
  y: number;
  r: number;
  color: string;
  opacity: number;
  dir: 1 | -1;
};

const SHOW_BOUNDS = true;
const CENTER_GAP_RATIO_X = 0.75;
const CENTER_GAP_RATIO_Y = 0.75;

const BgPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollOffsetRef = useRef(0);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const getSpawnPosition = () => {
      const centerGapX = window.innerWidth * CENTER_GAP_RATIO_X;
      const centerGapY = window.innerHeight * CENTER_GAP_RATIO_Y;
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
      return {
        x: pos.x,
        y: pos.y,
        r: 320 + Math.random() * 240,
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
        scrollOffsetRef.current = self.progress * 900;
        scrollProgressRef.current = self.progress;
      },
    });

    let animationFrame = 0;
    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

        const scrollOffset = scrollOffsetRef.current;
        const scrollPercent = Math.round(scrollProgressRef.current * 100);
      const centerGapX = width * CENTER_GAP_RATIO_X;
      const centerGapY = height * CENTER_GAP_RATIO_Y;
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
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "700 28px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${scrollPercent}%`, width / 2, height / 2);
      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      scrollTrigger.kill();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="min-h-[400vh] text-contrast">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-30 h-full w-full"
      />
      <div className="fixed inset-0 -z-20 bg-primary/45" />
      {SHOW_BOUNDS ? (
        <div
          className="pointer-events-none fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 border border-brand/40 bg-brand/5"
          style={{
            width: `${CENTER_GAP_RATIO_X * 100}vw`,
            height: `${CENTER_GAP_RATIO_Y * 100}vh`,
          }}
        />
      ) : null}
      <div className="fixed right-6 top-6 z-20 flex items-center gap-2 rounded-full border border-accent-3 bg-accent-1/80 px-4 py-2 backdrop-blur">
        <ThemeSwitch
          showLabel={false}
          iconClassName="h-5 w-5 text-contrast"
        />
        <span className="text-xs text-contrast/70">Theme</span>
      </div>
      <div className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-3xl font-semibold text-contrast">Background Demo</h1>
        <p className="mt-4 text-contrast/70">
          Scroll to see the fog move. This page is intentionally tall so you can
          test continuous motion.
        </p>
      </div>
    </main>
  );
};

export default BgPage;
