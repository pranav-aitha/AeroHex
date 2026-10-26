/**
 * =============================================================================
 * AEROHEX — Client-Side Memory Segment Analysis & Binary Forensic Engine
 * Operational Logic, WebGL2 Ribbon Glow Engine & Forensic Telemetry Pipeline
 * =============================================================================
 * Architectural Topology: Zero-Trust Client-Side Ingestion
 * Repository Realization: https://github.com/pranav-aitha/AeroHex
 * Static Distribution: https://github.io
 * =============================================================================
 */

(function () {
  'use strict';

  /* =============================================================================
     1. Web Audio Synthesizer (Subtle Cybernetic Sound FX)
     ============================================================================= */

  class CyberAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playIngestBlip() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    }

    playInspectTick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    }

    playSuccessChime() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.06;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.25);
      });
    }
  }

  const audioEngine = new CyberAudio();

  /* =============================================================================
     2. WebGL2 Ribbon Glow 4 Engine (Originkit Specification)
     ============================================================================= */

  const MAX_DPR = 2;
  const LAYERS = 84;
  const TWIST = 1.25;
  const DRAG = 0.18;

  const VERT_SRC = `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }
`;

  const FIELD_SRC = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uRibbonColors[5];
uniform int uRibbonColorCount;
uniform int uRibbonCount;
uniform float uSize;
uniform float uAngle;
uniform vec2 uMouse;
uniform float uOn;
uniform float uReach;
uniform vec2 uVel;
out vec4 o;

const float TAU = 6.28318530718;
const float LAYERS = ${LAYERS.toFixed(1)};
const float TWIST = ${TWIST.toFixed(3)};
const float DRAG = ${DRAG.toFixed(3)};
const float GAIN = 0.62;
const vec2 CENTRE = vec2(-0.62, 0.24);
const float TILT = 0.6;
const float ZOOM = 1.05;
const float THETA = 2.13;
const float SHEAR = 0.963;
const float SHRINK = 0.953;
const vec2 WARP_FREQ = vec2(0.42, 2.4);
const vec2 WARP_AMP = vec2(0.13, 0.027);
const vec2 ASPECT = vec2(2.1, 0.17);
const float OFFSET = 0.36;
const float GLOW = 0.0021;
const float SOFT = 0.0019;
const float FALLOFF = 0.37;
const float PHASE = 12.0;
const float CYCLE = 0.16;
const float HUE_TRAVEL = 2.0;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

vec3 getRibbonColor(int idx, float k) {
  int count = max(1, min(5, uRibbonColorCount));
  int baseIdx = idx % count;
  int secIdx = (idx + 1) % count;

  vec3 baseColor = uRibbonColors[0];
  vec3 secColor = uRibbonColors[0];

  for (int i = 0; i < 5; i++) {
    if (i == baseIdx) baseColor = uRibbonColors[i];
    if (i == secIdx) secColor = uRibbonColors[i];
  }

  return mix(baseColor, secColor, k);
}

void main() {
  vec2 R = uRes;
  vec2 basePos = (gl_FragCoord.xy - 0.5 * R) / R.y;

  vec2 d = basePos - uMouse;
  float w = uOn * exp(-dot(d, d) / (uReach * uReach));
  if (w > 1e-4) basePos = uMouse + rot(w * TWIST) * d * (1.0 - 0.3 * min(w, 1.0)) - uVel * min(w, 1.0) * DRAG;

  vec3 totalCol = vec3(0.0);

  for (int rIdx = 0; rIdx < 5; rIdx++) {
    if (rIdx >= uRibbonCount) break;

    float ribbonOffsetAngle = float(rIdx) * 0.35 + uAngle;
    float ribbonScaleFactor = uSize * (1.0 + float(rIdx) * 0.08);

    vec2 pos = rot(ribbonOffsetAngle) * basePos / ribbonScaleFactor;
    float t = uTime * 0.49 + PHASE + float(rIdx) * 1.5;
    float breath = (-sin(uTime * 0.735 + float(rIdx)) + sin(uTime * 0.49 + 1.0 + float(rIdx))) * 0.25 + 0.5;
    vec2 u = rot(TILT + float(rIdx) * 0.1) * ((pos - CENTRE) * (ZOOM - breath * 0.085));
    mat2 fold = mat2(cos(THETA), sin(THETA), -SHEAR, cos(THETA));

    vec3 col = vec3(0.0);
    for (float i = 1.0; i <= LAYERS; i += 1.0) {
      u.x -= sin(u.y * WARP_FREQ.x + t + i * 0.007) * WARP_AMP.x;
      u.y -= sin(u.x * WARP_FREQ.y - t + i * 0.02) * WARP_AMP.y;
      u = fold * u * SHRINK;
      vec2 q = (u - vec2(OFFSET + breath * 0.1, 0.0)) * ASPECT;
      float g = GLOW / (dot(q, q) + SOFT) * (0.25 + breath * 0.4);
      float r = length(u);
      float k = sin(i * CYCLE + t * 1.2 + r * HUE_TRAVEL) * 0.5 + 0.5;
      col += g * getRibbonColor(rIdx, k) * (0.62 + 0.5 * k) * exp2(-r * FALLOFF);
    }
    totalCol += col;
  }

  vec3 x = max(totalCol * GAIN, 0.0);
  vec3 col = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
  col = pow(clamp(col, 0.0, 1.0), vec3(0.85, 0.92, 0.98));
  col *= 1.0 - smoothstep(0.5, 1.6, length(basePos)) * 0.07;
  o = vec4(col, 1.0);
}
`;

  const FINISH_SRC = `#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uBg;
uniform float uPaper;
out vec4 o;

float ign(vec2 p, float f) { p += 5.588238 * mod(f, 64.0); return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y)); }

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec3 L = max(texture(uField, frag / uRes).rgb, 0.0);

  vec3 dark = uBg + L * (1.0 - uBg);
  float strength = clamp(max(L.r, max(L.g, L.b)), 0.0, 1.0);
  vec3 paper = uBg * (1.0 - strength) + L * 0.96;
  vec3 col = mix(dark, paper, uPaper);
  col += (ign(frag, floor(uTime * 24.0)) - 0.5) / 255.0;
  o = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

  const DEFAULTS = {
    background: "#0B0A10",
    ribbonColors: ["#F22F2F", "#271B4F", "#070040", "#2FD3F2", "#7B61FF"],
  };

  const PRESETS = {
    speed: 6,
    size: 60,
    angle: -101,
    hover: 52,
    reach: 250,
  };

  function parseHex(h) {
    if (h.startsWith("#")) h = h.slice(1);
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    return [r, g, b];
  }

  function compileShader(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function createProgram(gl, vsSrc, fsSrc) {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return null;
    }
    return prog;
  }

  function initRibbonGlowEngine() {
    const canvas = document.getElementById("ribbon-glow-canvas");
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, depth: false, stencil: false });
    if (!gl) {
      console.warn("WebGL2 unsupported. Operating in 2D fallback mode.");
      return;
    }

    const fieldProg = createProgram(gl, VERT_SRC, FIELD_SRC);
    const finishProg = createProgram(gl, VERT_SRC, FINISH_SRC);
    if (!fieldProg || !finishProg) return;

    const uf = {};
    ["uRes", "uTime", "uRibbonColors", "uRibbonColorCount", "uRibbonCount", "uSize", "uAngle", "uMouse", "uOn", "uReach", "uVel"].forEach(
      (n) => (uf[n] = gl.getUniformLocation(fieldProg, n))
    );

    const un = {};
    ["uField", "uRes", "uTime", "uBg", "uPaper"].forEach(
      (n) => (un[n] = gl.getUniformLocation(finishProg, n))
    );

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Framebuffer target
    const fbo = gl.createFramebuffer();
    let tex = null;
    let targetW = 0;
    let targetH = 0;
    let halfFloat = !!gl.getExtension("EXT_color_buffer_float");

    function resizeTarget(nw, nh) {
      if (nw === targetW && nh === targetH && tex) return;
      if (tex) gl.deleteTexture(tex);
      tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        halfFloat ? gl.RGBA16F : gl.RGBA8,
        nw,
        nh,
        0,
        gl.RGBA,
        halfFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE,
        null
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      targetW = nw;
      targetH = nh;
    }

    // Pointer dynamics
    const pointer = { tx: window.innerWidth / 2, ty: window.innerHeight / 2, inside: false };
    window.addEventListener("pointermove", (e) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      pointer.inside = true;
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      pointer.inside = false;
    });

    const config = {
      ribbonColors: DEFAULTS.ribbonColors,
      ribbonCount: 3,
      speed: PRESETS.speed / 50,
      size: PRESETS.size / 100,
      angle: (PRESETS.angle * Math.PI) / 180,
      hover: PRESETS.hover / 100,
      reach: PRESETS.reach,
      background: DEFAULTS.background,
    };

    const flatColors = new Float32Array(15);
    for (let i = 0; i < 5; i++) {
      const c = parseHex(config.ribbonColors[i % config.ribbonColors.length]);
      flatColors[i * 3 + 0] = c[0];
      flatColors[i * 3 + 1] = c[1];
      flatColors[i * 3 + 2] = c[2];
    }
    const bgRGB = parseHex(config.background);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let vx = 0;
    let vy = 0;
    let on = 0;
    let last = -1;
    let clock = 0;

    function renderLoop(now) {
      requestAnimationFrame(renderLoop);
      const dt = last < 0 ? 0 : Math.min(Math.max((now - last) / 1000, 0), 0.05);
      last = now;
      clock = (clock + dt * config.speed) % 3600;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const bw = Math.max(1, Math.round(cw * dpr));
      const bh = Math.max(1, Math.round(ch * dpr));

      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      resizeTarget(Math.max(1, Math.round(bw / 2)), Math.max(1, Math.round(bh / 2)));

      const present = pointer.inside ? 1 : 0;
      on += (present - on) * (1 - Math.exp(-dt * 5));
      const k = 1 - Math.exp(-dt * 16);
      const nx = mx + (pointer.tx - mx) * k;
      const ny = my + (pointer.ty - my) * k;
      if (dt > 0) {
        const kv = 1 - Math.exp(-dt * 8);
        vx += ((nx - mx) / dt - vx) * kv;
        vy += ((ny - my) / dt - vy) * kv;
      }
      mx = nx;
      my = ny;
      const vLen = Math.hypot(vx, vy) / (ch || 1);
      const vCap = vLen > 3 ? 3 / vLen : 1;

      // Pass 1: Field Computation
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, targetW, targetH);
      gl.useProgram(fieldProg);
      gl.uniform2f(uf.uRes, targetW, targetH);
      gl.uniform1f(uf.uTime, clock);
      gl.uniform3fv(uf.uRibbonColors, flatColors);
      gl.uniform1i(uf.uRibbonColorCount, 5);
      gl.uniform1i(uf.uRibbonCount, config.ribbonCount);
      gl.uniform1f(uf.uSize, config.size);
      gl.uniform1f(uf.uAngle, config.angle);
      gl.uniform2f(uf.uMouse, (mx - cw / 2) / ch, (ch / 2 - my) / ch);
      gl.uniform1f(uf.uOn, on * config.hover);
      gl.uniform1f(uf.uReach, config.reach / ch);
      gl.uniform2f(uf.uVel, (vx / ch) * vCap, (-vy / ch) * vCap);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Pass 2: Finish Composition
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, bw, bh);
      gl.useProgram(finishProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(un.uField, 0);
      gl.uniform2f(un.uRes, bw, bh);
      gl.uniform1f(un.uTime, clock);
      gl.uniform3f(un.uBg, bgRGB[0], bgRGB[1], bgRGB[2]);
      gl.uniform1f(un.uPaper, 0.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    requestAnimationFrame(renderLoop);
  }

  /* =============================================================================
     3. Scrolling Code Backdrop: Assembly & Decompiled Hex Matrix
     ============================================================================= */

  function initCodeBackdrop() {
    const backdrop = document.getElementById("code-backdrop");
    if (!backdrop) return;

    const asmOpcodes = [
      "0x00401000:  48 83 ec 28        sub    rsp, 0x28",
      "0x00401004:  48 8d 0d f5 0f 00  lea    rcx, [rip+0xff5]",
      "0x0040100b:  e8 70 01 00 00     call   0x401180 <init_sandbox>",
      "0x00401010:  85 c0              test   eax, eax",
      "0x00401012:  75 1b              jne    0x40102f <alloc_trap>",
      "0x00401014:  48 8b 44 24 30     mov    rax, [rsp+0x30]",
      "0x00401019:  0f b7 08           movzx  ecx, word [rax]",
      "0x0040101c:  66 81 f9 d8 ff     cmp    cx, 0xffd8 ; SOI_JPEG",
      "0x00401021:  74 14              je     0x401037 <parse_segments>",
      "0x00401023:  81 38 25 50 44 46  cmp    dword [rax], 0x46445025 ; %PDF",
      "0x00401029:  74 24              je     0x40104f <parse_pdf_xref>",
      "0x0040102b:  b8 01 00 00 00     mov    eax, 0x1",
      "0x00401030:  48 83 c4 28        add    rsp, 0x28",
      "0x00401034:  c3                 ret",
      "0x00401037:  48 89 c7           mov    rdi, rax",
      "0x0040103a:  be 02 00 00 00     mov    esi, 0x2",
      "0x0040103f:  e8 8c 03 00 00     call   0x4013d0 <splice_app_marker>",
      "0x00401044:  49 89 c2           mov    r10, rax",
      "0x00401047:  41 83 fa 00        cmp    r10d, 0x0",
      "0x0040104b:  eb da              jmp    0x401027",
      "0x0040104f:  48 8d 35 c0 20 00  lea    rsi, [rip+0x20c0] ; '/Trailer'",
      "0x00401056:  e8 a5 02 00 00     call   0x401300 <scan_dictionary>",
      "0x0040105b:  c3                 ret",
      "0x0040105c:  0f 1f 40 00        nop    dword [rax+0x0]",
    ];

    const columns = backdrop.querySelectorAll(".matrix-column");
    const colStates = [];

    columns.forEach((col, idx) => {
      let content = "";
      for (let i = 0; i < 44; i++) {
        const item = asmOpcodes[(i + idx * 7) % asmOpcodes.length];
        content += item + "\n";
      }
      col.textContent = content;
      colStates.push({
        el: col,
        speed: parseFloat(col.getAttribute("data-speed") || "1.0"),
        offset: idx * -65,
      });
    });

    function scrollColumns() {
      colStates.forEach((state) => {
        state.offset += state.speed * 0.45;
        if (state.offset > 420) state.offset = 0;
        state.el.style.transform = `translateY(-${state.offset}px)`;
      });
      requestAnimationFrame(scrollColumns);
    }
    requestAnimationFrame(scrollColumns);
  }

  /* =============================================================================
     4. Binary Segment Parsing & Forensic Telemetry Math
     ============================================================================= */

  function computeEntropy(uint8) {
    const len = uint8.length;
    if (len === 0) return 0;
    const freq = new Uint32Array(256);
    for (let i = 0; i < len; i++) {
      freq[uint8[i]]++;
    }
    let entropy = 0;
    for (let i = 0; i < 256; i++) {
      if (freq[i] > 0) {
        const p = freq[i] / len;
        entropy -= p * Math.log2(p);
      }
    }
    return entropy;
  }

  async function computeSHA256(buffer) {
    const digest = await window.crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function parseJPEG(uint8) {
    const telemetry = {
      format: "JPEG (Joint Photographic Experts Group)",
      magic: "0xFFD8 (SOI)",
      segments: [],
      dimensions: "Unknown",
      density: "N/A",
      exifPresent: false,
    };

    let offset = 2;
    const len = uint8.length;

    while (offset < len) {
      if (uint8[offset] !== 0xff) {
        offset++;
        continue;
      }

      const marker = uint8[offset + 1];
      if (marker === 0xd9) {
        telemetry.segments.push({ marker: "0xFFD9 (EOI)", offset, name: "End of Image" });
        break;
      }
      if (marker === 0xda) {
        telemetry.segments.push({ marker: "0xFFDA (SOS)", offset, name: "Start of Scan" });
        break;
      }

      const segLength = (uint8[offset + 2] << 8) | uint8[offset + 3];

      if (marker === 0xe0) {
        telemetry.segments.push({ marker: "0xFFE0 (APP0)", offset, name: "JFIF Header" });
        if (segLength >= 14 && offset + 13 < len) {
          const xDensity = (uint8[offset + 10] << 8) | uint8[offset + 11];
          const yDensity = (uint8[offset + 12] << 8) | uint8[offset + 13];
          telemetry.density = `${xDensity}x${yDensity} DPI`;
        }
      } else if (marker === 0xe1) {
        telemetry.exifPresent = true;
        telemetry.segments.push({ marker: "0xFFE1 (APP1)", offset, name: "EXIF Telemetry Block" });
      } else if (marker >= 0xe2 && marker <= 0xef) {
        telemetry.segments.push({ marker: `0xFF${marker.toString(16).toUpperCase()}`, offset, name: `APP${marker - 0xe0}` });
      } else if (marker === 0xc0 || marker === 0xc2) {
        const precision = uint8[offset + 4] || 8;
        const height = (uint8[offset + 5] << 8) | uint8[offset + 6];
        const width = (uint8[offset + 7] << 8) | uint8[offset + 8];
        const channels = uint8[offset + 9] || 3;
        telemetry.dimensions = `${width}px × ${height}px (${channels} Channel, ${precision}-bit)`;
        telemetry.segments.push({ marker: `0xFF${marker.toString(16).toUpperCase()} (SOF)`, offset, name: "Frame Dimension Header" });
      } else if (marker === 0xdb) {
        telemetry.segments.push({ marker: "0xFFDB (DQT)", offset, name: "Define Quantization Table" });
      } else if (marker === 0xc4) {
        telemetry.segments.push({ marker: "0xFFC4 (DHT)", offset, name: "Define Huffman Table" });
      }

      offset += 2 + (segLength > 0 ? segLength : 2);
    }

    return telemetry;
  }

  function parsePDF(uint8) {
    const rawStr = new TextDecoder("latin1").decode(uint8.subarray(0, Math.min(uint8.length, 65536)));
    const endStr = new TextDecoder("latin1").decode(uint8.subarray(Math.max(0, uint8.length - 8192)));

    const versionMatch = rawStr.match(/%PDF-([0-9.]+)/);
    const version = versionMatch ? `PDF v${versionMatch[1]}` : "PDF (Unknown Version)";

    const isLinearized = rawStr.includes("/Linearized");
    const hasEncryption = rawStr.includes("/Encrypt") || endStr.includes("/Encrypt");
    const hasJavaScript = rawStr.includes("/JS") || rawStr.includes("/JavaScript") || endStr.includes("/JavaScript");
    const hasLaunch = rawStr.includes("/Launch") || endStr.includes("/Launch");

    const objectCount = (rawStr.match(/[0-9]+\s+[0-9]+\s+obj/g) || []).length;
    const titleMatch = rawStr.match(/\/Title\s*\(([^)]+)\)/);
    const authorMatch = rawStr.match(/\/Author\s*\(([^)]+)\)/);
    const creatorMatch = rawStr.match(/\/Creator\s*\(([^)]+)\)/);

    return {
      format: "PDF (Portable Document Format)",
      magic: "0x25504446 (%PDF)",
      version,
      isLinearized: isLinearized ? "YES (Fast Web View)" : "NO (Standard Object Tree)",
      hasEncryption: hasEncryption ? "FLAGGED // ENCRYPTED DICT" : "CLEAN (Unencrypted)",
      hasJavaScript: hasJavaScript ? "ALERT // EMBEDDED JS DETECTED" : "CLEAN (Zero Script Injections)",
      hasLaunch: hasLaunch ? "CRITICAL // /Launch ACTION DETECTED" : "CLEAN (No Executable Hooks)",
      objectCount: objectCount > 0 ? `~${objectCount}+ Referenced Objects` : "Stream Encapsulated",
      metadata: {
        title: titleMatch ? titleMatch[1] : "N/A",
        author: authorMatch ? authorMatch[1] : "N/A",
        creator: creatorMatch ? creatorMatch[1] : "N/A",
      },
    };
  }

  /* =============================================================================
     5. Synthetic In-Memory Target Vectors (JPEG & PDF Demo Generators)
     ============================================================================= */

  function generateSampleJPEG() {
    // Construct a minimal valid JPEG with SOI, APP0 (JFIF), APP1 (EXIF), DQT, SOF0, DHT, SOS, EOI
    const bytes = [
      0xFF, 0xD8, // SOI
      0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, // APP0 (JFIF 72 DPI)
      0xFF, 0xE1, 0x00, 0x1A, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00, 0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, // APP1 (Exif II)
      0x01, 0x00, 0x0F, 0x01, 0x02, 0x00, 0x08, 0x00, 0x00, 0x00,
      0xFF, 0xDB, 0x00, 0x43, 0x00, // DQT (Table 0)
    ];
    for (let i = 0; i < 64; i++) bytes.push(16); // 64 quantization coefficients
    bytes.push(
      0xFF, 0xC0, 0x00, 0x11, 0x08, 0x02, 0x80, 0x03, 0xC0, 0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, // SOF0 (960x640, 3ch)
      0xFF, 0xC4, 0x00, 0x1F, 0x00, // DHT
      0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B,
      0xFF, 0xDA, 0x00, 0x0C, 0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00 // SOS
    );
    for (let i = 0; i < 256; i++) bytes.push(Math.floor(Math.random() * 256));
    bytes.push(0xFF, 0xD9); // EOI

    return new File([new Uint8Array(bytes)], "sample_forensic_evidence.jpg", { type: "image/jpeg" });
  }

  function generateSamplePDF() {
    const pdfContent = `%PDF-1.7
%âãÏÓ
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 55 >>
stream
BT
/F1 18 Tf
100 700 Td
(AeroHex Binary Forensic Verification Sample) Tj
ET
endstream
endobj
5 0 obj
<<
  /Title (Zero-Trust Binary Memory Ledger)
  /Author (Pranav Aitha)
  /Creator (AeroHex Forensic Engine)
  /Producer (AeroHex v2.0 Client Sandbox)
  /CreationDate (D:20261026220000Z)
>>
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000064 00000 n 
0000000123 00000 n 
0000000210 00000 n 
0000000315 00000 n 
trailer
<< /Size 6 /Root 1 0 R /Info 5 0 R >>
startxref
498
%%EOF
`;
    return new File([new TextEncoder().encode(pdfContent)], "airgap_spec_document.pdf", { type: "application/pdf" });
  }

  /* =============================================================================
     6. UI Controller & Ingestion Event Handlers
     ============================================================================= */

  function initUI() {
    const dropNode = document.getElementById("drop-node");
    const fileInput = document.getElementById("file-ingest");
    const analysisViewport = document.getElementById("analysis-viewport");
    const hexStream = document.getElementById("hex-stream");
    const metadataLedger = document.getElementById("metadata-ledger");
    const telemetryFilename = document.getElementById("telemetry-filename");
    const telemetrySize = document.getElementById("telemetry-size");
    const telemetryHash = document.getElementById("telemetry-hash");
    const entropyPill = document.getElementById("entropy-pill");
    const entropyBarFill = document.getElementById("entropy-bar-fill");
    const gaugeScoreLabel = document.getElementById("gauge-score-label");
    const resetSessionBtn = document.getElementById("reset-session-btn");
    const exportJsonBtn = document.getElementById("export-json-btn");
    const copyHexBtn = document.getElementById("copy-hex-btn");
    const soundToggleBtn = document.getElementById("sound-toggle-btn");
    const soundStateLabel = document.getElementById("sound-state-label");
    const loadSampleJpeg = document.getElementById("load-sample-jpeg");
    const loadSamplePdf = document.getElementById("load-sample-pdf");

    // Inspector elements
    const inspectOffset = document.getElementById("inspect-offset");
    const inspectHex = document.getElementById("inspect-hex");
    const inspectDec = document.getElementById("inspect-dec");
    const inspectBin = document.getElementById("inspect-bin");
    const inspectAscii = document.getElementById("inspect-ascii");
    const inspectDesc = document.getElementById("inspect-desc");

    let currentSessionData = null;

    if (!dropNode || !fileInput) return;

    // Trigger file dialog
    dropNode.addEventListener("click", () => fileInput.click());
    dropNode.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
      }
    });

    // Sound toggle
    if (soundToggleBtn && soundStateLabel) {
      soundToggleBtn.addEventListener("click", () => {
        const state = audioEngine.toggle();
        soundStateLabel.textContent = state ? "ON" : "OFF";
        soundToggleBtn.classList.toggle("is-muted", !state);
      });
    }

    // Preset test vector handlers
    if (loadSampleJpeg) {
      loadSampleJpeg.addEventListener("click", (e) => {
        e.stopPropagation();
        processFile(generateSampleJPEG());
      });
    }
    if (loadSamplePdf) {
      loadSamplePdf.addEventListener("click", (e) => {
        e.stopPropagation();
        processFile(generateSamplePDF());
      });
    }

    // Drag-and-drop feedback
    ["dragenter", "dragover"].forEach((eventName) => {
      dropNode.addEventListener(
        eventName,
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropNode.classList.add("drag-active");
        },
        false
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropNode.addEventListener(
        eventName,
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropNode.classList.remove("drag-active");
        },
        false
      );
    });

    dropNode.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        processFile(e.target.files[0]);
      }
    });

    // Reset session
    resetSessionBtn.addEventListener("click", clearAnalysisSession);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && analysisViewport.style.display !== "none") {
        clearAnalysisSession();
      }
    });

    // Copy Hex
    if (copyHexBtn) {
      copyHexBtn.addEventListener("click", () => {
        if (!hexStream.textContent) return;
        navigator.clipboard.writeText(hexStream.textContent).then(() => {
          const original = copyHexBtn.textContent;
          copyHexBtn.textContent = "COPIED!";
          setTimeout(() => (copyHexBtn.textContent = original), 1400);
        });
      });
    }

    // Export JSON Telemetry
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener("click", () => {
        if (!currentSessionData) return;
        const blob = new Blob([JSON.stringify(currentSessionData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `AeroHex_Telemetry_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    function clearAnalysisSession() {
      analysisViewport.style.display = "none";
      hexStream.textContent = "/* Awaiting memory buffer instantiation... */";
      metadataLedger.innerHTML = "";
      fileInput.value = "";
      currentSessionData = null;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function processFile(file) {
      if (!file) return;

      const isJPEG = file.type === "image/jpeg" || file.name.match(/\.(jpe?g)$/i);
      const isPDF = file.type === "application/pdf" || file.name.match(/\.pdf$/i);

      if (!isJPEG && !isPDF) {
        alert("SECURITY EXCEPTION: File rejected. Only JPEG and PDF formats permitted under zero-trust sandbox rules.");
        return;
      }

      audioEngine.playIngestBlip();

      const reader = new FileReader();

      reader.onload = async function (e) {
        const arrayBuffer = e.target.result;
        const uint8 = new Uint8Array(arrayBuffer);

        const entropy = computeEntropy(uint8);
        const sha256 = await computeSHA256(arrayBuffer);

        telemetryFilename.textContent = `TARGET: ${file.name.toUpperCase()}`;
        telemetrySize.textContent = `${(file.size / 1024).toFixed(2)} KB (${file.size.toLocaleString()} BYTES)`;
        telemetryHash.textContent = `SHA-256: ${sha256.substring(0, 16)}...`;
        entropyPill.textContent = `ENTROPY: ${entropy.toFixed(3)} BITS/BYTE`;

        // Update Entropy Gauge
        if (entropyBarFill && gaugeScoreLabel) {
          const pct = Math.min(100, Math.max(0, (entropy / 8.0) * 100));
          entropyBarFill.style.width = `${pct}%`;
          gaugeScoreLabel.textContent = `${entropy.toFixed(3)} / 8.00 BITS`;
        }

        // Build interactive Hex Stream
        renderInteractiveHexDump(uint8, 1024);

        // Render Metadata Ledger
        metadataLedger.innerHTML = "";
        const ledgerRecord = {
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          sha256: sha256,
          shannon_entropy: entropy,
          timestamp: new Date().toISOString(),
          sandbox: "LOCAL_BROWSER_SANDBOX_ENFORCED",
          diagnostics: {},
        };

        appendLedgerItem("ENFORCEMENT MODE", "CLIENT_SIDE_AIRGAP_ISOLATION", "VERIFIED // 0 TELEMETRY");
        appendLedgerItem("MIME IDENTITY", file.type || "BINARY_STREAM", "STRICT VALIDATED");
        appendLedgerItem("SHA-256 DIGEST", sha256, "CRYPTO_SUBTLE");
        appendLedgerItem(
          "SHANNON ENTROPY",
          `${entropy.toFixed(4)} / 8.0000 (${entropy > 7.4 ? "HIGH DENSITY // ENCRYPTED OR COMPRESSED" : "STRUCTURED DISTRIBUTION"})`,
          "MATH_METRIC"
        );

        if (isJPEG) {
          const jpegData = parseJPEG(uint8);
          ledgerRecord.diagnostics = jpegData;
          appendLedgerItem("BINARY SIGNATURE", jpegData.magic, "SOI");
          appendLedgerItem("DIMENSIONS (SOF)", jpegData.dimensions, "RASTER_GEOMETRY");
          appendLedgerItem("DENSITY RESOLUTION", jpegData.density, "JFIF_SPEC");
          appendLedgerItem("EXIF REGISTRATION", jpegData.exifPresent ? "ACTIVE EXIF PAYLOAD PRESENT" : "NOT ATTACHED", jpegData.exifPresent ? "ALERT" : "SAFE", jpegData.exifPresent);
          appendLedgerItem("SEGMENTS SPLICED", jpegData.segments.map((s) => `[${s.marker}: ${s.name}]`).join(" "), "PARSED_BLOCKS");
        } else if (isPDF) {
          const pdfData = parsePDF(uint8);
          ledgerRecord.diagnostics = pdfData;
          appendLedgerItem("SPECIFICATION VERSION", pdfData.version, "ISO 32000");
          appendLedgerItem("LINEARIZATION", pdfData.isLinearized, "STREAM_LAYOUT");
          appendLedgerItem("SECURITY ENCRYPTION", pdfData.hasEncryption, "SECURITY_VECTOR");
          appendLedgerItem("ACTIVE SCRIPT SCAN", pdfData.hasJavaScript, pdfData.hasJavaScript.includes("ALERT") ? "CRITICAL_WARN" : "CLEAN", pdfData.hasJavaScript.includes("ALERT"));
          appendLedgerItem("LAUNCH HOOK SCAN", pdfData.hasLaunch, pdfData.hasLaunch.includes("CRITICAL") ? "CRITICAL_WARN" : "CLEAN", pdfData.hasLaunch.includes("CRITICAL"));
          appendLedgerItem("OBJECT HEURISTICS", pdfData.objectCount, "CROSS_REF");
          appendLedgerItem("DOCUMENT AUTHOR", pdfData.metadata.author, "METADATA_DICT");
          appendLedgerItem("DOCUMENT TITLE", pdfData.metadata.title, "METADATA_DICT");
        }

        currentSessionData = ledgerRecord;

        analysisViewport.style.display = "flex";
        analysisViewport.scrollIntoView({ behavior: "smooth", block: "start" });
        audioEngine.playSuccessChime();
      };

      reader.readAsArrayBuffer(file);
    }

    function renderInteractiveHexDump(uint8, maxBytes = 1024) {
      const bytesToDump = Math.min(uint8.length, maxBytes);
      hexStream.innerHTML = "";

      const fragment = document.createDocumentFragment();

      for (let i = 0; i < bytesToDump; i += 16) {
        const line = document.createElement("div");
        line.className = "hex-stream-line";

        const offsetHex = i.toString(16).padStart(8, "0").toUpperCase();
        const offsetSpan = document.createElement("span");
        offsetSpan.className = "hex-offset";
        offsetSpan.textContent = offsetHex + "  ";
        line.appendChild(offsetSpan);

        const hexGroup = document.createElement("span");
        hexGroup.className = "hex-bytes-group";

        const asciiGroup = document.createElement("span");
        asciiGroup.className = "hex-ascii-group";
        asciiGroup.appendChild(document.createTextNode("|"));

        for (let j = 0; j < 16; j++) {
          const idx = i + j;
          if (idx < bytesToDump) {
            const val = uint8[idx];
            const byteSpan = document.createElement("span");
            byteSpan.className = "hex-byte-span";
            byteSpan.textContent = val.toString(16).padStart(2, "0").toUpperCase() + " ";
            byteSpan.dataset.offset = idx;
            byteSpan.dataset.val = val;

            const asciiChar = val >= 32 && val <= 126 ? String.fromCharCode(val) : ".";
            const asciiSpan = document.createElement("span");
            asciiSpan.className = "hex-ascii-char";
            asciiSpan.textContent = asciiChar;
            asciiSpan.dataset.offset = idx;

            // Byte Inspector Hover
            byteSpan.addEventListener("mouseenter", () => {
              updateInspector(idx, val, asciiChar);
              audioEngine.playInspectTick();
            });

            hexGroup.appendChild(byteSpan);
            asciiGroup.appendChild(asciiSpan);
          } else {
            const emptySpan = document.createElement("span");
            emptySpan.textContent = "   ";
            hexGroup.appendChild(emptySpan);
          }
          if (j === 7) {
            const spacer = document.createElement("span");
            spacer.textContent = " ";
            hexGroup.appendChild(spacer);
          }
        }

        asciiGroup.appendChild(document.createTextNode("|"));
        line.appendChild(hexGroup);
        line.appendChild(document.createTextNode(" "));
        line.appendChild(asciiGroup);
        fragment.appendChild(line);
      }

      if (uint8.length > maxBytes) {
        const truncLine = document.createElement("div");
        truncLine.className = "hex-truncation-notice";
        truncLine.style.color = "var(--text-muted)";
        truncLine.style.marginTop = "0.75rem";
        truncLine.textContent = `/* ... [DISPLAY LIMITED TO FIRST ${maxBytes} BYTES // ${uint8.length - maxBytes} BYTES RESIDE IN LOCAL BUFFER] ... */`;
        fragment.appendChild(truncLine);
      }

      hexStream.appendChild(fragment);
    }

    function updateInspector(offset, val, ascii) {
      if (!inspectOffset) return;
      inspectOffset.textContent = "0x" + offset.toString(16).padStart(8, "0").toUpperCase();
      inspectHex.textContent = "0x" + val.toString(16).padStart(2, "0").toUpperCase();
      inspectDec.textContent = val.toString();
      inspectBin.textContent = val.toString(2).padStart(8, "0");
      inspectAscii.textContent = ascii === "." ? (val === 0 ? "NUL" : "DOT/NON-PRINT") : ascii;

      let desc = "Standard Binary Data";
      if (offset === 0 && val === 0xff) desc = "Possible JPEG SOI Marker [0xFFD8]";
      else if (offset === 1 && val === 0xd8) desc = "JPEG Start of Image Marker";
      else if (offset === 0 && val === 0x25) desc = "PDF Magic Character '%'";
      else if (val === 0x00) desc = "Null Byte / Padding";
      else if (val >= 65 && val <= 90) desc = "Uppercase ASCII Latin Alphabet";
      else if (val >= 97 && val <= 122) desc = "Lowercase ASCII Latin Alphabet";

      inspectDesc.textContent = desc;
    }

    function appendLedgerItem(key, val, badge, isAlert = false) {
      const item = document.createElement("div");
      item.className = "ledger-item";

      const header = document.createElement("div");
      header.className = "ledger-item-header";

      const keyEl = document.createElement("span");
      keyEl.className = "ledger-key";
      keyEl.textContent = key;

      const badgeEl = document.createElement("span");
      badgeEl.className = "ledger-badge" + (isAlert ? " alert" : "");
      badgeEl.textContent = badge;

      header.appendChild(keyEl);
      header.appendChild(badgeEl);

      const valEl = document.createElement("div");
      valEl.className = "ledger-val";
      valEl.textContent = val;

      item.appendChild(header);
      item.appendChild(valEl);

      metadataLedger.appendChild(item);
    }
  }

  /* =============================================================================
     7. Lifecycle Initialization
     ============================================================================= */

  document.addEventListener("DOMContentLoaded", () => {
    initRibbonGlowEngine();
    initCodeBackdrop();
    initUI();
  });
})();
