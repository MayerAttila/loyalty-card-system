"use client";

import { Canvas } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import PhoneModel from "@/components/PhoneModel";

type PhoneCanvasProps = {
  className?: string;
  modelUrl?: string;
  screenUrl?: string;
};

export default function PhoneCanvas({
  className = "",
  modelUrl = "/models/phone.glb",
  screenUrl = "/what-you-get.png",
}: PhoneCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    const group = groupRef.current;
    if (!wrapper || !group) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    // Presentation defaults: large, front-facing, subtle motion.
    // The model itself is flipped (if needed) in PhoneModel based on the screen normal.
    gsap.set(group.rotation, { x: 0.12, y: -0.22, z: 0 });
    gsap.set(group.scale, { x: 1.55, y: 1.55, z: 1.55 });

    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(group.rotation, {
        x: 0.18,
        y: 0.22,
        z: 0.03,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 80%",
          end: "+=700",
          scrub: true,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className={className}>
      <Canvas
        // Bring the camera closer so the phone reads as a hero object.
        camera={{ position: [0, 0, 0.33], fov: 30, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 2]} intensity={1.35} />
        <directionalLight position={[-2, 1, -1]} intensity={0.5} />

        <group ref={groupRef}>
          <Suspense fallback={null}>
            <Center>
              <PhoneModel modelUrl={modelUrl} screenUrl={screenUrl} />
            </Center>
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}
