/**
 * Low-poly GLB furniture for 彗行自然实践中心.
 * Origin ends at the bottom center of each asset. Units: meters.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../public/models");
mkdirSync(outDir, { recursive: true });

const WOOD = [0.71, 0.54, 0.35, 1];
const WOOD_D = [0.45, 0.32, 0.2, 1];
const WHITE = [0.93, 0.91, 0.86, 1];
const SAGE = [0.45, 0.52, 0.42, 1];
const FABRIC = [0.86, 0.82, 0.74, 1];
const FABRIC_W = [0.95, 0.9, 0.84, 1];
const DARK = [0.22, 0.24, 0.23, 1];
const METAL = [0.62, 0.64, 0.63, 1];
const GLASS = [0.75, 0.84, 0.8, 0.45];
const CLAY = [0.78, 0.55, 0.42, 1];
const MOSS = [0.55, 0.62, 0.48, 1];
const BLUE = [0.55, 0.66, 0.7, 1];

class Builder {
  constructor() {
    /** @type {Map<string, {rgba:number[], pos:number[], nor:number[], idx:number[]}>} */
    this.prims = new Map();
  }
  mat(name, rgba) {
    const key = name;
    if (!this.prims.has(key)) this.prims.set(key, { rgba, pos: [], nor: [], idx: [] });
    return key;
  }
  tri(mat, ax, ay, az, bx, by, bz, cx, cy, cz) {
    const p = this.prims.get(mat);
    const ux = bx - ax, uy = by - ay, uz = bz - az;
    const vx = cx - ax, vy = cy - ay, vz = cz - az;
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    const base = p.pos.length / 3;
    p.pos.push(ax, ay, az, bx, by, bz, cx, cy, cz);
    p.nor.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
    p.idx.push(base, base + 1, base + 2);
  }
  quad(mat, a, b, c, d) {
    this.tri(mat, a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    this.tri(mat, a[0], a[1], a[2], c[0], c[1], c[2], d[0], d[1], d[2]);
  }
  /** Box centered at (cx,cy,cz). */
  box(cx, cy, cz, w, h, d, mat) {
    const x = w / 2, y = h / 2, z = d / 2;
    const v = [
      [cx - x, cy - y, cz - z],
      [cx + x, cy - y, cz - z],
      [cx + x, cy + y, cz - z],
      [cx - x, cy + y, cz - z],
      [cx - x, cy - y, cz + z],
      [cx + x, cy - y, cz + z],
      [cx + x, cy + y, cz + z],
      [cx - x, cy + y, cz + z],
    ];
    this.quad(mat, v[0], v[1], v[2], v[3]); // -z  (winding may be inward; doubleSided)
    this.quad(mat, v[5], v[4], v[7], v[6]); // +z
    this.quad(mat, v[4], v[0], v[3], v[7]); // -x
    this.quad(mat, v[1], v[5], v[6], v[2]); // +x
    this.quad(mat, v[3], v[2], v[6], v[7]); // +y
    this.quad(mat, v[4], v[5], v[1], v[0]); // -y
  }
  cyl(cx, cy, cz, r, h, mat, sides = 8) {
    const y0 = cy - h / 2;
    const y1 = cy + h / 2;
    for (let i = 0; i < sides; i++) {
      const a0 = (i / sides) * Math.PI * 2;
      const a1 = ((i + 1) / sides) * Math.PI * 2;
      const x0 = cx + Math.cos(a0) * r, z0 = cz + Math.sin(a0) * r;
      const x1 = cx + Math.cos(a1) * r, z1 = cz + Math.sin(a1) * r;
      this.quad(mat, [x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0]);
      this.tri(mat, cx, y1, cz, x0, y1, z0, x1, y1, z1);
      this.tri(mat, cx, y0, cz, x1, y0, z1, x0, y0, z0);
    }
  }
  legs(w, d, h, t, mat, y0 = 0) {
    const x = w / 2 - t, z = d / 2 - t;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      this.box(sx * x, y0 + h / 2, sz * z, t, h, t, mat);
    }
  }
  toGLB() {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (const p of this.prims.values()) {
      for (let i = 0; i < p.pos.length; i += 3) {
        minX = Math.min(minX, p.pos[i]);
        maxX = Math.max(maxX, p.pos[i]);
        minY = Math.min(minY, p.pos[i + 1]);
        maxY = Math.max(maxY, p.pos[i + 1]);
        minZ = Math.min(minZ, p.pos[i + 2]);
        maxZ = Math.max(maxZ, p.pos[i + 2]);
      }
    }
    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;
    for (const p of this.prims.values()) {
      for (let i = 0; i < p.pos.length; i += 3) {
        p.pos[i] -= cx;
        p.pos[i + 1] -= minY;
        p.pos[i + 2] -= cz;
      }
    }
    const binParts = [];
    const bufferViews = [];
    const accessors = [];
    const materials = [];
    const matIndex = new Map();
    const primitives = [];
    let offset = 0;
    const align = (n) => {
      const m = (n - (offset % n)) % n;
      if (m) {
        binParts.push(Buffer.alloc(m));
        offset += m;
      }
    };
    const pushBuf = (arr, bytesPer, target) => {
      align(4);
      const buf = Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
      const view = bufferViews.length;
      bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: buf.length, target });
      binParts.push(buf);
      offset += buf.length;
      return view;
    };
    for (const [name, p] of this.prims) {
      if (!p.idx.length) continue;
      let mi = matIndex.get(name);
      if (mi == null) {
        mi = materials.length;
        matIndex.set(name, mi);
        materials.push({
          name,
          doubleSided: true,
          pbrMetallicRoughness: {
            baseColorFactor: p.rgba,
            metallicFactor: name === "metal" ? 0.6 : 0.02,
            roughnessFactor: name === "glass" ? 0.15 : 0.72,
          },
          alphaMode: p.rgba[3] < 0.99 ? "BLEND" : "OPAQUE",
        });
      }
      const pos = new Float32Array(p.pos);
      const nor = new Float32Array(p.nor);
      const idx = new Uint16Array(p.idx);
      let pmin = [Infinity, Infinity, Infinity];
      let pmax = [-Infinity, -Infinity, -Infinity];
      for (let i = 0; i < pos.length; i += 3) {
        for (let k = 0; k < 3; k++) {
          pmin[k] = Math.min(pmin[k], pos[i + k]);
          pmax[k] = Math.max(pmax[k], pos[i + k]);
        }
      }
      const pv = pushBuf(pos, 4, 34962);
      const pa = accessors.length;
      accessors.push({ bufferView: pv, componentType: 5126, count: pos.length / 3, type: "VEC3", min: pmin, max: pmax });
      const nv = pushBuf(nor, 4, 34962);
      const na = accessors.length;
      accessors.push({ bufferView: nv, componentType: 5126, count: nor.length / 3, type: "VEC3" });
      const iv = pushBuf(idx, 2, 34963);
      const ia = accessors.length;
      accessors.push({ bufferView: iv, componentType: 5123, count: idx.length, type: "SCALAR" });
      primitives.push({ attributes: { POSITION: pa, NORMAL: na }, indices: ia, material: mi });
    }
    const bin = Buffer.concat(binParts);
    const json = {
      asset: { version: "2.0", generator: "huixing-furniture" },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ mesh: 0, name: "root" }],
      meshes: [{ primitives }],
      materials,
      accessors,
      bufferViews,
      buffers: [{ byteLength: bin.length }],
    };
    const jsonBuf = Buffer.from(JSON.stringify(json));
    const jsonPad = (4 - (jsonBuf.length % 4)) % 4;
    const binPad = (4 - (bin.length % 4)) % 4;
    const total = 12 + 8 + jsonBuf.length + jsonPad + 8 + bin.length + binPad;
    const out = Buffer.alloc(total);
    out.writeUInt32LE(0x46546c67, 0);
    out.writeUInt32LE(2, 4);
    out.writeUInt32LE(total, 8);
    let o = 12;
    out.writeUInt32LE(jsonBuf.length + jsonPad, o);
    out.writeUInt32LE(0x4e4f534a, o + 4);
    o += 8;
    jsonBuf.copy(out, o);
    o += jsonBuf.length;
    out.fill(0x20, o, o + jsonPad);
    o += jsonPad;
    out.writeUInt32LE(bin.length + binPad, o);
    out.writeUInt32LE(0x004e4942, o + 4);
    o += 8;
    bin.copy(out, o);
    return out;
  }
}

const M = (b, name, rgba) => b.mat(name, rgba);

function childDesk(b) {
  const w = M(b, "wood", WOOD);
  b.box(0, 0.52, 0, 0.7, 0.045, 0.48, w);
  b.legs(0.62, 0.4, 0.5, 0.035, w);
  b.box(0, 0.42, 0, 0.62, 0.02, 0.4, w);
}
function childChair(b) {
  const w = M(b, "wood", WOOD);
  const f = M(b, "fabric", SAGE);
  b.box(0, 0.32, 0, 0.34, 0.04, 0.34, f);
  b.box(0, 0.5, 0.15, 0.34, 0.32, 0.035, w);
  b.legs(0.28, 0.28, 0.3, 0.03, w);
}
function podium(b) {
  const w = M(b, "wood", WOOD);
  const s = M(b, "sage", SAGE);
  b.box(0, 0.4, 0, 0.9, 0.8, 0.5, w);
  b.box(0, 0.82, 0, 0.96, 0.04, 0.56, s);
}
function blackboard(b) {
  const d = M(b, "dark", DARK);
  const w = M(b, "wood", WOOD);
  const s = M(b, "sage", SAGE);
  b.box(0, 1.25, 0, 1.8, 1.05, 0.04, d);
  b.box(0, 1.25, -0.015, 1.92, 1.16, 0.03, w);
  b.box(-0.95, 0.55, 0, 0.06, 1.1, 0.06, s);
  b.box(0.95, 0.55, 0, 0.06, 1.1, 0.06, s);
  b.box(0, 0.08, 0.08, 1.5, 0.05, 0.12, w);
}
function wallCabinet(b) {
  const w = M(b, "wood", WOOD);
  const s = M(b, "sage", SAGE);
  b.box(0, 0.55, 0, 1.2, 1.05, 0.38, w);
  b.box(-0.3, 0.55, 0.19, 0.52, 0.9, 0.02, s);
  b.box(0.3, 0.55, 0.19, 0.52, 0.9, 0.02, s);
}
function cart(b) {
  const w = M(b, "wood", WOOD);
  const m = M(b, "metal", METAL);
  b.box(0, 0.38, 0, 0.62, 0.04, 0.4, w);
  b.box(0, 0.62, 0, 0.62, 0.04, 0.4, w);
  b.box(0, 0.86, 0, 0.62, 0.04, 0.4, w);
  for (const x of [-0.28, 0.28]) for (const z of [-0.16, 0.16]) b.box(x, 0.42, z, 0.03, 0.84, 0.03, w);
  for (const x of [-0.24, 0.24]) for (const z of [-0.14, 0.14]) b.cyl(x, 0.05, z, 0.045, 0.04, m, 8);
  b.box(0, 0.5, 0, 0.4, 0.12, 0.22, M(b, "clay", CLAY));
}
function mat(b) {
  const f = M(b, "fabric", MOSS);
  b.box(0, 0.015, 0, 1.35, 0.03, 0.95, f);
  b.box(0, 0.02, 0, 1.1, 0.012, 0.7, M(b, "fabric-light", FABRIC));
}
function toyShelf(b) {
  const w = M(b, "wood", WOOD);
  b.box(0, 0.55, 0, 0.9, 1.1, 0.28, w);
  for (const y of [0.28, 0.55, 0.82]) b.box(0, y, 0, 0.84, 0.025, 0.26, w);
  const colors = [["c1", CLAY], ["c2", BLUE], ["c3", MOSS], ["c4", SAGE]];
  let i = 0;
  for (const y of [0.4, 0.68]) for (const x of [-0.22, 0.22]) {
    const [n, c] = colors[i++ % colors.length];
    b.box(x, y, 0.02, 0.16, 0.14, 0.14, M(b, n, c));
  }
}
function teacherDesk(b) {
  const w = M(b, "wood", WOOD);
  const d = M(b, "dark", DARK);
  b.box(0, 0.72, 0, 1.4, 0.05, 0.7, w);
  b.box(-0.45, 0.36, 0, 0.46, 0.68, 0.62, w);
  b.box(0.5, 0.36, -0.18, 0.04, 0.68, 0.04, w);
  b.box(0.5, 0.36, 0.18, 0.04, 0.68, 0.04, w);
  b.box(0.15, 0.95, -0.18, 0.52, 0.32, 0.03, d);
  b.box(0.15, 0.78, -0.08, 0.12, 0.04, 0.18, d);
  b.box(-0.35, 0.76, 0.05, 0.28, 0.02, 0.2, M(b, "sage", SAGE));
}
function officeChair(b) {
  const f = M(b, "fabric", SAGE);
  const m = M(b, "metal", METAL);
  b.cyl(0, 0.28, 0, 0.04, 0.28, m, 8);
  b.box(0, 0.46, 0, 0.46, 0.07, 0.46, f);
  b.box(0, 0.72, 0.2, 0.46, 0.46, 0.06, f);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    b.box(Math.cos(a) * 0.18, 0.1, Math.sin(a) * 0.18, 0.22, 0.025, 0.04, m);
  }
}
function bookcase(b) {
  const w = M(b, "wood", WOOD);
  b.box(0, 0.9, 0, 0.85, 1.8, 0.32, w);
  for (const y of [0.35, 0.7, 1.05, 1.4]) b.box(0, y, 0, 0.78, 0.025, 0.28, w);
  const tones = [SAGE, CLAY, BLUE, WOOD_D, MOSS];
  let i = 0;
  for (const y of [0.48, 0.84, 1.2, 1.55]) {
    b.box(-0.18, y, 0, 0.12, 0.22, 0.18, M(b, "bk" + i, tones[i % tones.length]));
    i++;
    b.box(0.05, y, 0, 0.1, 0.2, 0.16, M(b, "bk" + i, tones[i % tones.length]));
    i++;
    b.box(0.22, y, 0, 0.14, 0.24, 0.18, M(b, "bk" + i, tones[i % tones.length]));
    i++;
  }
}
function fileCab(b) {
  const w = M(b, "wood", WOOD);
  const m = M(b, "metal", METAL);
  b.box(0, 0.38, 0, 0.48, 0.72, 0.5, w);
  for (const y of [0.18, 0.4, 0.62]) b.box(0, y, 0.25, 0.36, 0.03, 0.02, m);
}
function guestChair(b) {
  const f = M(b, "fabric", FABRIC);
  const w = M(b, "wood", WOOD);
  b.box(0, 0.28, 0, 0.52, 0.1, 0.52, f);
  b.box(0, 0.55, 0.22, 0.52, 0.42, 0.08, f);
  b.box(-0.26, 0.42, 0, 0.06, 0.22, 0.48, f);
  b.box(0.26, 0.42, 0, 0.06, 0.22, 0.48, f);
  b.legs(0.42, 0.42, 0.22, 0.035, w);
}
function roundTable(b) {
  const w = M(b, "wood", WOOD);
  b.cyl(0, 0.74, 0, 0.55, 0.05, w, 12);
  b.cyl(0, 0.36, 0, 0.06, 0.7, w, 8);
  b.cyl(0, 0.04, 0, 0.28, 0.04, w, 10);
}
function craftTable(b) {
  const w = M(b, "wood", WOOD);
  const s = M(b, "sage", SAGE);
  b.box(0, 0.72, 0, 1.5, 0.05, 0.75, w);
  b.legs(1.35, 0.62, 0.7, 0.05, w);
  b.box(0, 0.4, 0, 1.2, 0.04, 0.5, s);
}
function teachCab(b) {
  const s = M(b, "sage", SAGE);
  const w = M(b, "wood", WOOD);
  b.box(0, 0.7, 0, 1.05, 1.35, 0.42, w);
  b.box(-0.25, 0.7, 0.21, 0.46, 1.15, 0.02, s);
  b.box(0.25, 0.7, 0.21, 0.46, 1.15, 0.02, s);
}
function rack(b) {
  const w = M(b, "wood", WOOD);
  const m = M(b, "metal", METAL);
  for (const x of [-0.4, 0.4]) for (const z of [-0.16, 0.16]) b.box(x, 0.75, z, 0.035, 1.5, 0.035, m);
  for (const y of [0.3, 0.65, 1.0, 1.35]) b.box(0, y, 0, 0.85, 0.03, 0.36, w);
  b.box(-0.15, 0.48, 0, 0.28, 0.16, 0.22, M(b, "clay", CLAY));
  b.box(0.18, 0.82, 0, 0.22, 0.12, 0.18, M(b, "moss", MOSS));
}
function plinth(b) {
  const w = M(b, "wood", WOOD);
  const wh = M(b, "white", WHITE);
  b.box(0, 0.2, 0, 0.8, 0.4, 0.48, w);
  b.box(0, 0.42, 0, 0.7, 0.04, 0.38, wh);
}
function kitchenCab(b) {
  const w = M(b, "wood", WOOD);
  const s = M(b, "sage", SAGE);
  const wh = M(b, "white", WHITE);
  b.box(0, 0.45, 0, 1.6, 0.86, 0.6, w);
  b.box(0, 0.9, 0, 1.64, 0.04, 0.64, wh);
  b.box(-0.4, 0.45, 0.3, 0.7, 0.6, 0.02, s);
  b.box(0.4, 0.45, 0.3, 0.7, 0.6, 0.02, s);
}
function counter(b) {
  const w = M(b, "wood", WOOD);
  const wh = M(b, "white", WHITE);
  b.box(0, 0.44, 0, 1.4, 0.84, 0.62, w);
  b.box(0, 0.88, 0, 1.46, 0.045, 0.66, wh);
  b.box(0.2, 0.93, 0, 0.42, 0.06, 0.36, M(b, "sage", SAGE));
}
function fridge(b) {
  const wh = M(b, "white", WHITE);
  const m = M(b, "metal", METAL);
  b.box(0, 0.85, 0, 0.66, 1.7, 0.68, wh);
  b.box(0, 1.15, 0.34, 0.58, 0.9, 0.02, wh);
  b.box(0, 0.4, 0.34, 0.58, 0.55, 0.02, wh);
  b.box(0.24, 0.95, 0.36, 0.03, 0.16, 0.03, m);
}
function prep(b) {
  const w = M(b, "wood", WOOD);
  b.box(0, 0.74, 0, 1.2, 0.05, 0.7, w);
  b.legs(1.05, 0.55, 0.72, 0.05, w);
  b.box(0, 0.4, 0, 1.0, 0.03, 0.5, w);
}
function sink(b) {
  const wh = M(b, "white", WHITE);
  const m = M(b, "metal", METAL);
  const w = M(b, "wood", WOOD);
  b.box(0, 0.4, 0, 0.7, 0.75, 0.48, w);
  b.box(0, 0.8, 0, 0.74, 0.05, 0.52, wh);
  b.box(0, 0.84, 0, 0.42, 0.06, 0.3, M(b, "sage", SAGE));
  b.cyl(0.18, 0.95, 0, 0.02, 0.22, m, 6);
}
function toilet(b) {
  const wh = M(b, "white", WHITE);
  b.box(0, 0.2, 0, 0.4, 0.38, 0.55, wh);
  b.box(0, 0.42, -0.05, 0.4, 0.08, 0.48, wh);
  b.box(0, 0.55, -0.28, 0.38, 0.32, 0.16, wh);
  b.box(0, 0.48, -0.18, 0.16, 0.04, 0.08, M(b, "metal", METAL));
}
function urinal(b) {
  const wh = M(b, "white", WHITE);
  b.box(0, 0.7, 0, 0.36, 0.55, 0.28, wh);
  b.box(0, 0.48, 0.08, 0.28, 0.12, 0.16, wh);
}
function stall(b) {
  const s = M(b, "sage", SAGE);
  const m = M(b, "metal", METAL);
  b.box(-0.45, 0.75, 0, 0.04, 1.45, 0.9, s);
  b.box(0.15, 0.75, -0.43, 1.15, 1.45, 0.04, s);
  b.box(0.15, 0.75, 0.43, 0.7, 1.45, 0.04, s);
  b.cyl(0.45, 0.8, 0.4, 0.015, 0.12, m, 6);
}
function sofa(b) {
  const f = M(b, "fabric", FABRIC_W);
  const w = M(b, "wood", WOOD);
  b.box(0, 0.22, 0, 1.55, 0.18, 0.7, f);
  b.box(0, 0.48, 0.28, 1.55, 0.42, 0.16, f);
  b.box(-0.72, 0.42, 0, 0.12, 0.32, 0.7, f);
  b.box(0.72, 0.42, 0, 0.12, 0.32, 0.7, f);
  b.box(-0.35, 0.36, 0.02, 0.42, 0.12, 0.42, M(b, "sage", SAGE));
  b.box(0.35, 0.36, 0.02, 0.42, 0.12, 0.42, f);
  b.legs(1.4, 0.6, 0.1, 0.04, w);
}
function lowShelf(b) {
  const w = M(b, "wood", WOOD);
  b.box(0, 0.32, 0, 1.15, 0.64, 0.32, w);
  b.box(0, 0.34, 0, 1.08, 0.02, 0.28, w);
  b.box(-0.25, 0.5, 0, 0.16, 0.2, 0.18, M(b, "clay", CLAY));
  b.box(0.05, 0.48, 0, 0.12, 0.18, 0.16, M(b, "sage", SAGE));
  b.box(0.28, 0.5, 0, 0.18, 0.22, 0.16, M(b, "moss", MOSS));
}
function bed(b) {
  const w = M(b, "wood", WOOD);
  const f = M(b, "fabric", FABRIC_W);
  const s = M(b, "sage", SAGE);
  b.box(0, 0.22, 0, 1.05, 0.28, 2.0, w);
  b.box(0, 0.4, 0.05, 0.98, 0.12, 1.75, f);
  b.box(0, 0.55, -0.85, 1.05, 0.45, 0.08, w);
  b.box(0, 0.5, -0.62, 0.42, 0.1, 0.28, s);
  b.box(0, 0.46, 0.45, 0.9, 0.06, 0.7, M(b, "fabric-fold", FABRIC));
}
function nightstand(b) {
  const w = M(b, "wood", WOOD);
  b.box(0, 0.26, 0, 0.42, 0.48, 0.36, w);
  b.box(0, 0.52, 0, 0.46, 0.03, 0.4, w);
  b.cyl(0.1, 0.62, 0, 0.06, 0.16, M(b, "fabric", FABRIC), 8);
  b.cyl(0.1, 0.72, 0, 0.09, 0.03, M(b, "sage", SAGE), 8);
}
function woodBench(b) {
  const w = M(b, "wood", WOOD_D);
  const top = M(b, "wood-top", WOOD);
  b.box(0, 0.78, 0, 1.55, 0.08, 0.7, top);
  b.box(-0.65, 0.4, 0, 0.08, 0.78, 0.6, w);
  b.box(0.65, 0.4, 0, 0.08, 0.78, 0.6, w);
  b.box(0, 0.28, 0, 1.2, 0.06, 0.5, w);
  b.box(0.2, 0.88, 0.1, 0.35, 0.08, 0.12, M(b, "metal", METAL));
}
function outdoorSet(b) {
  const w = M(b, "wood", WOOD);
  const s = M(b, "sage", SAGE);
  b.cyl(0, 0.48, 0, 0.32, 0.04, w, 10);
  b.cyl(0, 0.24, 0, 0.04, 0.46, w, 6);
  for (const [x, z] of [[0.55, 0], [-0.28, 0.48], [-0.28, -0.48]]) {
    b.box(x, 0.28, z, 0.28, 0.035, 0.28, s);
    b.box(x, 0.42, z + 0.12, 0.28, 0.22, 0.03, w);
    b.legs(0.22, 0.22, 0.26, 0.025, w);
    // legs() is centered at origin — redo chairs manually below if needed
  }
}

// outdoorSet used legs() which recenters on origin of the whole asset later,
// but legs() places relative to 0 not the chair. Fix outdoor properly:
function outdoorSetFixed(b) {
  const w = M(b, "wood", WOOD);
  const s = M(b, "sage", SAGE);
  b.cyl(0, 0.48, 0, 0.34, 0.045, w, 10);
  b.cyl(0, 0.24, 0, 0.045, 0.46, w, 6);
  const chairs = [[0.62, 0.05], [-0.32, 0.5], [-0.32, -0.5]];
  for (const [x, z] of chairs) {
    b.box(x, 0.3, z, 0.3, 0.04, 0.3, s);
    b.box(x, 0.46, z - 0.13, 0.3, 0.26, 0.035, w);
    for (const sx of [-0.1, 0.1]) for (const sz of [-0.1, 0.1]) {
      b.box(x + sx, 0.14, z + sz, 0.03, 0.28, 0.03, w);
    }
  }
}

const assets = {
  "child-desk": childDesk,
  "child-chair": childChair,
  podium,
  blackboard,
  "wall-cabinet": wallCabinet,
  cart,
  mat,
  "toy-shelf": toyShelf,
  "teacher-desk": teacherDesk,
  "office-chair": officeChair,
  bookcase,
  "file-cab": fileCab,
  "guest-chair": guestChair,
  "round-table": roundTable,
  "craft-table": craftTable,
  "teach-cab": teachCab,
  rack,
  plinth,
  "kitchen-cab": kitchenCab,
  counter,
  fridge,
  prep,
  sink,
  toilet,
  urinal,
  stall,
  sofa,
  "low-shelf": lowShelf,
  bed,
  nightstand,
  "wood-bench": woodBench,
  "outdoor-set": outdoorSetFixed,
};

let n = 0;
for (const [name, fn] of Object.entries(assets)) {
  const b = new Builder();
  fn(b);
  const buf = b.toGLB();
  writeFileSync(join(outDir, `${name}.glb`), buf);
  n++;
}
console.log(`wrote ${n} glb files to ${outDir}`);
if (n !== 32) {
  console.error("expected 32 assets");
  process.exit(1);
}
