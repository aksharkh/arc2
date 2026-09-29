"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import { triquetraPoints } from "@/lib/triquetra";

function Knot({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const pts = triquetraPoints(160, 0.34, 0.26).map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    const curve = new THREE.CatmullRomCurve3(pts, true, "centripetal", 0.5);
    return new THREE.TubeGeometry(curve, 900, 0.085, 48, true);
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const s = scrollRef.current ?? 0;
    const { x, y } = state.pointer;
    const t = state.clock.elapsedTime;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, x * 0.45 + Math.sin(t * 0.25) * 0.25 + s * 2.4, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -y * 0.3 + s * 0.6, 3, dt);
    g.rotation.z += dt * 0.06;
    const sc = 1 - s * 0.25;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, sc, 4, dt));
  });

  return (
    <group ref={group}>
      <mesh geometry={geo} castShadow>
        <meshPhysicalMaterial
          color="#e2b865"
          metalness={1}
          roughness={0.17}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.6}
        />
      </mesh>
    </group>
  );
}

function Orb({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  return (
    <Float speed={speed} rotationIntensity={1.2} floatIntensity={1.4}>
      <mesh position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#2f5dff"
          metalness={0.35}
          roughness={0.04}
          clearcoat={1}
          clearcoatRoughness={0}
          iridescence={0.8}
          iridescenceIOR={1.8}
          envMapIntensity={2.4}
          flatShading
        />
      </mesh>
    </Float>
  );
}

function Pearl({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <Float speed={1.4} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial color="#e8c47a" metalness={1} roughness={0.22} envMapIntensity={1.5} />
      </mesh>
    </Float>
  );
}

export default function KnotScene({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.4], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#fff1d6" />
      <directionalLight position={[-4, -2, 2]} intensity={1.4} color="#4d7bff" />
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
        <Knot scrollRef={scrollRef} />
      </Float>
      <Orb position={[-1.55, 0.95, 0.4]} scale={0.14} speed={2} />
      <Orb position={[1.45, -1.05, 0.8]} scale={0.1} speed={2.6} />
      <Orb position={[1.3, 1.25, -0.6]} scale={0.08} speed={1.7} />
      <Pearl position={[0.95, 1.2, 0.5]} scale={0.085} />
      <Pearl position={[-1.25, -1.15, 0.2]} scale={0.055} />
      <Sparkles count={70} scale={[5, 4, 2]} size={2.2} speed={0.25} color="#f3dca0" opacity={0.8} />
      <Environment resolution={256}>
        <color attach="background" args={["#060f26"]} />
        <Lightformer intensity={4} position={[0, 5, -2]} scale={[10, 2, 1]} color="#fff3dd" />
        <Lightformer intensity={2.5} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#3d6dff" />
        <Lightformer intensity={3} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[8, 1.5, 1]} color="#ffe2a8" />
        <Lightformer intensity={1.5} form="ring" position={[0, 0, 6]} scale={4} color="#ffffff" />
        <Lightformer intensity={1.2} position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} color="#1c4bd6" />
      </Environment>
    </Canvas>
  );
}
