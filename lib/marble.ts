/**
 * Lapis / agate marble shader: domain-warped fbm mapped to banded sapphire
 * tones, with thin gold veins that glint as the light sweeps across.
 */

export const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }
`;

export const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uSeed;
uniform float uBands;

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
  for(int i = 0; i < 6; i++){ v += a * noise(p); p = r * p * 2.02 + 3.1; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = vUv;
  vec2 st = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 2.2 + uSeed;
  float t = uTime * 0.035;
  st += (uMouse - 0.5) * 0.18;

  vec2 q = vec2(fbm(st + t), fbm(st + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(st + 3.5 * q + vec2(1.7, 9.2) + t * 1.4), fbm(st + 3.5 * q + vec2(8.3, 2.8) - t));
  float f = fbm(st + 3.0 * r);

  // agate banding
  float bands = sin((f * uBands + r.x * 4.0) * 3.14159);
  vec3 deep = vec3(0.012, 0.035, 0.11);
  vec3 royal = vec3(0.06, 0.2, 0.62);
  vec3 sky = vec3(0.45, 0.62, 0.98);
  vec3 col = mix(deep, royal, smoothstep(0.15, 0.85, f));
  col = mix(col, sky, smoothstep(0.55, 1.0, bands) * 0.55 * f);
  col = mix(col, deep, smoothstep(0.2, -0.6, bands) * 0.5);

  // gold veins
  float v = abs(fract(f * 3.0 + q.y * 1.5) - 0.5);
  float vein = smoothstep(0.035, 0.0, v) * smoothstep(0.35, 0.65, r.y);
  float fleck = step(0.985, hash(floor(uv * uRes / 2.0))) * vein;
  float sweep = 0.6 + 0.4 * sin(uTime * 0.5 + uv.x * 3.0 - uv.y * 2.0);
  vec3 gold = mix(vec3(0.62, 0.45, 0.18), vec3(1.0, 0.86, 0.55), sweep);
  col = mix(col, gold, clamp(vein * 0.95 + fleck, 0.0, 1.0));

  // vignette
  float vg = smoothstep(1.25, 0.25, length(uv - 0.5) * 1.4);
  col *= mix(0.55, 1.05, vg);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function createProgram(gl: WebGLRenderingContext) {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  return {
    time: u("uTime"),
    res: u("uRes"),
    mouse: u("uMouse"),
    seed: u("uSeed"),
    bands: u("uBands"),
  };
}

/** Renders a still frame of the marble once and returns it as a data URL. */
export function renderMarbleStill(w: number, h: number, seed: number, bands = 7) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) return null;
  const u = createProgram(gl);
  gl.viewport(0, 0, w, h);
  gl.uniform1f(u.time, seed * 10);
  gl.uniform2f(u.res, w, h);
  gl.uniform2f(u.mouse, 0.5, 0.5);
  gl.uniform1f(u.seed, seed);
  gl.uniform1f(u.bands, bands);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  const url = canvas.toDataURL("image/jpeg", 0.9);
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return url;
}
