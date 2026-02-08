"use client";

/* eslint-disable react-hooks/immutability */
import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";

type PhoneModelProps = {
  modelUrl?: string;
  screenUrl?: string;
};

const SCREEN_HINTS = ["screen", "display", "lcd", "oled", "ui"];

const hasMesh = (root: THREE.Object3D) => {
  let found = false;
  root.traverse((obj) => {
    if (found) return;
    if (obj instanceof THREE.Mesh) found = true;
  });
  return found;
};

const getBboxCenterX = (root: THREE.Object3D) => {
  const box = new THREE.Box3().setFromObject(root);
  const center = new THREE.Vector3();
  box.getCenter(center);
  return center.x;
};

const getFirstMesh = (root: THREE.Object3D) => {
  let found: THREE.Mesh | null = null;
  root.traverse((obj) => {
    if (found) return;
    if (obj instanceof THREE.Mesh) found = obj;
  });
  return found;
};

const guessScreenMesh = (root: THREE.Object3D) => {
  let found: THREE.Mesh | null = null;
  root.traverse((obj) => {
    if (found) return;
    if (!(obj instanceof THREE.Mesh)) return;

    const meshName = obj.name.toLowerCase();
    const materialName = Array.isArray(obj.material)
      ? obj.material.map((m) => (m?.name ?? "").toLowerCase()).join(" ")
      : (obj.material?.name ?? "").toLowerCase();

    const looksLikeScreen = SCREEN_HINTS.some(
      (hint) => meshName.includes(hint) || materialName.includes(hint)
    );
    if (looksLikeScreen) found = obj;
  });
  return found;
};

const getMeshNormalZ = (mesh: THREE.Mesh) => {
  const geom = mesh.geometry;
  const normalAttr = geom.getAttribute("normal");
  if (!normalAttr || normalAttr.count < 1) return null;

  const n = new THREE.Vector3(
    normalAttr.getX(0),
    normalAttr.getY(0),
    normalAttr.getZ(0)
  );
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
  n.applyMatrix3(normalMatrix).normalize();
  return n.z;
};

export default function PhoneModel({
  modelUrl = "/models/phone.glb",
  screenUrl = "/what-you-get.png",
}: PhoneModelProps) {
  const { scene } = useGLTF(modelUrl);
  const screenTex = useTexture(screenUrl);

  const configuredScreenTex = useMemo(() => {
    const tex = screenTex.clone();
    // Keep loader's default orientation for user-provided images.
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [screenTex]);

  useEffect(() => {
    return () => configuredScreenTex.dispose();
  }, [configuredScreenTex]);

  // Avoid mutating the cached GLTF scene directly.
  const phoneScene = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    // Some downloads include multiple color variants laid out side-by-side.
    // Pick the variant closest to x=0, and hide the rest.
    const container =
      phoneScene.children.length === 1 &&
      phoneScene.children[0] &&
      phoneScene.children[0].children.length > 1
        ? phoneScene.children[0]
        : phoneScene;

    const candidates = container.children.filter((c) => hasMesh(c));
    if (candidates.length > 1) {
      let best = candidates[0];
      let bestScore = Math.abs(getBboxCenterX(best));

      for (const c of candidates.slice(1)) {
        const score = Math.abs(getBboxCenterX(c));
        if (score < bestScore) {
          best = c;
          bestScore = score;
        }
      }

      for (const c of candidates) c.visible = c === best;
    }

    // Auto-scale the model so it reads as a hero object (target height in world units).
    const visibleRoot =
      candidates.length > 0 ? candidates.find((c) => c.visible) ?? candidates[0] : container;
    if (visibleRoot) {
      // If the model is facing the wrong way, flip it so the screen faces +Z (camera is at +Z).
      container.rotation.set(0, 0, 0);
      phoneScene.updateMatrixWorld(true);

      const screenMesh = guessScreenMesh(visibleRoot) ?? getFirstMesh(visibleRoot);
      if (screenMesh) {
        const z = getMeshNormalZ(screenMesh);
        if (z !== null && z < 0) {
          container.rotation.y = Math.PI;
          phoneScene.updateMatrixWorld(true);
        }
      }

      const box = new THREE.Box3().setFromObject(visibleRoot);
      const size = new THREE.Vector3();
      box.getSize(size);
      const targetHeight = 2.4;
      if (size.y > 0.0001) {
        const s = targetHeight / size.y;
        container.scale.setScalar(s);
      }
    }

    let applied = false;

    phoneScene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      const meshName = obj.name.toLowerCase();
      const materialName = Array.isArray(obj.material)
        ? obj.material.map((m) => (m?.name ?? "").toLowerCase()).join(" ")
        : (obj.material?.name ?? "").toLowerCase();

      const looksLikeScreen = SCREEN_HINTS.some(
        (hint) => meshName.includes(hint) || materialName.includes(hint)
      );

      if (!looksLikeScreen) return;

      // Match the orientation/UV transform of the original screen texture in the GLB,
      // so custom images don't appear upside down.
      if (!applied) {
        const currentMat = obj.material;
        const currentMap = Array.isArray(currentMat)
          ? (currentMat.find((m) => (m as THREE.MeshStandardMaterial)?.map) as
              | THREE.MeshStandardMaterial
              | undefined)?.map
          : (currentMat as THREE.MeshStandardMaterial | undefined)?.map;

        if (currentMap) {
          // In practice, user-provided PNG/JPGs usually need the opposite flipY
          // compared to glTF-authored textures for this model.
          configuredScreenTex.flipY = !currentMap.flipY;
          configuredScreenTex.rotation = currentMap.rotation;
          configuredScreenTex.center.copy(currentMap.center);
          configuredScreenTex.offset.copy(currentMap.offset);
          configuredScreenTex.repeat.copy(currentMap.repeat);
          configuredScreenTex.wrapS = currentMap.wrapS;
          configuredScreenTex.wrapT = currentMap.wrapT;
          configuredScreenTex.needsUpdate = true;
        }
      }

      obj.material = new THREE.MeshStandardMaterial({
        map: configuredScreenTex,
        emissive: new THREE.Color("white"),
        emissiveMap: configuredScreenTex,
        emissiveIntensity: 0.8,
        metalness: 0.0,
        roughness: 0.35,
      });
      applied = true;
    });

    // If we didn't find a screen mesh/material, we simply render the model as-is.
    // (We can add an overlay plane later if needed for this specific GLB.)
    if (applied) {
      phoneScene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        obj.castShadow = true;
        obj.receiveShadow = true;
      });
    }
  }, [configuredScreenTex, phoneScene]);

  return <primitive object={phoneScene} />;
}

useGLTF.preload("/models/phone.glb");
