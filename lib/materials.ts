"use client";

/**
 * Procedural material swatches (lapis, marble, brushed brass), baked once in the
 * browser into JPEG data URLs. They stand in for photography of real surfaces.
 */

import { useEffect, useState } from "react";

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uSeed;
uniform float uKind;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1,0)), c = hash(i + vec2(0,1)), d = hash(i + vec2(1,1));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for(int i = 0; i < 7; i++){ v += a * noise(p); p = r * p * 2.03 + 3.1; a *= 0.5; }
  return v;
}

void main(){
  vec2 p = vUv * vec2(uRes.x / uRes.y, 1.0) * 2.6 + uSeed;
  vec3 col;
  if (uKind < 0.5) {
    // lapis lazuli: dense, sharply mottled ultramarine; calcite clouds; pyrite in veins and grains
    vec2 w = vec2(fbm(p * 0.9), fbm(p * 0.9 + 7.3));
    vec2 w2 = vec2(fbm(p * 3.0 + w * 2.0), fbm(p * 3.0 + w * 2.0 + 5.1));
    float m = fbm(p * 4.0 + w2 * 1.6);
    float ridge = 1.0 - abs(fbm(p * 7.0 + w2 * 2.5) * 2.0 - 1.0);
    col = mix(vec3(0.018, 0.035, 0.16), vec3(0.07, 0.14, 0.52), smoothstep(0.32, 0.6, m));
    col = mix(col, vec3(0.14, 0.25, 0.7), smoothstep(0.6, 0.76, m) * 0.7);
    col *= 0.88;
    col *= 0.8 + 0.35 * pow(ridge, 3.0);
    float cal = smoothstep(0.6, 0.78, fbm(p * 1.8 + w * 2.6 + 11.0));
    col = mix(col, vec3(0.62, 0.66, 0.76), cal * 0.45 * smoothstep(0.3, 0.7, fbm(p * 12.0)));
    // pyrite: thin broken veins plus irregular grains clustered along them
    float vl = abs(fbm(p * 1.6 + w * 1.8 + 21.0) - 0.5);
    float vein = smoothstep(0.008, 0.0, vl) * smoothstep(0.45, 0.7, noise(p * 9.0)) * 0.85;
    float near = smoothstep(0.12, 0.0, vl);
    float grain = smoothstep(0.86, 0.9, noise(p * 70.0 + w2 * 4.0)) * (0.04 + near * 0.9);
    float py = clamp(vein + grain, 0.0, 1.0);
    vec3 pyrite = mix(vec3(0.62, 0.48, 0.22), vec3(0.95, 0.82, 0.5), noise(p * 140.0));
    col = mix(col, pyrite, py);
  } else {
    // honed white marble with soft grey veining
    vec2 w = vec2(fbm(p * 0.9), fbm(p * 0.9 + 4.1));
    float v = fbm(p * 1.3 + w * 2.4);
    float vein = pow(1.0 - abs(sin(p.x * 1.1 + p.y * 0.7 + v * 7.0)), 18.0);
    float vein2 = pow(1.0 - abs(sin(p.x * 2.3 - p.y * 1.4 + v * 11.0)), 40.0);
    col = vec3(0.93, 0.918, 0.892) * (0.95 + 0.07 * fbm(p * 5.0));
    col = mix(col, vec3(0.56, 0.54, 0.51), vein * 0.55 + vein2 * 0.3);
  }
  col += (hash(vUv * uRes + uSeed) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}
`;

function shaderStill(w: number, h: number, kind: number, seed: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) return "";
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(gl.getUniformLocation(prog, "uRes"), w, h);
  gl.uniform1f(gl.getUniformLocation(prog, "uSeed"), seed);
  gl.uniform1f(gl.getUniformLocation(prog, "uKind"), kind);
  gl.viewport(0, 0, w, h);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  const url = canvas.toDataURL("image/jpeg", 0.88);
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return url;
}

function brushedBrass(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const lin = g.createLinearGradient(0, 0, w, h);
  lin.addColorStop(0, "#7d5f31");
  lin.addColorStop(0.28, "#c9a468");
  lin.addColorStop(0.46, "#ead3a0");
  lin.addColorStop(0.62, "#b48f55");
  lin.addColorStop(0.85, "#d8bb82");
  lin.addColorStop(1, "#8a6a39");
  g.fillStyle = lin;
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 5000; i++) {
    const y = Math.random() * h;
    const x = Math.random() * w - w * 0.2;
    const len = w * (0.2 + Math.random() * 0.8);
    g.strokeStyle = Math.random() > 0.5 ? `rgba(255,244,214,${Math.random() * 0.09})` : `rgba(60,40,12,${Math.random() * 0.08})`;
    g.lineWidth = Math.random() * 1.2 + 0.2;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + len, y + (Math.random() - 0.5) * 2);
    g.stroke();
  }
  return c.toDataURL("image/jpeg", 0.88);
}

export type Materials = { lapis: string; lapisWide: string; marble: string; brass: string };

let cache: Materials | null = null;

export function useMaterials() {
  const [m, setM] = useState<Materials | null>(cache);
  useEffect(() => {
    if (cache) return;
    const id = requestAnimationFrame(() => {
      cache = {
        lapis: shaderStill(900, 1100, 0, 3.7),
        lapisWide: shaderStill(2000, 1250, 0, 1.3),
        marble: shaderStill(900, 1100, 1, 5.2),
        brass: brushedBrass(900, 1100),
      };
      setM(cache);
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return m;
}
