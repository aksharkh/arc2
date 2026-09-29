"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { triquetraArcs } from "@/lib/triquetra";

const R = 0.068;
const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** A tube whose radius eases to zero over its last few millimetres, giving rounded ends. */
function roundedTube(curve: THREE.Curve<THREE.Vector3>, T = 480, radial = 48) {
  const geo = new THREE.TubeGeometry(curve, T, R, radial, false);
  const pos = geo.attributes.position;
  const e = (R * 1.1) / curve.getLength();
  const P = new THREE.Vector3();
  const v = new THREE.Vector3();
  for (let i = 0; i <= T; i++) {
    const u = i / T;
    const d = Math.min(u, 1 - u);
    const f = d >= e ? 1 : Math.sqrt(Math.max(0, 1 - (1 - d / e) ** 2));
    if (f === 1) continue;
    curve.getPointAt(u, P);
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, idx).sub(P).multiplyScalar(Math.max(f, 0.02)).add(P);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }
  pos.needsUpdate = true;
  return geo;
}

type Props = {
  progress: RefObject<number>;
  intro: RefObject<number>;
  labels: RefObject<(HTMLDivElement | null)[]>;
};

function Structure({ progress, intro, labels }: Props) {
  const root = useRef<THREE.Group>(null);
  const arcRefs = useRef<(THREE.Group | null)[]>([]);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const arcs = useMemo(
    () =>
      triquetraArcs(160, 0.34, 0.24).map(({ pts, outward }) => {
        const v = pts.map((p) => new THREE.Vector3(...p));
        const curve = new THREE.CatmullRomCurve3(v, false, "centripetal");
        return {
          geo: roundedTube(curve),
          start: v[0],
          end: v[v.length - 1],
          out: new THREE.Vector2(...outward),
          // label pin: out past the gap between this arc's two tips
          anchor: new THREE.Vector3(outward[0] * 1.3, outward[1] * 1.3, 0),
        };
      }),
    [],
  );

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const p = progress.current ?? 0;
    const i = intro.current ?? 0;
    const t = state.clock.elapsedTime;
    const vw = state.viewport.width;
    const vh = state.viewport.height;
    const wide = state.size.width >= 768;

    const split = smooth(0.1, 0.46, p);
    const exit = smooth(0.84, 1, p);

    // idle drift fades out as the structure opens, so the arcs face the viewer
    const idle = 1 - split;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, idle * (Math.sin(t * 0.28) * 0.3 + state.pointer.x * 0.25), 2.5, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, idle * (Math.cos(t * 0.21) * 0.12 - state.pointer.y * 0.15), 2.5, dt);
    g.rotation.z = -0.35 * (1 - i);

    // opened structure spans roughly 3.3 x 3.0 units; keep it inside the frame
    const fit = Math.min((vh * 0.7) / 3, (vw * (wide ? 0.62 : 0.9)) / 3.3);
    const s = fit * (0.86 + 0.14 * i) * THREE.MathUtils.lerp(wide ? 1.25 : 1.1, 1, split);
    g.scale.setScalar(s);
    g.position.x = wide ? THREE.MathUtils.lerp(vw * 0.2, 0, split) : 0;
    g.position.y = wide ? THREE.MathUtils.lerp(vh * 0.06, vh * 0.04, split) : THREE.MathUtils.lerp(vh * 0.16, vh * 0.14, split);

    const dist = split * 0.62 + exit * 3.2;
    arcs.forEach((a, k) => {
      const m = arcRefs.current[k];
      if (!m) return;
      m.position.set(a.out.x * dist, a.out.y * dist, 0);
      m.rotation.z = split * 0.06 * (k - 1) + exit * 0.4 * (k - 1);

      const el = labels.current?.[k];
      if (el) {
        tmp.copy(a.anchor);
        m.localToWorld(tmp);
        tmp.project(state.camera);
        const W = state.size.width;
        const H = state.size.height;
        const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
        const pad = 20;
        const [lo, hi] =
          el.dataset.align === "left"
            ? [pad - 24, W - pad - w - 24]
            : el.dataset.align === "right"
              ? [w + 24 + pad, W - pad]
              : [w / 2 + pad, W - w / 2 - pad];
        const x = Math.min(hi, Math.max(lo, (tmp.x * 0.5 + 0.5) * W));
        const y = Math.min(H - 140, Math.max(90, (-tmp.y * 0.5 + 0.5) * H));
        const show = smooth(0.34, 0.46, p) * (1 - smooth(0.78, 0.86, p));
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        el.style.opacity = show.toFixed(3);
      }
    });
  });

  return (
    <group ref={root}>
      {arcs.map((a, k) => (
        <group
          key={k}
          ref={(el) => {
            arcRefs.current[k] = el;
          }}
        >
          <mesh geometry={a.geo}>
            <Gold />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Gold() {
  return (
    <meshPhysicalMaterial
      color="#c9a266"
      metalness={1}
      roughness={0.26}
      anisotropy={0.5}
      clearcoat={0.4}
      clearcoatRoughness={0.25}
      envMapIntensity={1.15}
    />
  );
}

export default function HeroScene(props: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 30 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      style={{ pointerEvents: "none" }}
    >
      <Structure {...props} />
      <ContactShadows position={[0, -1.6, 0]} opacity={0.2} scale={9} blur={2.8} far={3} resolution={512} color="#3a3128" />
      <Environment resolution={512}>
        <color attach="background" args={["#1b1814"]} />
        <Lightformer intensity={2.6} position={[0, 4, 2]} scale={[8, 3, 1]} color="#fff6e8" />
        <Lightformer intensity={1.4} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2.5, 1]} color="#f4ead8" />
        <Lightformer intensity={0.9} position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[4, 6, 1]} color="#ffffff" />
        <Lightformer intensity={0.6} position={[0, -4, 3]} rotation-x={-Math.PI / 2} scale={[8, 4, 1]} color="#e6ddd0" />
      </Environment>
    </Canvas>
  );
}
