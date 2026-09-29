/**
 * Geometry for the TripleArc mark.
 *
 * The triquetra is drawn as one closed curve made of three circular arcs.
 * Each arc joins two outer tips and bows toward the third, so the arcs
 * cross each other and form the three interlaced leaves.
 */

type Vec2 = [number, number];

const TIP_ANGLES = [90, -30, 210].map((d) => (d * Math.PI) / 180);

function circleThrough(a: Vec2, b: Vec2, c: Vec2) {
  const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
  const a2 = a[0] ** 2 + a[1] ** 2;
  const b2 = b[0] ** 2 + b[1] ** 2;
  const c2 = c[0] ** 2 + c[1] ** 2;
  const x = (a2 * (b[1] - c[1]) + b2 * (c[1] - a[1]) + c2 * (a[1] - b[1])) / d;
  const y = (a2 * (c[0] - b[0]) + b2 * (a[0] - c[0]) + c2 * (b[0] - a[0])) / d;
  return { x, y, r: Math.hypot(a[0] - x, a[1] - y) };
}

/** Samples an arc from `a` to `b` that passes through `via`. */
function sampleArc(a: Vec2, via: Vec2, b: Vec2, steps: number): Vec2[] {
  const { x, y, r } = circleThrough(a, via, b);
  const ang = (p: Vec2) => Math.atan2(p[1] - y, p[0] - x);
  const a0 = ang(a);
  let a1 = ang(b);
  const av = ang(via);
  const norm = (t: number) => ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  // Pick the sweep direction that passes through `via`.
  const ccw = norm(av - a0) < norm(a1 - a0);
  if (ccw) a1 = a0 + norm(a1 - a0);
  else a1 = a0 - norm(a0 - a1);
  const pts: Vec2[] = [];
  for (let i = 0; i < steps; i++) {
    const t = a0 + ((a1 - a0) * i) / steps;
    pts.push([x + r * Math.cos(t), y + r * Math.sin(t)]);
  }
  return pts;
}

/**
 * Returns the closed triquetra loop as [x, y, z] points (y up).
 * `bow` sets how far past the centre each arc bends (0.2–0.45 reads best).
 * z weaves over/under so the crossings alternate like a true knot.
 */
export function triquetraPoints(stepsPerArc = 120, bow = 0.34, weave = 0.22) {
  const tips = TIP_ANGLES.map((t) => [Math.cos(t), Math.sin(t)] as Vec2);
  const out: [number, number, number][] = [];
  const total = stepsPerArc * 3;
  for (let k = 0; k < 3; k++) {
    const a = tips[k];
    const b = tips[(k + 1) % 3];
    const c = tips[(k + 2) % 3];
    const via: Vec2 = [c[0] * bow, c[1] * bow];
    sampleArc(a, via, b, stepsPerArc).forEach((p, i) => {
      const s = (k * stepsPerArc + i) / total;
      out.push([p[0], p[1], weave * Math.sin(6 * Math.PI * s)]);
    });
  }
  return out;
}

/** SVG path for the mark in a viewBox of -1.2 -1.2 2.4 2.4 (y flipped for screen). */
export function triquetraPath(bow = 0.34) {
  const pts = triquetraPoints(60, bow, 0);
  return (
    pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(4)} ${(-p[1]).toFixed(4)}`).join(" ") + " Z"
  );
}
