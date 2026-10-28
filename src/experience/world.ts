import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  ASSET_IDS,
  CATALOG,
  DECORS,
  HY,
  LAND_Z,
  RISER,
  ROOMS,
  STAIR,
  STATIC_ITEMS,
  WALL_H,
  WT,
  X_B,
  X_K,
  X_L,
  X_ST0,
  X_ST1,
  XW,
  Z_C0,
  Z_C1,
  Z_SPLIT,
  ZD,
  roomById,
  roomMetrics,
  sampleTime,
  type AssetId,
  type FloorIndex,
  type Placement,
  type ViewMode,
} from "@/experience/data";

const LIFT = 4.6;
const PLAYER_R = 0.22;
const CLASS_ROOMS = new Set(["func", "classA", "classB", "flex", "office", "read", "class1", "class2", "func2", "wood"]);

export const BUILD_STEPS = [
  { id: "plan", t: 0, name: "放线", hint: "在塔子山公园的场地上弹出三层平面。" },
  { id: "slab0", t: 1.5, name: "地基", hint: "浇筑一层楼板，厨房和卫生间铺上石材。" },
  { id: "wall0", t: 2.7, name: "一层墙体", hint: "墙从楼板往上砌，门窗洞先留出来。" },
  { id: "open0", t: 4.3, name: "一层门窗", hint: "门扇和玻璃装进一层的洞口。" },
  { id: "stair0", t: 5.3, name: "楼梯", hint: "之字折返楼梯从一层接到二层，梯下是卫生间。" },
  { id: "slab1", t: 6.4, name: "二层楼板", hint: "二层楼板盖上，楼梯间留出洞口。" },
  { id: "wall1", t: 7.5, name: "二层墙体", hint: "二层教室的墙和南侧花园栏杆。" },
  { id: "open1", t: 9.0, name: "二层门窗", hint: "二层门窗就位。" },
  { id: "stair1", t: 9.9, name: "二层楼梯", hint: "第二跑楼梯接到三层。" },
  { id: "slab2", t: 10.8, name: "三层楼板", hint: "三层楼板、露台和甲板一起铺上。" },
  { id: "wall2", t: 11.8, name: "三层墙体", hint: "阅读室、木工教室和屋顶栏杆。" },
  { id: "open2", t: 13.2, name: "三层门窗", hint: "顶层门窗安装完成。" },
  { id: "roof", t: 14.1, name: "屋顶", hint: "屋面盖上。看清室内时可以再关掉屋顶。" },
  { id: "furn", t: 15.5, name: "家具", hint: "家具、灯具和花园里的植物搬进来。" },
  { id: "settle", t: 17.1, name: "分层", hint: "楼层轻轻拉开，方便看清每一间。" },
] as const;

const INTRO_DUR = 18.8;
const WALL_GROW = [1.45, 1.35, 1.25];

function stepAt(id: (typeof BUILD_STEPS)[number]["id"]) {
  return BUILD_STEPS.find((s) => s.id === id)!.t;
}

type Block = { floor: FloorIndex; x0: number; x1: number; z0: number; z1: number };
type Movable = {
  id: string;
  obj: THREE.Object3D;
  floor: FloorIndex;
  w: number;
  d: number;
  block: Block | null;
  homeX: number;
  homeZ: number;
  homeRot: number;
};
type Tread = { x0: number; x1: number; z0: number; z1: number; yTop: number; ySoffit: number };
type Door = {
  id: string;
  floor: FloorIndex;
  pivot: THREE.Group;
  yaw: number;
  angle: number;
  target: number;
  block: Block;
};
type Tween = {
  obj: THREE.Object3D;
  start: number;
  delay: number;
  dur: number;
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
  fromZ: number;
  toZ: number;
  fromRot: number;
  toRot: number;
  fromS: number;
  toS: number;
  remove?: boolean;
};

export type WorldHooks = {
  onProgress: (n: number) => void;
  onReady: () => void;
  onRoom: (id: string | null) => void;
  onIntro: (done: boolean) => void;
  onStep: (index: number) => void;
};

export class KindergartenWorld {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private persp: THREE.PerspectiveCamera;
  private ortho: THREE.OrthographicCamera;
  private clock = 0;
  private last = performance.now();
  private view: ViewMode = "doll";
  private focus: FloorIndex | "all" = "all";
  private explodeWanted = true;
  private ceilings = false;
  private eye: "child" | "adult" = "child";
  private timeOfDay = 1.15;
  private decorId = DECORS[0].id;
  private intro = 0;
  private introDur = INTRO_DUR;
  private introOn = true;
  private introHold = false;
  private stepIndex = -1;
  private grabbed = false;
  private keys = new Set<string>();
  private qaKeys: Set<string> | null = null;
  private stick = { x: 0, y: 0 };
  private lookDX = 0;
  private lookDY = 0;
  private yaw = Math.PI;
  private pitch = 0;
  private foot = new THREE.Vector3(6.4, 0, 2.05);
  private speed = 0;
  private theta = 0.2;
  private phi = 0.42;
  private radius = 22;
  private target = new THREE.Vector3(XW / 2, 0.3, ZD / 2);
  private orthoHalf = 8.2;
  private drag: { x: number; y: number; mode: "orbit" | "pan" | "look" | "furn" | "" } = { x: 0, y: 0, mode: "" };
  private moved = 0;
  private labels: THREE.Sprite[] = [];
  private floors: THREE.Group[] = [];
  private grow: THREE.Group[] = [];
  private furn: THREE.Group[] = [];
  private slabs: THREE.Group[] = [];
  private openings: THREE.Group[] = [];
  private stairGroups: THREE.Group[] = [];
  private roofGroup = new THREE.Group();
  private roofReveal = 0;
  private roofs: THREE.Object3D[] = [];
  private shell: THREE.Object3D[] = [];
  private blocks: Block[] = [];
  private furnBlocks: Block[] = [];
  private movables: Movable[] = [];
  private movableById = new Map<string, Movable>();
  private selected: Movable | null = null;
  private dragFurn: Movable | null = null;
  private grab = { x: 0, z: 0 };
  private ring!: THREE.Mesh;
  private dragPlane = new THREE.Plane();
  private dragHit = new THREE.Vector3();
  private books: THREE.MeshStandardMaterial[] = [];
  private arch!: ReturnType<KindergartenWorld["makeMaterials"]>;
  private doors: Door[] = [];
  private treads: Tread[] = [];
  private tweens: Tween[] = [];
  private templates: Partial<Record<AssetId, THREE.Object3D>> = {};
  private lamps: { light: THREE.PointLight; bulb: THREE.Mesh; floor: FloorIndex; dim?: boolean }[] = [];
  private tmp = new THREE.Vector3();
  private sun: THREE.DirectionalLight;
  private hemi: THREE.HemisphereLight;
  private clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.35);
  private planMat: THREE.LineBasicMaterial;
  private glassMat: THREE.MeshStandardMaterial;
  private bulbMat: THREE.MeshStandardMaterial;
  private ray = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private disposed = false;
  private ready = false;
  private canvas: HTMLCanvasElement;
  private onDown!: (e: PointerEvent) => void;
  private onMove!: (e: PointerEvent) => void;
  private onUp!: (e: PointerEvent) => void;
  private onWheel!: (e: WheelEvent) => void;
  private onKeyDown!: (e: KeyboardEvent) => void;
  private onKeyUp!: (e: KeyboardEvent) => void;
  private onBlur!: () => void;
  private onMenu!: (e: Event) => void;
  private onLock!: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    private hooks: WorldHooks,
  ) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.14;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.localClippingEnabled = true;
    this.persp = new THREE.PerspectiveCamera(42, 1, 0.08, 200);
    this.ortho = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 120);
    this.scene.background = new THREE.Color("#e7f0f2");
    this.scene.fog = new THREE.Fog("#d5e3d4", 46, 130);

    this.planMat = new THREE.LineBasicMaterial({ color: "#3c4a38", transparent: true, opacity: 1 });
    this.glassMat = new THREE.MeshStandardMaterial({
      color: "#d5e4dc",
      transparent: true,
      opacity: 0.28,
      roughness: 0.08,
      metalness: 0.04,
      emissive: new THREE.Color("#ffd2a4"),
      emissiveIntensity: 0,
    });
    this.bulbMat = new THREE.MeshStandardMaterial({
      color: "#fff1d6",
      emissive: new THREE.Color("#ffc98a"),
      emissiveIntensity: 0,
      roughness: 0.4,
    });

    const mats = this.makeMaterials();
    this.arch = mats;
    this.applyTint(DECORS[0].id);
    this.ring = new THREE.Mesh(
      new THREE.RingGeometry(0.46, 0.56, 28),
      new THREE.MeshBasicMaterial({ color: "#c46b45", side: THREE.DoubleSide, depthTest: false }),
    );
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.y = 0.07;
    this.ring.visible = false;
    this.ring.renderOrder = 4;
    this.sun = new THREE.DirectionalLight("#fff4e4", 1.1);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 90;
    this.sun.shadow.camera.left = -24;
    this.sun.shadow.camera.right = 24;
    this.sun.shadow.camera.top = 24;
    this.sun.shadow.camera.bottom = -24;
    this.sun.shadow.bias = -0.00025;
    this.sun.shadow.normalBias = 0.035;
    const sunTarget = new THREE.Object3D();
    sunTarget.position.set(XW / 2, 2, ZD / 2);
    this.scene.add(sunTarget);
    this.sun.target = sunTarget;
    this.scene.add(this.sun);
    this.hemi = new THREE.HemisphereLight("#e7f0f2", "#cbb89a", 0.5);
    this.scene.add(this.hemi);

    this.buildSite(mats);
    for (let i = 0; i < 3; i++) {
      const g = new THREE.Group();
      g.position.y = i * HY;
      const grow = new THREE.Group();
      grow.scale.y = 0.001;
      const furn = new THREE.Group();
      furn.position.y = -0.8;
      furn.visible = false;
      const slab = new THREE.Group();
      slab.position.y = -SLAB_T;
      slab.scale.y = 0.001;
      const openings = new THREE.Group();
      openings.visible = false;
      g.add(grow, furn, slab, openings);
      this.floors.push(g);
      this.grow.push(grow);
      this.furn.push(furn);
      this.slabs.push(slab);
      this.openings.push(openings);
      this.scene.add(g);
    }
    this.roofGroup.position.y = WALL_H;
    this.roofGroup.scale.y = 0.001;
    this.floors[2].add(this.roofGroup);
    this.buildArchitecture(mats);
    this.buildStairs(mats.floor);
    this.buildGardens(mats);
    this.buildLabels();
    this.buildLamps();
    this.planLines();
    this.bind();
    this.installProbe();
    this.resize();
    this.applyTime();
    this.loadFurniture();
    this.wearPhotos();
    this.renderer.setAnimationLoop(() => this.frame());
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.canvas.removeEventListener("pointerdown", this.onDown);
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerup", this.onUp);
    this.canvas.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onBlur);
    this.canvas.removeEventListener("contextmenu", this.onMenu);
    document.removeEventListener("pointerlockchange", this.onLock);
    this.renderer.dispose();
    if (window.__controlsTest) delete window.__controlsTest;
  }

  resize() {
    const w = this.canvas.clientWidth || 1;
    const h = this.canvas.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.persp.aspect = w / h;
    this.persp.updateProjectionMatrix();
  }

  setView(v: ViewMode) {
    this.view = v;
    if (v === "fps") {
      this.explodeWanted = this.explodeWanted;
      this.snapFloors();
      if (this.intro < this.introDur) this.finishIntro();
      this.pitch = 0;
    } else if (document.pointerLockElement === this.canvas) {
      document.exitPointerLock();
    }
    if (v === "doll" && !this.introOn) {
      this.theta = 2.55;
      this.phi = 1.02;
      this.radius = this.exploded ? 42 : 30;
      this.target.set(7.6, this.exploded ? 6.2 : 2.4, 5.2);
    }
    if (v === "cut" && !this.introOn) {
      const f = this.focus === "all" ? 0 : this.focus;
      this.theta = 0.15;
      this.phi = 0.72;
      this.radius = 16;
      this.target.set(XW / 2, f * HY + 0.4, ZD / 2);
    }
    if (v === "ortho" && !this.introOn) {
      this.target.set(XW / 2, 0, ZD / 2);
      this.orthoHalf = 8.4;
    }
  }

  setFocus(f: FloorIndex | "all") {
    this.focus = f;
    if (this.view === "fps" || this.introOn) return;
    const fl = f === "all" ? 1 : f;
    const lifted = f === "all" && this.explodeWanted && this.view === "doll";
    this.target.set(XW / 2, lifted ? 6.2 : fl * HY + 0.6, ZD / 2);
    if (f !== "all") this.radius = 16;
  }

  setExplode(on: boolean) {
    this.explodeWanted = on;
    if (this.introOn || this.view !== "doll") return;
    this.radius = on ? 34 : 26;
    this.target.y = on ? 6.2 : 2.4;
  }

  setCeilings(on: boolean) {
    this.ceilings = on;
  }

  setEye(eye: "child" | "adult") {
    this.eye = eye;
  }

  setTime(t: number) {
    this.timeOfDay = t;
    this.applyTime();
  }

  setDecor(id: string) {
    const d = DECORS.find((item) => item.id === id) ?? DECORS[0];
    this.applyTint(d.id);
    try {
      localStorage.setItem("huixing-decor", d.id);
    } catch {
      /* private mode */
    }
  }

  private applyTint(id: string) {
    const d = DECORS.find((item) => item.id === id) ?? DECORS[0];
    this.decorId = d.id;
    const a = this.arch;
    const paint = (mat: THREE.MeshStandardMaterial, hex: string) => {
      mat.color.set(hex);
    };
    paint(a.wall, d.wall);
    paint(a.wood, d.wood);
    paint(a.floor, d.floor);
    paint(a.deck, d.floor);
    paint(a.woodDark, d.woodDark);
    paint(a.fabric, d.fabric);
    paint(a.sage, d.sage);
    paint(a.stone, d.stone);
    paint(a.clay, d.accent);
    paint(a.roof, d.roof);
    paint(a.grass, d.grass);
    a.white.color.set("#ffffff").lerp(new THREE.Color(d.wall), 0.16);
    a.ground.color.set("#ffffff").lerp(new THREE.Color(d.grass), 0.16);
    a.leaf.color.set("#ffffff").lerp(new THREE.Color(d.sage), 0.2);
    a.leafGold.color.set("#ffffff").lerp(new THREE.Color(d.accent), 0.32);
    a.trunk.color.set("#ffffff").lerp(new THREE.Color(d.woodDark), 0.2);
    this.glassMat.color.set("#e7f2ec").lerp(new THREE.Color(d.wall), 0.35);
    const darkWood = d.id === "ink" || d.id === "charcoal" || d.id === "forest";
    const matteWall = d.id === "clay" || d.id === "bamboo" || d.id === "forest";
    a.wood.roughness = darkWood ? 0.34 : 0.5;
    a.woodDark.roughness = darkWood ? 0.28 : 0.46;
    a.floor.roughness = 0.55;
    a.deck.roughness = 0.6;
    a.wall.roughness = matteWall ? 0.96 : d.id === "nordic" || d.id === "ink" ? 0.66 : 0.88;
    a.roof.roughness = a.wall.roughness;
    a.fabric.roughness = 0.86;
    a.sage.roughness = 0.76;
    a.clay.roughness = 0.8;
    for (const book of this.books) {
      const base = (book.userData.base as string) || "#8d6844";
      book.color.set(base).lerp(new THREE.Color(d.accent), 0.62);
    }
    if (this.hemi) this.applyTime();
  }

  resetMoves() {
    for (const m of this.movables) {
      m.obj.position.x = m.homeX;
      m.obj.position.z = m.homeZ;
      m.obj.rotation.y = m.homeRot;
      this.syncBlock(m);
    }
    this.persistMoves();
  }

  focusRoom(id: string) {
    const r = roomById(id);
    if (!r) return;
    this.focus = r.floor;
    this.view = this.view === "fps" ? "fps" : "doll";
    const y = this.floors[r.floor]?.position.y ?? r.floor * HY;
    if (this.view === "fps") {
      this.foot.set((r.x0 + r.x1) / 2, r.floor * HY, (r.z0 + r.z1) / 2);
    } else {
      this.target.set((r.x0 + r.x1) / 2, y + 0.8, (r.z0 + r.z1) / 2);
      this.radius = 11;
      this.phi = 0.95;
    }
  }

  replay() {
    this.view = "doll";
    this.focus = "all";
    this.grabbed = false;
    this.intro = 0;
    this.introOn = true;
    this.introHold = false;
    this.hooks.onIntro(false);
    this.theta = 0.2;
    this.phi = 0.42;
    this.radius = 22;
    this.target.set(XW / 2, 0.3, ZD / 2);
    this.stepIndex = -1;
    this.resetBuild();
    this.syncStep();
  }

  skipIntro() {
    this.finishIntro();
  }

  setStick(x: number, y: number) {
    this.stick.x = x;
    this.stick.y = y;
  }

  setLook(dx: number, dy: number) {
    this.lookDX += dx;
    this.lookDY += dy;
  }

  private finishIntro() {
    this.intro = this.introDur;
    this.introOn = false;
    this.completeBuild();
    this.hooks.onIntro(true);
    if (!this.grabbed && this.view === "doll") {
      this.theta = 2.55;
      this.phi = 1.02;
      this.radius = this.exploded ? 42 : 30;
      this.target.set(7.6, this.exploded ? 6.2 : 2.4, 5.2);
    }
  }

  private resetBuild() {
    for (const g of this.grow) g.scale.y = 0.001;
    for (const f of this.furn) {
      f.position.y = -0.8;
      f.visible = false;
    }
    for (const s of this.slabs) s.scale.y = 0.001;
    for (const o of this.openings) {
      o.visible = false;
      o.position.y = 0;
    }
    for (const s of this.stairGroups) {
      s.visible = false;
      s.position.y = 0;
    }
    this.roofGroup.scale.y = 0.001;
    this.roofReveal = 0;
    this.planMat.opacity = 1;
    for (let i = 0; i < 3; i++) this.floors[i].position.y = i * HY;
  }

  private completeBuild() {
    for (const g of this.grow) g.scale.y = 1;
    for (const f of this.furn) {
      f.position.y = 0;
      f.visible = true;
    }
    for (const s of this.slabs) s.scale.y = 1;
    for (const o of this.openings) {
      o.visible = true;
      o.position.y = 0;
    }
    for (const s of this.stairGroups) {
      s.visible = true;
      s.position.y = 0;
    }
    this.roofGroup.scale.y = 1;
    this.roofReveal = 1;
    this.planMat.opacity = 0;
  }

  private get exploded() {
    return this.explodeWanted && this.view === "doll" && this.focus === "all";
  }

  private snapFloors() {
    for (let i = 0; i < 3; i++) this.floors[i].position.y = i * HY;
  }

  private makeMaterials() {
    const woodImg = this.paintTex((g, n) => this.drawWood(g, n), 1);
    const wallImg = this.paintTex((g, n) => this.drawPlaster(g, n), 1);
    const stoneImg = this.paintTex((g, n) => this.drawStone(g, n), 1);
    const grassImg = this.paintTex((g, n) => this.drawGrass(g, n), 1);
    const leafImg = this.paintTex((g, n) => this.drawFoliage(g, n, false), 1);
    const goldImg = this.paintTex((g, n) => this.drawFoliage(g, n, true), 1);
    const fabricImg = this.paintTex((g, n) => this.drawFabric(g, n), 1);
    const std = (map: THREE.Texture | null, rough = 0.78, metal = 0.02) =>
      new THREE.MeshStandardMaterial({ color: "#ffffff", map, roughness: rough, metalness: metal, bumpMap: map, bumpScale: 0.015 });
    const books = ["#8d6844", "#6d7c64", "#c98962", "#5c6b55", "#7f8c9a"].map((color) => {
      const mat = new THREE.MeshStandardMaterial({ color, map: fabricImg, roughness: 0.82, bumpMap: fabricImg, bumpScale: 0.02 });
      mat.userData.base = color;
      return mat;
    });
    this.books = books;
    return {
      wall: std(wallImg, 0.92),
      wood: std(woodImg, 0.55),
      floor: std(woodImg, 0.58),
      woodDark: std(woodImg, 0.62),
      sage: std(fabricImg, 0.72),
      stone: std(stoneImg, 0.84),
      grass: std(grassImg, 0.94),
      ground: std(grassImg, 0.96),
      deck: std(woodImg, 0.62),
      roof: std(wallImg, 0.88),
      trunk: std(woodImg, 0.8),
      leaf: std(leafImg, 0.88),
      leafGold: std(goldImg, 0.86),
      metal: new THREE.MeshStandardMaterial({ color: "#8d9290", roughness: 0.32, metalness: 0.72 }),
      white: std(wallImg, 0.6),
      fabric: std(fabricImg, 0.88),
      clay: std(fabricImg, 0.74),
    };
  }

  private wearPhotos() {
    const loader = new THREE.TextureLoader();
    const a = this.arch;
    const take = (url: string, mats: THREE.MeshStandardMaterial[], bumpScale: number, lo: number, hi: number) => {
      loader.load(url, (tex) => {
        const albedo = this.neutralMap(tex.image as CanvasImageSource, lo, hi);
        const bump = this.neutralMap(tex.image as CanvasImageSource, 0.02, 1);
        tex.dispose();
        if (!albedo || !bump) return;
        bump.colorSpace = THREE.LinearSRGBColorSpace;
        for (const mat of mats) {
          mat.map = albedo;
          mat.bumpMap = bump;
          mat.bumpScale = bumpScale;
          mat.needsUpdate = true;
        }
      });
    };
    take("/textures/oak.jpg", [a.wood, a.floor, a.deck], 0.09, 0.46, 1);
    take("/textures/walnut.jpg", [a.woodDark], 0.11, 0.34, 0.96);
    take("/textures/plaster.jpg", [a.wall, a.roof, a.white], 0.055, 0.9, 1);
    take("/textures/linen.jpg", [a.fabric, a.sage, a.clay, ...this.books], 0.07, 0.74, 1);
    take("/textures/stone.jpg", [a.stone], 0.09, 0.58, 1);
    take("/textures/grass.jpg", [a.grass], 0.05, 0.72, 1);
    loader.load("/textures/grass.jpg", (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      a.ground.map = tex;
      a.ground.bumpMap = tex;
      a.ground.bumpScale = 0.03;
      a.ground.needsUpdate = true;
    });
    loader.load("/textures/walnut.jpg", (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      a.trunk.map = tex;
      a.trunk.bumpMap = tex;
      a.trunk.bumpScale = 0.05;
      a.trunk.needsUpdate = true;
    });
  }

  private neutralMap(image: CanvasImageSource, lo: number, hi: number) {
    const w = Math.max(2, (image as HTMLImageElement).naturalWidth || (image as HTMLImageElement).width || 512);
    const h = Math.max(2, (image as HTMLImageElement).naturalHeight || (image as HTMLImageElement).height || 512);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true });
    if (!g) return null;
    g.drawImage(image, 0, 0, w, h);
    const img = g.getImageData(0, 0, w, h);
    const px = img.data;
    for (let i = 0; i < px.length; i += 4) {
      const l = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) / 255;
      const v = Math.round((lo + (hi - lo) * l) * 255);
      px[i] = px[i + 1] = px[i + 2] = v;
    }
    g.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private meterUV(geo: THREE.BufferGeometry) {
    const pos = geo.getAttribute("position");
    const nor = geo.getAttribute("normal");
    if (!pos || !nor) return;
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const nx = Math.abs(nor.getX(i));
      const ny = Math.abs(nor.getY(i));
      const nz = Math.abs(nor.getZ(i));
      if (ny >= nx && ny >= nz) {
        uv[i * 2] = x;
        uv[i * 2 + 1] = z;
      } else if (nx >= nz) {
        uv[i * 2] = z;
        uv[i * 2 + 1] = y;
      } else {
        uv[i * 2] = x;
        uv[i * 2 + 1] = y;
      }
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  }

  private paintTex(draw: (g: CanvasRenderingContext2D, n: number) => void, repeat: number) {
    const n = 512;
    const c = document.createElement("canvas");
    c.width = n;
    c.height = n;
    const g = c.getContext("2d");
    if (!g) return null;
    draw(g, n);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }

  private drawWood(g: CanvasRenderingContext2D, n: number) {
    g.fillStyle = "#f4f4f4";
    g.fillRect(0, 0, n, n);
    for (let i = 0; i < 42; i++) {
      const y = ((i + 0.5) / 42) * n;
      const wave = Math.sin(i * 0.7) * 8;
      g.strokeStyle = `rgba(28, 28, 28, ${0.08 + (i % 4) * 0.035})`;
      g.lineWidth = i % 6 === 0 ? 2 : 1;
      g.beginPath();
      g.moveTo(0, y);
      g.bezierCurveTo(n * 0.35, y + wave, n * 0.7, y - wave * 0.6, n, y + wave * 0.3);
      g.stroke();
    }
    for (let k = 0; k < 5; k++) {
      const x = (k * 97 + 40) % n;
      const y = (k * 149 + 20) % n;
      const rad = g.createRadialGradient(x, y, 2, x, y, 22);
      rad.addColorStop(0, "rgba(20,20,20,0.28)");
      rad.addColorStop(1, "rgba(20,20,20,0)");
      g.fillStyle = rad;
      g.beginPath();
      g.ellipse(x, y, 22, 12, k, 0, Math.PI * 2);
      g.fill();
    }
  }

  private drawPlaster(g: CanvasRenderingContext2D, n: number) {
    g.fillStyle = "#f7f7f7";
    g.fillRect(0, 0, n, n);
    for (let i = 0; i < 1800; i++) {
      const v = 214 + ((i * 37) % 28);
      g.fillStyle = `rgba(${v}, ${v}, ${v}, 0.2)`;
      const s = 1 + (i % 3);
      g.fillRect((i * 19) % n, (i * 47) % n, s, s);
    }
    for (let i = 0; i < 30; i++) {
      g.fillStyle = `rgba(80,80,80,${0.03 + (i % 4) * 0.012})`;
      g.beginPath();
      g.ellipse((i * 80) % n, (i * 53) % n, 40 + (i % 5) * 6, 18, i, 0, Math.PI * 2);
      g.fill();
    }
  }

  private drawStone(g: CanvasRenderingContext2D, n: number) {
    g.fillStyle = "#e4e4e4";
    g.fillRect(0, 0, n, n);
    const tile = 64;
    for (let y = 0; y < n; y += tile) {
      for (let x = 0; x < n; x += tile) {
        const jig = ((x + y) % 17) - 8;
        const v = 196 + jig;
        g.fillStyle = `rgb(${v}, ${v}, ${v})`;
        g.fillRect(x + 1, y + 1, tile - 2, tile - 2);
        for (let k = 0; k < 8; k++) {
          g.fillStyle = `rgba(40,40,40,${0.05 + (k % 3) * 0.03})`;
          g.beginPath();
          g.ellipse(x + ((k * 23) % tile), y + ((k * 17) % tile), 6, 4, k, 0, Math.PI * 2);
          g.fill();
        }
      }
    }
  }

  private drawGrass(g: CanvasRenderingContext2D, n: number) {
    g.fillStyle = "#6f8f64";
    g.fillRect(0, 0, n, n);
    for (let i = 0; i < 1400; i++) {
      const x = (i * 47) % n;
      const y = (i * 83) % n;
      const h = 6 + (i % 9);
      const tone = i % 3 === 0 ? "#8eae78" : i % 3 === 1 ? "#5d7c52" : "#c6b25a";
      g.strokeStyle = tone;
      g.globalAlpha = 0.35;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + ((i % 5) - 2), y - h);
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  private drawFoliage(g: CanvasRenderingContext2D, n: number, gold: boolean) {
    g.fillStyle = gold ? "#e4d48a" : "#8fb57a";
    g.fillRect(0, 0, n, n);
    for (let i = 0; i < 900; i++) {
      const x = (i * 61) % n;
      const y = (i * 97) % n;
      if (gold) g.fillStyle = `rgba(${190 + (i % 40)}, ${150 + (i % 36)}, ${48 + (i % 24)}, 0.42)`;
      else g.fillStyle = `rgba(${46 + (i % 50)}, ${96 + (i % 70)}, ${38 + (i % 28)}, 0.45)`;
      g.beginPath();
      g.ellipse(x, y, 10 + (i % 14), 6 + (i % 7), i * 0.4, 0, Math.PI * 2);
      g.fill();
    }
  }

  private drawFabric(g: CanvasRenderingContext2D, n: number) {
    g.fillStyle = "#f3f3f3";
    g.fillRect(0, 0, n, n);
    for (let y = 0; y < n; y += 4) {
      g.strokeStyle = y % 8 === 0 ? "rgba(30,30,30,0.16)" : "rgba(255,255,255,0.35)";
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(n, y);
      g.stroke();
    }
    for (let x = 0; x < n; x += 4) {
      g.strokeStyle = x % 8 === 0 ? "rgba(20,20,20,0.12)" : "rgba(255,255,255,0.2)";
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, n);
      g.stroke();
    }
  }

  private buildSite(mats: ReturnType<KindergartenWorld["makeMaterials"]>) {
    const ground = new THREE.Mesh(new THREE.CircleGeometry(86, 80), mats.ground);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(XW / 2, -0.06, ZD / 2);
    ground.receiveShadow = true;
    this.meterUV(ground.geometry);
    this.scene.add(ground);

    const ring = new THREE.Mesh(new THREE.RingGeometry(13.2, 15.1, 72), mats.stone);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(XW / 2, -0.03, ZD / 2);
    ring.receiveShadow = true;
    this.meterUV(ring.geometry);
    this.scene.add(ring);

    const path = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 24), mats.stone);
    path.rotation.x = -Math.PI / 2;
    path.position.set(6.4, -0.02, -12.4);
    path.receiveShadow = true;
    this.meterUV(path.geometry);
    this.scene.add(path);

    const apron = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.05, 3.6), mats.stone);
    apron.position.set(6.4, 0.0, -1.5);
    apron.receiveShadow = true;
    this.meterUV(apron.geometry);
    this.scene.add(apron);

    const count = 128;
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.2, 1.7, 7);
    const lowGeo = new THREE.SphereGeometry(1.05, 8, 6);
    lowGeo.scale(1.2, 0.62, 1.15);
    const highGeo = new THREE.SphereGeometry(0.72, 8, 6);
    const trunks = new THREE.InstancedMesh(trunkGeo, mats.trunk, count);
    const lows = new THREE.InstancedMesh(lowGeo, mats.leaf, count);
    const highs = new THREE.InstancedMesh(highGeo, mats.leaf, count);
    const golds = new THREE.InstancedMesh(lowGeo, mats.leafGold, count);
    trunks.castShadow = true;
    lows.castShadow = true;
    highs.castShadow = true;
    golds.castShadow = true;
    const dummy = new THREE.Object3D();
    const spots: { x: number; z: number; s: number; gold: boolean }[] = [];
    let seed = 19;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const clearOf = (x: number, z: number) => {
      if (x > -3.2 && x < XW + 3.2 && z > -4 && z < ZD + 2.6) return false;
      if (Math.abs(x - 6.4) < 2.3 && z < 1.5 && z > -20) return false;
      const dx = x - XW / 2;
      const dz = z - ZD / 2;
      const rad = Math.hypot(dx, dz * 1.05);
      if (rad > 12.2 && rad < 16.2) return false;
      return !spots.some((s) => (s.x - x) ** 2 + (s.z - z) ** 2 < 18);
    };
    for (let i = 0; spots.length < count && i < 900; i++) {
      const ang = rnd() * Math.PI * 2;
      const rad = 16.5 + rnd() * 62;
      const x = XW / 2 + Math.cos(ang) * rad;
      const z = ZD / 2 - 1 + Math.sin(ang) * rad * 0.92;
      if (!clearOf(x, z)) continue;
      spots.push({ x, z, s: 0.85 + rnd() * 1.25, gold: rnd() < 0.2 });
    }
    let green = 0;
    let gold = 0;
    spots.forEach((p, n) => {
      dummy.position.set(p.x, 0.85 * p.s, p.z);
      dummy.rotation.set(0, p.x, 0);
      dummy.scale.set(p.s * 0.9, p.s, p.s * 0.9);
      dummy.updateMatrix();
      trunks.setMatrixAt(n, dummy.matrix);
      dummy.position.y = 1.85 * p.s;
      dummy.scale.set(p.s * 1.25, p.s * 0.95, p.s * 1.2);
      dummy.updateMatrix();
      if (p.gold) {
        golds.setMatrixAt(gold, dummy.matrix);
        gold += 1;
      } else {
        lows.setMatrixAt(green, dummy.matrix);
        green += 1;
        dummy.position.y = 2.55 * p.s;
        dummy.position.x += 0.15 * p.s;
        dummy.scale.set(p.s * 0.72, p.s * 0.7, p.s * 0.72);
        dummy.updateMatrix();
        highs.setMatrixAt(green - 1, dummy.matrix);
      }
    });
    trunks.count = spots.length;
    lows.count = green;
    highs.count = green;
    golds.count = gold;
    trunks.instanceMatrix.needsUpdate = true;
    lows.instanceMatrix.needsUpdate = true;
    highs.instanceMatrix.needsUpdate = true;
    golds.instanceMatrix.needsUpdate = true;
    this.scene.add(trunks, lows, highs, golds);

    const shrubGeo = new THREE.SphereGeometry(0.42, 7, 5);
    shrubGeo.scale(1.15, 0.65, 1.05);
    const shrubs = new THREE.InstancedMesh(shrubGeo, mats.leaf, 70);
    let s = 0;
    for (let i = 0; i < 90 && s < 70; i++) {
      const ang = (i / 90) * Math.PI * 2 + 0.2;
      const rad = 9.4 + (i % 4) * 0.55;
      const x = XW / 2 + Math.cos(ang) * rad * 1.15;
      const z = ZD / 2 + Math.sin(ang) * rad * 0.85;
      if (x > -0.4 && x < XW + 0.4 && z > -0.6 && z < ZD + 0.4) continue;
      if (Math.abs(x - 6.4) < 2.6 && z < 0.4) continue;
      dummy.position.set(x, 0.28, z);
      dummy.rotation.set(0, ang, 0);
      dummy.scale.set(0.8 + (i % 3) * 0.28, 0.7, 0.9);
      dummy.updateMatrix();
      shrubs.setMatrixAt(s, dummy.matrix);
      s += 1;
    }
    shrubs.count = s;
    shrubs.instanceMatrix.needsUpdate = true;
    shrubs.castShadow = true;
    this.scene.add(shrubs);

    const petalGeo = new THREE.SphereGeometry(0.12, 6, 4);
    const petals = ["#f7f3ea", "#e7a3b4", "#e6c85c"].map(
      (color) => new THREE.InstancedMesh(petalGeo, new THREE.MeshStandardMaterial({ color, roughness: 0.7 }), 36),
    );
    for (let i = 0; i < 36; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = 6.4 + side * (1.7 + (i % 3) * 0.35);
      const z = -2.2 - (i % 18) * 0.85;
      dummy.position.set(x, 0.1, z);
      dummy.scale.set(1, 0.6, 1);
      dummy.rotation.set(0, i, 0);
      dummy.updateMatrix();
      petals[i % 3].setMatrixAt(Math.floor(i / 3), dummy.matrix);
    }
    for (const mesh of petals) {
      mesh.count = 12;
      mesh.instanceMatrix.needsUpdate = true;
      this.scene.add(mesh);
    }

    const nearCount = 48;
    const nearTrunk = new THREE.InstancedMesh(trunkGeo, mats.trunk, nearCount);
    const nearLeaf = new THREE.InstancedMesh(lowGeo, mats.leaf, nearCount);
    const nearGold = new THREE.InstancedMesh(lowGeo, mats.leafGold, nearCount);
    nearTrunk.castShadow = true;
    nearLeaf.castShadow = true;
    nearGold.castShadow = true;
    const belt: { x: number; z: number; s: number; y: number; gold: boolean }[] = [
      { x: -5.2, z: 1.2, s: 1.15, y: 0, gold: false },
      { x: -6.4, z: 5.4, s: 1.35, y: 0, gold: true },
      { x: -4.6, z: 9.2, s: 1.05, y: 0, gold: false },
      { x: -3.4, z: 12.4, s: 1.2, y: 0, gold: false },
      { x: 2.2, z: 14.2, s: 1.4, y: 0, gold: true },
      { x: 8.4, z: 15.6, s: 1.55, y: 0, gold: false },
      { x: 14.2, z: 14.4, s: 1.25, y: 0, gold: false },
      { x: 19.4, z: 8.6, s: 1.3, y: 0, gold: true },
      { x: 20.2, z: 3.2, s: 1.15, y: 0, gold: false },
      { x: 19.2, z: -2.4, s: 1.05, y: 0, gold: false },
      { x: 12.8, z: -4.6, s: 1.2, y: 0, gold: true },
      { x: 2.4, z: -4.2, s: 1.1, y: 0, gold: false },
      { x: -2.8, z: -3.2, s: 0.95, y: 0, gold: false },
      { x: 22, z: 36, s: 1.6, y: 2.4, gold: true },
      { x: 16, z: 42, s: 1.35, y: 2.8, gold: false },
      { x: 28, z: 40, s: 1.45, y: 2.2, gold: true },
      { x: 12, z: 34, s: 1.2, y: 1.4, gold: false },
      { x: 24, z: 30, s: 1.15, y: 1.1, gold: false },
    ];
    let ni = 0;
    let ng = 0;
    let nGreen = 0;
    for (const p of belt) {
      if (ni >= nearCount) break;
      dummy.position.set(p.x, p.y + 0.85 * p.s, p.z);
      dummy.rotation.set(0, p.x, 0);
      dummy.scale.set(p.s * 0.85, p.s, p.s * 0.85);
      dummy.updateMatrix();
      nearTrunk.setMatrixAt(ni, dummy.matrix);
      dummy.position.y = p.y + 1.9 * p.s;
      dummy.scale.set(p.s * 1.35, p.s, p.s * 1.25);
      dummy.updateMatrix();
      if (p.gold) {
        nearGold.setMatrixAt(ng, dummy.matrix);
        ng += 1;
      } else {
        nearLeaf.setMatrixAt(nGreen, dummy.matrix);
        nGreen += 1;
      }
      ni += 1;
    }
    nearTrunk.count = ni;
    nearLeaf.count = nGreen;
    nearGold.count = ng;
    nearTrunk.instanceMatrix.needsUpdate = true;
    nearLeaf.instanceMatrix.needsUpdate = true;
    nearGold.instanceMatrix.needsUpdate = true;
    this.scene.add(nearTrunk, nearLeaf, nearGold);

    const hill = new THREE.Mesh(new THREE.SphereGeometry(22, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), mats.grass);
    hill.scale.set(1.55, 0.16, 1.05);
    hill.position.set(20, -0.35, 40);
    hill.receiveShadow = true;
    this.scene.add(hill);
    const hillTag = this.makeLabel("塔子山");
    hillTag.position.set(20, 6.4, 40);
    hillTag.scale.set(7.2, 1.8, 1);
    this.scene.add(hillTag);
    this.labels.push(hillTag);
  }

  private box(w: number, h: number, d: number) {
    return new THREE.BoxGeometry(w, h, d);
  }

  private addBox(
    parent: THREE.Object3D,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    shadow = true,
  ) {
    const m = new THREE.Mesh(this.box(w, h, d), mat);
    this.meterUV(m.geometry);
    m.position.set(x, y, z);
    m.castShadow = shadow;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  private buildArchitecture(mats: ReturnType<KindergartenWorld["makeMaterials"]>) {
    const slab = (floor: FloorIndex, x0: number, x1: number, z0: number, z1: number, mat: THREE.Material) => {
      if (x1 - x0 < 0.05 || z1 - z0 < 0.05) return;
      const mesh = this.addBox(
        this.slabs[floor],
        mat,
        (x0 + x1) / 2,
        SLAB_HALF,
        (z0 + z1) / 2,
        x1 - x0,
        SLAB_T,
        z1 - z0,
        false,
      );
      mesh.castShadow = false;
      return mesh;
    };
    // level 0 full plate
    slab(0, 0, XW, 0, ZD, mats.floor);
    // level 1 full plate minus stair — four strips
    this.slabAroundStair(1, mats.floor, 0, XW, 0, ZD);
    // level 2 partial
    this.slabAroundStair(2, mats.floor, 0, X_B, 0, ZD);
    this.slabAroundStair(2, mats.deck, X_B, X_ST1, Z_C0, ZD);
    this.slabAroundStair(2, mats.floor, X_ST1, XW, Z_C0, ZD);
    // stone in wet rooms — thin overlay
    this.addBox(this.slabs[0], mats.stone, (X_K + XW) / 2, 0.015 + SLAB_T, Z_C0 / 2, XW - X_K, 0.03, Z_C0, false);
    this.addBox(this.slabs[0], mats.stone, (7.28 + 9.42) / 2, 0.02 + SLAB_T, (5.58 + 7.52) / 2, 2.1, 0.03, 1.9, false);

    const wall = mats.wall;
    const sage = mats.sage;
    // Floor 0
    this.run(0, "x", 0, 0, XW, wall, true, [
      { a: 5.62, b: 6.72, sill: 0, head: 2.15, door: true, swing: -1.15, id: "entry" },
      { a: 1.1, b: 3.5, sill: 0.72, head: 2.2 },
      { a: 8.1, b: 10.2, sill: 0.85, head: 2.15 },
      { a: 12.1, b: 14.6, sill: 1.35, head: 2.15 },
    ]);
    this.run(0, "x", ZD, 0, XW, wall, false, [
      { a: 0.8, b: 3.6, sill: 0.75, head: 2.2 },
      { a: 5.7, b: 8.8, sill: 1.85, head: 2.55 },
      { a: 10.4, b: 14.4, sill: 0.75, head: 2.2 },
    ]);
    this.run(0, "z", 0, 0, ZD, wall, false, [
      { a: 0.6, b: 2.4, sill: 0.75, head: 2.15 },
      { a: 6.2, b: 8.8, sill: 0.75, head: 2.2 },
    ]);
    this.run(0, "z", XW, 0, ZD, wall, false, [
      { a: 1.25, b: 2.25, sill: 0, head: 2.15, door: true, swing: -1.15, id: "service" },
      { a: 6.3, b: 8.6, sill: 0.8, head: 2.15 },
    ]);
    this.run(0, "x", Z_C0, 0, XW, wall, false, [
      { a: 2.05, b: 3.05, sill: 0, head: 2.15, door: true, swing: 1.15, id: "b-hall" },
      { a: 5.7, b: 6.6, sill: 0, head: 2.15, door: true, swing: -1.15, id: "lobby-hall" },
      { a: 8.55, b: 9.5, sill: 0, head: 2.15, door: true, swing: 1.15, id: "office-hall" },
      { a: 12.35, b: 13.35, sill: 0, head: 2.15, door: true, swing: 1.15, id: "kit-hall" },
    ]);
    this.run(0, "x", Z_C1, 0, XW, wall, false, [
      { a: 1.85, b: 2.85, sill: 0, head: 2.15, door: true, swing: -1.15, id: "func-hall" },
      { a: 5.5, b: 6.72, sill: 0, head: 2.15, door: true, swing: -1.15, id: "stair0" },
      { a: 7.65, b: 8.55, sill: 0, head: 2.15, door: true, swing: -1.15, id: "wc" },
      { a: 11.5, b: 12.5, sill: 0, head: 2.15, door: true, swing: -1.15, id: "a-hall" },
    ]);
    this.run(0, "z", X_B, 0, Z_C0, wall, false, [
      { a: 1.35, b: 2.3, sill: 0, head: 2.15, door: true, swing: 1.15, id: "b-lobby" },
    ]);
    this.run(0, "z", X_L, 0, Z_C0, wall, false, [
      { a: 1.5, b: 2.45, sill: 0, head: 2.15, door: true, swing: -1.15, id: "lobby-off" },
    ]);
    this.run(0, "z", X_K, 0, Z_C0, wall, false, []);
    this.run(0, "z", X_ST0, Z_C1, ZD, wall, false, []);
    this.run(0, "z", X_ST1, Z_C1, ZD, wall, false, []);
    // wc enclosure
    this.run(0, "z", 7.28, 5.58, 7.5, wall, false, []);
    this.run(0, "x", 7.5, 7.28, 9.42, wall, false, []);
    this.run(0, "z", 9.42, 5.58, 7.5, sage, false, []);

    // Floor 1
    this.run(1, "x", 0, 0, X_B, wall, true, [{ a: 1.3, b: 3.5, sill: 0.7, head: 2.2 }]);
    this.run(1, "z", 0, 0, ZD, wall, false, [
      { a: 0.7, b: 2.6, sill: 0.7, head: 2.2 },
      { a: 6.4, b: 9.0, sill: 0.7, head: 2.2 },
    ]);
    this.run(1, "x", ZD, 0, XW, wall, false, [
      { a: 0.7, b: 3.8, sill: 0.75, head: 2.2 },
      { a: 10.3, b: 14.6, sill: 0.75, head: 2.2 },
    ]);
    this.run(1, "z", XW, Z_C1, ZD, wall, false, [{ a: 6.2, b: 9.2, sill: 0.55, head: 2.25 }]);
    this.run(1, "z", X_B, 0, Z_C0, wall, false, [
      { a: 0.35, b: 1.35, sill: 0.15, head: 2.3 },
      { a: 1.55, b: 2.5, sill: 0, head: 2.15, door: true, swing: -1.15, id: "flex-garden" },
      { a: 2.7, b: 3.9, sill: 0.15, head: 2.3 },
    ]);
    this.run(1, "x", Z_C0, 0, X_B, wall, false, [
      { a: 1.9, b: 2.9, sill: 0, head: 2.15, door: true, swing: 1.15, id: "flex-hall" },
    ]);
    this.run(1, "x", Z_C0, X_B, XW, wall, false, [
      { a: 6.2, b: 10.6, sill: 0.12, head: 2.35 },
      { a: 11.7, b: 12.7, sill: 0, head: 2.15, door: true, swing: 1.15, id: "hall-garden" },
      { a: 12.95, b: 15.2, sill: 0.12, head: 2.35 },
    ]);
    this.run(1, "x", Z_C1, 0, XW, wall, false, [
      { a: 1.85, b: 2.85, sill: 0, head: 2.15, door: true, swing: -1.15, id: "c1-hall" },
      { a: 5.5, b: 6.72, sill: 0, head: 2.15, door: true, swing: -1.15, id: "stair1" },
      { a: 11.4, b: 12.45, sill: 0, head: 2.15, door: true, swing: -1.15, id: "c2-hall" },
    ]);
    this.run(1, "z", X_ST0, Z_C1, ZD, wall, false, []);
    this.run(1, "z", X_ST1, Z_C1, ZD, wall, false, []);
    this.run(1, "x", Z_SPLIT, X_ST1, XW, wall, false, [
      { a: 11.6, b: 12.6, sill: 0, head: 2.15, door: true, swing: -1.15, id: "c2-func" },
    ]);
    // garden rails floor 1
    this.rail(1, X_B, 0.12, XW, 0.12);
    this.rail(1, XW - 0.1, 0.12, XW - 0.1, Z_C0);

    // Floor 2
    this.run(2, "z", 0, Z_C1, ZD, wall, false, [{ a: 6.5, b: 8.8, sill: 0.8, head: 2.15 }]);
    this.run(2, "x", ZD, 0, XW, wall, false, [
      { a: 0.8, b: 3.4, sill: 0.9, head: 2.05 },
      { a: 10.6, b: 14.5, sill: 0.7, head: 2.25 },
    ]);
    this.run(2, "z", XW, Z_C1, ZD, wall, false, [{ a: 6.4, b: 9.1, sill: 0.55, head: 2.3 }]);
    this.run(2, "x", Z_C1, 0, X_B, wall, false, [
      { a: 1.9, b: 2.9, sill: 0, head: 2.15, door: true, swing: 1.2, id: "read-garden" },
    ]);
    this.run(2, "z", X_B, Z_C0, Z_C1, wall, false, [
      { a: 4.55, b: 5.25, sill: 0, head: 2.15, door: true, swing: -1.15, id: "g3-hall" },
    ]);
    this.run(2, "x", Z_C1, X_B, XW, wall, false, [
      { a: 5.5, b: 6.72, sill: 0, head: 2.15, door: true, swing: -1.15, id: "stair2" },
      { a: 12.0, b: 13.05, sill: 0, head: 2.15, door: true, swing: -1.15, id: "wood-hall" },
    ]);
    this.run(2, "z", X_ST0, Z_C1, ZD, wall, false, []);
    this.run(2, "z", X_ST1, Z_C1, ZD, wall, false, []);
    this.rail(2, 0.12, 0.12, X_B - 0.05, 0.12);
    this.rail(2, X_B - 0.08, 0.12, X_B - 0.08, Z_C0);
    this.rail(2, 0.12, 0.12, 0.12, Z_C1);
    // overlook balcony
    this.rail(2, X_B, Z_C0 + 0.1, XW - 0.1, Z_C0 + 0.1);

    // roofs
    const roof = (x0: number, x1: number, z0: number, z1: number) => {
      const m = this.addBox(
        this.roofGroup,
        mats.roof,
        (x0 + x1) / 2,
        0.08,
        (z0 + z1) / 2,
        x1 - x0 + 0.28,
        0.14,
        z1 - z0 + 0.28,
        true,
      );
      this.roofs.push(m);
    };
    roof(0, X_B, Z_C1, ZD);
    roof(X_ST0, X_ST1, Z_C1, ZD);
    roof(X_ST1, XW, Z_C1, ZD);
    roof(X_B, XW, Z_C0, Z_C1);

    // open the main entry by default
    const entry = this.doors.find((d) => d.id === "entry");
    if (entry) entry.target = -1.15;
  }

  private slabAroundStair(
    floor: FloorIndex,
    mat: THREE.Material,
    x0: number,
    x1: number,
    z0: number,
    z1: number,
  ) {
    const hx0 = Math.max(x0, STAIR.x0);
    const hx1 = Math.min(x1, STAIR.x1);
    const hz0 = Math.max(z0, STAIR.z0);
    const hz1 = Math.min(z1, STAIR.z1);
    const hole = hx1 - hx0 > 0.2 && hz1 - hz0 > 0.2;
    const put = (a: number, b: number, c: number, d: number) => {
      if (b - a < 0.04 || d - c < 0.04) return;
      this.addBox(this.slabs[floor], mat, (a + b) / 2, SLAB_HALF, (c + d) / 2, b - a, SLAB_T, d - c, false);
    };
    if (!hole) {
      put(x0, x1, z0, z1);
      return;
    }
    put(x0, x1, z0, hz0);
    put(x0, x1, hz1, z1);
    put(x0, hx0, hz0, hz1);
    put(hx1, x1, hz0, hz1);
  }

  private run(
    floor: FloorIndex,
    axis: "x" | "z",
    fixed: number,
    from: number,
    to: number,
    mat: THREE.Material,
    dollHide: boolean,
    gaps: { a: number; b: number; sill: number; head: number; door?: boolean; swing?: number; id?: string }[],
  ) {
    const parent = this.grow[floor];
    const height = WALL_H;
    const ordered = [...gaps].sort((p, q) => p.a - q.a);
    const spanBox = (a: number, b: number, y0: number, y1: number, material: THREE.Material, hide = dollHide) => {
      if (b - a < 0.02 || y1 - y0 < 0.02) return;
      const len = b - a;
      const h = y1 - y0;
      const x = axis === "x" ? (a + b) / 2 : fixed;
      const z = axis === "z" ? (a + b) / 2 : fixed;
      const w = axis === "x" ? len : WT;
      const d = axis === "z" ? len : WT;
      const mesh = this.addBox(parent, material, x, (y0 + y1) / 2, z, w, h, d);
      if (hide) this.shell.push(mesh);
    };
    let cursor = from;
    for (const g of ordered) {
      const a = Math.max(from, g.a);
      const b = Math.min(to, g.b);
      if (b <= a) continue;
      if (a > cursor) spanBox(cursor, a, 0, height, mat);
      if (g.sill > 0.02) spanBox(a, b, 0, g.sill, mat, false);
      if (g.head < height - 0.02) spanBox(a, b, g.head, height, mat, false);
      if (!g.door && g.head - g.sill > 0.2) {
        const x = axis === "x" ? (a + b) / 2 : fixed;
        const z = axis === "z" ? (a + b) / 2 : fixed;
        const w = axis === "x" ? b - a - 0.06 : 0.02;
        const d = axis === "z" ? b - a - 0.06 : 0.02;
        const glass = this.addBox(this.openings[floor], this.glassMat, x, (g.sill + g.head) / 2, z, Math.max(0.05, w), g.head - g.sill - 0.04, Math.max(0.05, d), false);
        glass.castShadow = false;
        // frame
        const frameMat = mat;
        spanBox(a, a + 0.04, g.sill, g.head, frameMat, false);
        spanBox(b - 0.04, b, g.sill, g.head, frameMat, false);
      }
      if (g.door) {
        this.addDoor(floor, axis, fixed, a, b, g.swing ?? -1.15, g.id ?? `d-${floor}-${a}`);
      }
      cursor = Math.max(cursor, b);
    }
    if (cursor < to) spanBox(cursor, to, 0, height, mat);

    const doors = ordered.filter((g) => g.door);
    let c = from;
    const parts: [number, number][] = [];
    for (const g of doors) {
      if (g.a > c) parts.push([c, g.a]);
      c = Math.max(c, g.b);
    }
    if (c < to) parts.push([c, to]);
    for (const [a, b] of parts) {
      if (b - a < 0.02) continue;
      if (axis === "x") {
        this.blocks.push({ floor, x0: a, x1: b, z0: fixed - WT / 2, z1: fixed + WT / 2 });
      } else {
        this.blocks.push({ floor, x0: fixed - WT / 2, x1: fixed + WT / 2, z0: a, z1: b });
      }
    }
  }

  private addDoor(floor: FloorIndex, axis: "x" | "z", fixed: number, a: number, b: number, swing: number, id: string) {
    const width = b - a;
    const h = 2.12;
    const pivot = new THREE.Group();
    const yaw = axis === "x" ? 0 : -Math.PI / 2;
    if (axis === "x") pivot.position.set(a, 0, fixed);
    else pivot.position.set(fixed, 0, a);
    pivot.rotation.y = yaw;
    const leaf = new THREE.Mesh(this.box(width - 0.04, h, 0.045), this.arch.wood);
    leaf.position.set(width / 2, h / 2, 0);
    leaf.castShadow = true;
    const band = new THREE.Mesh(this.box(width - 0.08, 0.08, 0.05), this.arch.sage);
    band.position.set(width / 2, 1.05, 0);
    const handle = new THREE.Mesh(this.box(0.03, 0.12, 0.06), this.arch.sage);
    handle.position.set(width - 0.12, 1.02, 0);
    leaf.userData.kind = "door";
    leaf.userData.door = id;
    pivot.add(leaf, band, handle);
    pivot.userData.kind = "door";
    pivot.userData.door = id;
    pivot.userData.swing = swing;
    this.openings[floor].add(pivot);
    const block: Block =
      axis === "x"
        ? { floor, x0: a, x1: b, z0: fixed - 0.18, z1: fixed + 0.18 }
        : { floor, x0: fixed - 0.18, x1: fixed + 0.18, z0: a, z1: b };
    this.doors.push({ id, floor, pivot, yaw, angle: 0, target: 0, block });
  }

  private rail(floor: FloorIndex, x0: number, z0: number, x1: number, z1: number) {
    const parent = this.grow[floor];
    const mat = this.arch.wood;
    const dx = x1 - x0;
    const dz = z1 - z0;
    const len = Math.hypot(dx, dz) || 0.01;
    const mx = (x0 + x1) / 2;
    const mz = (z0 + z1) / 2;
    const yaw = Math.atan2(dx, dz);
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, len), mat);
    top.position.set(mx, 0.92, mz);
    top.rotation.y = yaw;
    top.castShadow = true;
    const mid = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, len), mat);
    mid.position.set(mx, 0.48, mz);
    mid.rotation.y = yaw;
    parent.add(top, mid);
    const n = Math.max(2, Math.floor(len / 1.1));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.92, 0.06), mat);
      p.position.set(x0 + dx * t, 0.46, z0 + dz * t);
      p.castShadow = true;
      parent.add(p);
    }
    const thick = 0.12;
    if (Math.abs(dx) >= Math.abs(dz)) {
      this.blocks.push({ floor, x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: mz - thick, z1: mz + thick });
    } else {
      this.blocks.push({ floor, x0: mx - thick, x1: mx + thick, z0: Math.min(z0, z1), z1: Math.max(z0, z1) });
    }
  }

  private buildStairs(wood: THREE.Material) {
    const railMat = this.arch.wood;
    for (const level of [0, 1] as FloorIndex[]) {
      const parent = new THREE.Group();
      parent.visible = false;
      this.floors[level].add(parent);
      this.stairGroups[level] = parent;
      const base = level * HY;
      const westX = (STAIR.west0 + STAIR.west1) / 2;
      const eastX = (STAIR.east0 + STAIR.east1) / 2;
      const fw = STAIR.west1 - STAIR.west0;
      const ew = STAIR.east1 - STAIR.east0;
      for (let i = 0; i < STAIR.steps; i++) {
        const z0 = STAIR.zStart + i * STAIR.tread;
        const z1 = z0 + STAIR.tread;
        const yTop = (i + 1) * RISER;
        this.addBox(parent, wood, westX, yTop - RISER / 2, (z0 + z1) / 2, fw, RISER, STAIR.tread);
        this.treads.push({
          x0: STAIR.west0,
          x1: STAIR.west1,
          z0,
          z1,
          yTop: base + yTop,
          ySoffit: base + yTop - RISER,
        });
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 6), railMat);
        post.position.set(STAIR.west0 + 0.04, yTop + 0.35, (z0 + z1) / 2);
        parent.add(post);
      }
      this.slopeRail(parent, railMat, STAIR.west0 + 0.05, STAIR.zStart, STAIR.zStart + STAIR.steps * STAIR.tread, RISER, (STAIR.steps + 1) * RISER);
      this.slopeRail(parent, railMat, STAIR.west1 - 0.02, STAIR.zStart, STAIR.zStart + STAIR.steps * STAIR.tread, RISER, (STAIR.steps + 1) * RISER);
      for (let j = 0; j < STAIR.steps; j++) {
        const z1 = LAND_Z - j * STAIR.tread;
        const z0 = z1 - STAIR.tread;
        const yTop = (STAIR.steps + j + 1) * RISER;
        this.addBox(parent, wood, eastX, yTop - RISER / 2, (z0 + z1) / 2, ew, RISER, STAIR.tread);
        this.treads.push({
          x0: STAIR.east0,
          x1: STAIR.east1,
          z0,
          z1,
          yTop: base + yTop,
          ySoffit: base + yTop - RISER,
        });
      }
      this.slopeRail(parent, railMat, STAIR.east0 + 0.02, LAND_Z, STAIR.zStart, STAIR.steps * RISER + RISER, HY + RISER * 0.2);
      this.slopeRail(parent, railMat, STAIR.east1 - 0.04, LAND_Z, STAIR.zStart, STAIR.steps * RISER + RISER, HY);
      const landY = STAIR.steps * RISER;
      const landZ1 = Math.min(ZD - 0.28, LAND_Z + 2.05);
      this.addBox(
        parent,
        wood,
        (STAIR.west0 + STAIR.east1) / 2,
        landY - 0.06,
        (LAND_Z + landZ1) / 2,
        STAIR.east1 - STAIR.west0,
        0.12,
        landZ1 - LAND_Z,
      );
      this.treads.push({
        x0: STAIR.west0,
        x1: STAIR.east1,
        z0: LAND_Z,
        z1: landZ1,
        yTop: base + landY,
        ySoffit: base + landY - 0.12,
      });
      // railing on the open south edge of the landing, west of the return flight
      this.addBox(parent, railMat, (STAIR.west1 + STAIR.east0) / 2, landY + 0.4, LAND_Z, Math.max(0.2, STAIR.east0 - STAIR.west1), 0.8, 0.06);
      this.blocks.push({
        floor: level,
        x0: STAIR.west1,
        x1: STAIR.east0,
        z0: LAND_Z - 0.06,
        z1: LAND_Z + 0.1,
      });
    }
  }

  private slopeRail(
    parent: THREE.Object3D,
    mat: THREE.Material,
    x: number,
    z0: number,
    z1: number,
    y0: number,
    y1: number,
  ) {
    const ay = y0 + 0.72;
    const by = y1 + 0.72;
    const len = Math.hypot(z1 - z0, by - ay);
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, len, 8), mat);
    rail.position.set(x, (ay + by) / 2, (z0 + z1) / 2);
    rail.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, by - ay, z1 - z0).normalize(),
    );
    rail.castShadow = true;
    parent.add(rail);
  }

  private buildGardens(mats: ReturnType<KindergartenWorld["makeMaterials"]>) {
    const patch = (floor: FloorIndex, x: number, z: number, w: number, d: number) => {
      const m = this.addBox(this.slabs[floor], mats.grass, x, 0.03 + SLAB_T, z, w, 0.04, d, false);
      m.castShadow = false;
    };
    patch(1, 8.4, 2.35, 3.2, 2.2);
    patch(1, 13.2, 2.5, 3.4, 2.4);
    patch(2, 2.5, 2.3, 3.2, 2.6);
    const plantAt = (floor: FloorIndex, x: number, z: number, s: number) => {
      const parent = this.furn[floor];
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.28 * s, 6), mats.trunk);
      trunk.position.set(x, 0.14 * s, z);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.22 * s, 10, 8), mats.leaf);
      crown.position.set(x, 0.32 * s, z);
      crown.castShadow = true;
      parent.add(trunk, crown);
    };
    plantAt(1, 6.3, 1.1, 1.1);
    plantAt(1, 7.4, 3.2, 0.8);
    plantAt(1, 10.4, 0.8, 1.3);
    plantAt(1, 14.6, 3.3, 1);
    plantAt(1, 11.6, 3.4, 0.7);
    plantAt(2, 1.1, 1.2, 1);
    plantAt(2, 4.2, 3.5, 0.85);
    plantAt(2, 3.6, 0.7, 1.15);
    // deck boards
    for (let i = 0; i < 5; i++) {
      this.addBox(this.slabs[1], mats.deck, 6.4 + i * 0.28, 0.025 + SLAB_T, 2.2, 0.22, 0.03, 1.6, false);
    }
  }

  private buildLabels() {
    for (const r of ROOMS) {
      const sprite = this.makeLabel(r.name);
      sprite.position.set((r.x0 + r.x1) / 2, r.id.startsWith("hall") ? 0.35 : 1.45, (r.z0 + r.z1) / 2);
      this.floors[r.floor].add(sprite);
      sprite.userData.room = true;
      this.labels.push(sprite);
    }
  }

  private makeLabel(text: string) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const g = c.getContext("2d");
    if (g) {
      g.clearRect(0, 0, 512, 128);
      g.font = "600 64px 'WenQuanYi Zen Hei', sans-serif";
      g.fillStyle = "#3c4a38";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(text, 256, 64);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(2.4, 0.6, 1);
    return sprite;
  }

  private buildLamps() {
    const spots: { floor: FloorIndex; x: number; z: number; y?: number; dim?: boolean }[] = [
      { floor: 0, x: 2.6, z: 8.1 },
      { floor: 0, x: 12.6, z: 7.8 },
      { floor: 0, x: 2.5, z: 2.0 },
      { floor: 0, x: 9.2, z: 2.3 },
      { floor: 0, x: 13.3, z: 2.1 },
      { floor: 0, x: 6.4, z: 2.1 },
      { floor: 1, x: 2.6, z: 8.0 },
      { floor: 1, x: 12.6, z: 6.4 },
      { floor: 1, x: 12.5, z: 8.9 },
      { floor: 1, x: 2.6, z: 2.1 },
      { floor: 2, x: 2.6, z: 8.0 },
      { floor: 2, x: 12.6, z: 8.0 },
      { floor: 1, x: 10.2, z: 1.5, y: 0.42, dim: true },
      { floor: 2, x: 2.5, z: 1.7, y: 0.42, dim: true },
    ];
    for (const spot of spots) {
      const y = spot.y ?? 2.45;
      const light = new THREE.PointLight("#ffc98a", 0, spot.dim ? 3.2 : 6.5, 2);
      light.position.set(spot.x, y, spot.z);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(spot.dim ? 0.045 : 0.06, 8, 8), this.bulbMat);
      bulb.position.copy(light.position);
      this.floors[spot.floor].add(light, bulb);
      this.lamps.push({ light, bulb, floor: spot.floor, dim: spot.dim });
    }
  }

  private planLines() {
    const pts: number[] = [];
    const seg = (x0: number, z0: number, x1: number, z1: number) => {
      pts.push(x0, 0.06, z0, x1, 0.06, z1);
    };
    seg(0, 0, XW, 0);
    seg(XW, 0, XW, ZD);
    seg(XW, ZD, 0, ZD);
    seg(0, ZD, 0, 0);
    seg(0, Z_C0, XW, Z_C0);
    seg(0, Z_C1, XW, Z_C1);
    seg(X_B, 0, X_B, Z_C0);
    seg(X_L, 0, X_L, Z_C0);
    seg(X_K, 0, X_K, Z_C0);
    seg(X_ST0, Z_C1, X_ST0, ZD);
    seg(X_ST1, Z_C1, X_ST1, ZD);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const lines = new THREE.LineSegments(geo, this.planMat);
    this.scene.add(lines);
  }

  private loadFurniture() {
    const loader = new GLTFLoader();
    let done = 0;
    const total = ASSET_IDS.length;
    const step = () => {
      done += 1;
      this.hooks.onProgress(done / total);
      if (done >= total) {
        this.placeAll();
        this.ready = true;
        this.intro = 0;
        this.introOn = true;
        this.stepIndex = -1;
        this.resetBuild();
        this.syncStep();
        this.hooks.onReady();
      }
    };
    for (const id of ASSET_IDS) {
      loader.load(
        `/models/${id}.glb`,
        (gltf) => {
          gltf.scene.traverse((ch) => {
            const mesh = ch as THREE.Mesh;
            if (mesh.isMesh) this.projectUV(mesh);
          });
          this.templates[id] = gltf.scene;
          step();
        },
        undefined,
        () => {
          this.templates[id] = new THREE.Group();
          step();
        },
      );
    }
  }

  private placeAll() {
    this.furnBlocks = [];
    this.movables = [];
    this.movableById.clear();
    let saved: Record<string, { x: number; z: number; rot: number }> = {};
    try {
      saved = JSON.parse(localStorage.getItem("huixing-moves") || "{}") as Record<string, { x: number; z: number; rot: number }>;
    } catch {
      saved = {};
    }
    STATIC_ITEMS.forEach((p, i) => this.place(p, i, saved));
  }

  private place(p: Placement, index: number, saved: Record<string, { x: number; z: number; rot: number }>) {
    const src = this.templates[p.asset];
    if (!src) return;
    const obj = src.clone(true);
    const id = `${p.room}-${p.asset}-${index}`;
    const spec = CATALOG[p.asset];
    const pose = saved[id];
    const canMove = CLASS_ROOMS.has(p.room);
    obj.position.set(pose?.x ?? p.x, 0, pose?.z ?? p.z);
    obj.rotation.y = pose?.rot ?? p.rot;
    this.dress(obj);
    if (canMove) {
      obj.traverse((ch) => {
        ch.userData.movable = id;
      });
    }
    this.furn[p.floor].add(obj);
    const block = spec.block ? { floor: p.floor, x0: 0, x1: 0, z0: 0, z1: 0 } : null;
    if (block) this.furnBlocks.push(block);
    const item: Movable = {
      id,
      obj,
      floor: p.floor,
      w: spec.w,
      d: spec.d,
      block,
      homeX: p.x,
      homeZ: p.z,
      homeRot: p.rot,
    };
    this.syncBlock(item);
    if (!canMove) return;
    this.movables.push(item);
    this.movableById.set(id, item);
  }

  private projectUV(mesh: THREE.Mesh) {
    const geo = mesh.geometry;
    const pos = geo.getAttribute("position");
    const nor = geo.getAttribute("normal");
    if (!pos || !nor || geo.getAttribute("uv")) return;
    const uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const nx = Math.abs(nor.getX(i));
      const ny = Math.abs(nor.getY(i));
      const nz = Math.abs(nor.getZ(i));
      if (ny >= nx && ny >= nz) {
        uv[i * 2] = x;
        uv[i * 2 + 1] = z;
      } else if (nx >= nz) {
        uv[i * 2] = z;
        uv[i * 2 + 1] = y;
      } else {
        uv[i * 2] = x;
        uv[i * 2 + 1] = y;
      }
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  }

  private dress(root: THREE.Object3D) {
    root.traverse((ch) => {
      const mesh = ch as THREE.Mesh;
      if (!mesh.isMesh) return;
      const src = mesh.material as THREE.MeshStandardMaterial;
      const name = (src?.name || "").toLowerCase();
      mesh.material = this.bucket(name);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }

  private bucket(name: string) {
    const a = this.arch;
    if (name.includes("metal")) return a.metal;
    if (name.includes("glass")) return this.glassMat;
    if (name.includes("fabric")) return a.fabric;
    if (name.startsWith("bk")) {
      const n = Number(name.replace(/\D/g, "")) || 0;
      return this.books[n % this.books.length] ?? a.woodDark;
    }
    if (name.includes("sage") || name.includes("moss")) return a.sage;
    if (name.includes("clay")) return a.clay;
    if (name.includes("white")) return a.white;
    if (name.includes("dark")) return a.woodDark;
    return a.wood;
  }

  private syncBlock(item: Movable) {
    if (!item.block) return;
    const swap = Math.abs(Math.sin(item.obj.rotation.y)) > 0.7;
    const w = (swap ? item.d : item.w) / 2;
    const d = (swap ? item.w : item.d) / 2;
    item.block.floor = item.floor;
    item.block.x0 = item.obj.position.x - w;
    item.block.x1 = item.obj.position.x + w;
    item.block.z0 = item.obj.position.z - d;
    item.block.z1 = item.obj.position.z + d;
  }

  private persistMoves() {
    const data: Record<string, { x: number; z: number; rot: number }> = {};
    for (const m of this.movables) {
      data[m.id] = { x: m.obj.position.x, z: m.obj.position.z, rot: m.obj.rotation.y };
    }
    try {
      localStorage.setItem("huixing-moves", JSON.stringify(data));
    } catch {
      /* ignore quota */
    }
  }

  private aim(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private pickMovable(e: PointerEvent) {
    this.aim(e);
    const cam = this.view === "ortho" ? this.ortho : this.persp;
    this.ray.setFromCamera(this.pointer, cam);
    const hits = this.ray.intersectObjects(this.movables.map((m) => m.obj), true);
    for (const hit of hits) {
      let o: THREE.Object3D | null = hit.object;
      while (o) {
        const id = o.userData.movable as string | undefined;
        if (id && this.movableById.has(id)) return this.movableById.get(id) ?? null;
        o = o.parent;
      }
    }
    return null;
  }

  private floorPoint(e: PointerEvent, floor: FloorIndex) {
    this.aim(e);
    const cam = this.view === "ortho" ? this.ortho : this.persp;
    this.ray.setFromCamera(this.pointer, cam);
    this.dragPlane.set(new THREE.Vector3(0, 1, 0), -this.floors[floor].position.y);
    return this.ray.ray.intersectPlane(this.dragPlane, this.dragHit) ? this.dragHit : null;
  }

  private clampMove(floor: FloorIndex, x: number, z: number) {
    x = Math.max(0.35, Math.min(XW - 0.35, x));
    z = Math.max(0.3, Math.min(ZD - 0.3, z));
    if (floor > 0 && x > STAIR.x0 + 0.25 && x < STAIR.x1 - 0.25 && z > STAIR.z0 + 0.25 && z < STAIR.z1 - 0.25) {
      const dx0 = Math.abs(x - STAIR.x0);
      const dx1 = Math.abs(x - STAIR.x1);
      const dz0 = Math.abs(z - STAIR.z0);
      const dz1 = Math.abs(z - STAIR.z1);
      const m = Math.min(dx0, dx1, dz0, dz1);
      if (m === dx0) x = STAIR.x0 - 0.2;
      else if (m === dx1) x = STAIR.x1 + 0.2;
      else if (m === dz0) z = STAIR.z0 - 0.2;
      else z = STAIR.z1 + 0.2;
    }
    if (floor === 2 && !(x <= X_B || z >= Z_C0 - 0.05)) z = Z_C0 + 0.35;
    return { x, z };
  }

  private select(item: Movable | null) {
    this.selected = item;
    if (!item) {
      this.ring.visible = false;
      this.ring.removeFromParent();
      return;
    }
    item.obj.add(this.ring);
    this.ring.visible = true;
    const s = Math.max(item.w, item.d) * 0.85;
    this.ring.scale.set(s, s, 1);
  }

  private footprint(p: Placement): Block | null {
    const spec = CATALOG[p.asset];
    if (!spec.block) return null;
    const swap = Math.abs(Math.sin(p.rot)) > 0.7;
    const w = swap ? spec.d : spec.w;
    const d = swap ? spec.w : spec.d;
    return { floor: p.floor, x0: p.x - w / 2, x1: p.x + w / 2, z0: p.z - d / 2, z1: p.z + d / 2 };
  }

  private rebuildFurnBlocks() {
    this.furnBlocks = [];
    for (const p of STATIC_ITEMS) {
      const b = this.footprint(p);
      if (b) this.furnBlocks.push(b);
    }
  }


  private bind() {
    this.onDown = (e: PointerEvent) => {
      this.drag.x = e.clientX;
      this.drag.y = e.clientY;
      this.moved = 0;
      if (this.view === "fps") {
        this.drag.mode = "look";
        if (document.pointerLockElement !== this.canvas) this.canvas.requestPointerLock();
        return;
      }
      if (!this.introOn && e.button === 0 && !e.shiftKey) {
        const hit = this.pickMovable(e);
        if (hit) {
          this.drag.mode = "furn";
          this.dragFurn = hit;
          this.select(hit);
          const pt = this.floorPoint(e, hit.floor);
          this.grab.x = pt ? pt.x - hit.obj.position.x : 0;
          this.grab.z = pt ? pt.z - hit.obj.position.z : 0;
          return;
        }
      }
      this.grabbed = true;
      this.drag.mode = e.button === 2 || e.shiftKey ? "pan" : "orbit";
    };
    this.onMove = (e: PointerEvent) => {
      if (this.view === "fps" && document.pointerLockElement === this.canvas) {
        this.yaw -= e.movementX * 0.0022;
        this.pitch -= e.movementY * 0.0022;
        this.pitch = Math.max(-1.15, Math.min(1.15, this.pitch));
        return;
      }
      if (this.drag.mode === "furn" && this.dragFurn) {
        const dx = e.clientX - this.drag.x;
        const dy = e.clientY - this.drag.y;
        this.drag.x = e.clientX;
        this.drag.y = e.clientY;
        this.moved += Math.abs(dx) + Math.abs(dy);
        const pt = this.floorPoint(e, this.dragFurn.floor);
        if (!pt) return;
        const next = this.clampMove(this.dragFurn.floor, pt.x - this.grab.x, pt.z - this.grab.z);
        this.dragFurn.obj.position.x = next.x;
        this.dragFurn.obj.position.y = 0.08;
        this.dragFurn.obj.position.z = next.z;
        this.syncBlock(this.dragFurn);
        return;
      }
      if (!this.drag.mode) return;
      const dx = e.clientX - this.drag.x;
      const dy = e.clientY - this.drag.y;
      this.drag.x = e.clientX;
      this.drag.y = e.clientY;
      this.moved += Math.abs(dx) + Math.abs(dy);
      if (this.drag.mode === "orbit") {
        this.theta -= dx * 0.005;
        this.phi = Math.max(0.22, Math.min(1.35, this.phi - dy * 0.004));
      } else if (this.drag.mode === "pan") {
        const s = 0.012 * (this.view === "ortho" ? this.orthoHalf / 8 : this.radius / 20);
        this.target.x -= dx * s;
        this.target.z += dy * s;
      }
    };
    this.onUp = (e: PointerEvent) => {
      const was = this.moved;
      const furn = this.drag.mode === "furn";
      this.drag.mode = "";
      if (furn) {
        if (this.dragFurn) this.dragFurn.obj.position.y = 0;
        this.dragFurn = null;
        this.persistMoves();
      }
      if (was < 5) this.click(e);
    };
    this.onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (this.view === "ortho") this.orthoHalf = Math.max(3.2, Math.min(16, this.orthoHalf * (e.deltaY > 0 ? 1.08 : 0.92)));
      else if (this.view === "fps") this.pitch = Math.max(-1.1, Math.min(1.1, this.pitch - Math.sign(e.deltaY) * 0.08));
      else this.radius = Math.max(6, Math.min(48, this.radius * (e.deltaY > 0 ? 1.08 : 0.92)));
    };
    this.onKeyDown = (e: KeyboardEvent) => {
      this.keys.add(e.code);
      if (this.selected && this.view !== "fps" && (e.code === "KeyQ" || e.code === "KeyE")) {
        this.selected.obj.rotation.y += e.code === "KeyQ" ? 0.18 : -0.18;
        this.syncBlock(this.selected);
        this.persistMoves();
        e.preventDefault();
      }
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
    };
    this.onKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.code);
    };
    this.onBlur = () => {
      this.keys.clear();
      this.stick.x = 0;
      this.stick.y = 0;
    };
    this.onMenu = (e: Event) => e.preventDefault();
    this.onLock = () => {
      /* pointer lock state is read live */
    };
    this.canvas.addEventListener("pointerdown", this.onDown);
    window.addEventListener("pointermove", this.onMove);
    window.addEventListener("pointerup", this.onUp);
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onBlur);
    this.canvas.addEventListener("contextmenu", this.onMenu);
    document.addEventListener("pointerlockchange", this.onLock);
  }

  private click(e: PointerEvent) {
    if (this.view !== "fps") {
      const furn = this.pickMovable(e);
      if (furn) {
        this.select(furn);
        const room = this.roomAt(furn.floor, furn.obj.position.x, furn.obj.position.z);
        if (room) this.hooks.onRoom(room);
        return;
      }
      this.select(null);
    }
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const cam = this.view === "ortho" ? this.ortho : this.persp;
    if (this.view === "fps" && document.pointerLockElement === this.canvas) {
      this.pointer.set(0, 0);
    }
    this.ray.setFromCamera(this.pointer, cam);
    const hits = this.ray.intersectObjects(this.floors, true);
    for (const hit of hits) {
      let o: THREE.Object3D | null = hit.object;
      while (o) {
        if (o.userData.kind === "door" && typeof o.userData.door === "string") {
          this.toggleDoor(o.userData.door as string);
          return;
        }
        o = o.parent;
      }
      const floor = this.floorFromY(hit.point.y);
      const room = this.roomAt(floor, hit.point.x, hit.point.z);
      if (room) {
        this.hooks.onRoom(room);
        return;
      }
    }
  }

  private toggleDoor(id: string) {
    const d = this.doors.find((door) => door.id === id);
    if (!d) return;
    const open = d.pivot.userData.swing as number | undefined;
    const swing = open ?? this.swingOf(d);
    d.target = Math.abs(d.target) > 0.4 ? 0 : swing;
  }

  private swingOf(d: Door) {
    // stored on first creation via angle target sign in userData set below
    return (d.pivot.userData.swing as number) || -1.15;
  }

  private floorFromY(y: number): FloorIndex {
    let best: FloorIndex = 0;
    let score = Infinity;
    for (let i = 0; i < 3; i++) {
      const ly = y - this.floors[i].position.y;
      if (ly < -0.35 || ly > WALL_H + 0.45) continue;
      const s = Math.abs(ly - 1.1);
      if (s < score) {
        score = s;
        best = i as FloorIndex;
      }
    }
    return best;
  }

  private roomAt(floor: FloorIndex, x: number, z: number) {
    let best: string | null = null;
    let margin = -Infinity;
    for (const r of ROOMS) {
      if (r.floor !== floor) continue;
      const m = Math.min(x - r.x0, r.x1 - x, z - r.z0, r.z1 - z);
      if (m > margin) {
        margin = m;
        best = r.id;
      }
    }
    return margin > -0.25 ? best : null;
  }

  private frame() {
    if (this.disposed) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.clock += dt;
    if (this.introOn && this.ready && !this.introHold) {
      this.intro += dt;
      this.applyIntro();
      if (this.intro >= this.introDur) this.finishIntro();
    }
    this.animateFloors(dt);
    this.animateDoors(dt);
    this.animateTweens();
    if (this.view === "fps") this.movePlayer(dt);
    this.applyCamera();
    this.applyVisibility();
    this.applyTime();
    const cam = this.view === "ortho" ? this.ortho : this.persp;
    this.renderer.clippingPlanes = this.view === "cut" ? [this.clip] : [];
    this.renderer.render(this.scene, cam);
  }

  private applyIntro() {
    const ease = (t: number) => {
      const x = Math.max(0, Math.min(1, t));
      return x * x * (3 - 2 * x);
    };
    const growAt = (id: (typeof BUILD_STEPS)[number]["id"], dur: number) => ease((this.intro - stepAt(id)) / dur);
    for (let i = 0; i < 3; i++) {
      const slabId = (["slab0", "slab1", "slab2"] as const)[i];
      const wallId = (["wall0", "wall1", "wall2"] as const)[i];
      const openId = (["open0", "open1", "open2"] as const)[i];
      this.slabs[i].scale.y = Math.max(0.001, growAt(slabId, 1.05));
      this.grow[i].scale.y = Math.max(0.001, growAt(wallId, WALL_GROW[i]));
      const open = growAt(openId, 0.7);
      this.openings[i].visible = open > 0.08;
      this.openings[i].position.y = (1 - open) * -0.12;
      const furnLag = ease((this.intro - stepAt("furn") - i * 0.22) / 1.15);
      this.furn[i].visible = furnLag > 0.04;
      this.furn[i].position.y = (1 - furnLag) * -0.7;
    }
    for (const level of [0, 1] as const) {
      const id = level === 0 ? "stair0" : "stair1";
      const stair = growAt(id, 0.85);
      const group = this.stairGroups[level];
      if (!group) continue;
      group.visible = stair > 0.05;
      group.position.y = (1 - stair) * -0.9;
    }
    this.roofReveal = growAt("roof", 1.15);
    this.roofGroup.scale.y = Math.max(0.001, this.roofReveal);
    this.planMat.opacity = 1 - ease((this.intro - stepAt("wall0")) / 1.5);
    if (!this.grabbed && this.view === "doll") this.driveBuildCamera(ease);
    this.syncStep();
  }

  private driveBuildCamera(ease: (t: number) => number) {
    const endR = this.exploded ? 42 : 30;
    const endY = this.exploded ? 6.2 : 2.4;
    const keys = [
      { t: 0, phi: 0.42, theta: 0.2, radius: 22, tx: XW / 2, ty: 0.3, tz: ZD / 2 },
      { t: stepAt("wall0"), phi: 0.98, theta: 0.62, radius: 20, tx: 7.2, ty: 2.6, tz: 5.2 },
      { t: stepAt("slab2"), phi: 1.06, theta: 1.05, radius: 26, tx: 7.6, ty: 5.4, tz: 5.0 },
      { t: stepAt("roof"), phi: 0.76, theta: 1.28, radius: 28, tx: 7.8, ty: 6.6, tz: 5.0 },
      { t: stepAt("settle"), phi: 0.9, theta: 1.75, radius: 32, tx: 7.6, ty: 6.2, tz: 5.2 },
      { t: INTRO_DUR, phi: 1.02, theta: 2.55, radius: endR, tx: 7.6, ty: endY, tz: 5.2 },
    ];
    let a = keys[0];
    let b = keys[keys.length - 1];
    const t = this.intro;
    for (let i = 0; i < keys.length - 1; i++) {
      if (t >= keys[i].t && t <= keys[i + 1].t) {
        a = keys[i];
        b = keys[i + 1];
        break;
      }
    }
    const k = ease((t - a.t) / Math.max(0.001, b.t - a.t));
    this.phi = a.phi + (b.phi - a.phi) * k;
    this.theta = a.theta + (b.theta - a.theta) * k;
    this.radius = a.radius + (b.radius - a.radius) * k;
    this.target.set(a.tx + (b.tx - a.tx) * k, a.ty + (b.ty - a.ty) * k, a.tz + (b.tz - a.tz) * k);
  }

  private syncStep() {
    let index = 0;
    for (let i = 0; i < BUILD_STEPS.length; i++) if (this.intro >= BUILD_STEPS[i].t) index = i;
    if (index === this.stepIndex) return;
    this.stepIndex = index;
    this.hooks.onStep(index);
  }

  private animateFloors(dt: number) {
    const k = 1 - Math.exp(-5 * dt);
    for (let i = 0; i < 3; i++) {
      const built = !this.introOn || this.intro >= stepAt("settle");
      const dest = i * HY + (built && this.exploded ? i * LIFT : 0);
      if (this.view === "fps") this.floors[i].position.y = i * HY;
      else this.floors[i].position.y += (dest - this.floors[i].position.y) * k;
    }
  }

  private animateDoors(dt: number) {
    const k = 1 - Math.exp(-10 * dt);
    for (const d of this.doors) {
      d.angle += (d.target - d.angle) * k;
      d.pivot.rotation.y = d.yaw + d.angle;
    }
  }

  private animateTweens() {
    for (const tw of this.tweens) {
      const t = (this.clock - tw.start - tw.delay) / tw.dur;
      if (t < 0) continue;
      const x = Math.max(0, Math.min(1, t));
      const e = x * x * (3 - 2 * x);
      tw.obj.position.set(
        tw.fromX + (tw.toX - tw.fromX) * e,
        tw.fromY + (tw.toY - tw.fromY) * e,
        tw.fromZ + (tw.toZ - tw.fromZ) * e,
      );
      tw.obj.rotation.y = tw.fromRot + (tw.toRot - tw.fromRot) * e;
      tw.obj.scale.setScalar(tw.fromS + (tw.toS - tw.fromS) * e);
    }
    this.tweens = this.tweens.filter((tw) => {
      if (this.clock < tw.start + tw.delay + tw.dur) return true;
      if (tw.remove) tw.obj.parent?.remove(tw.obj);
      return false;
    });
  }

  private held() {
    return this.qaKeys ?? this.keys;
  }

  private movePlayer(dt: number) {
    const keys = this.held();
    const forwardX = -Math.sin(this.yaw);
    const forwardZ = -Math.cos(this.yaw);
    const rightX = Math.cos(this.yaw);
    const rightZ = -Math.sin(this.yaw);
    let mx = 0;
    let mz = 0;
    if (keys.has("KeyW") || keys.has("ArrowUp")) {
      mx += forwardX;
      mz += forwardZ;
    }
    if (keys.has("KeyS") || keys.has("ArrowDown")) {
      mx -= forwardX;
      mz -= forwardZ;
    }
    if (keys.has("KeyD") || keys.has("ArrowRight")) {
      mx += rightX;
      mz += rightZ;
    }
    if (keys.has("KeyA") || keys.has("ArrowLeft")) {
      mx -= rightX;
      mz -= rightZ;
    }
    mx += this.stick.x * rightX + this.stick.y * forwardX;
    mz += this.stick.x * rightZ + this.stick.y * forwardZ;
    const mag = Math.hypot(mx, mz);
    const sprint = keys.has("ShiftLeft") || keys.has("ShiftRight");
    const spd = (this.eye === "child" ? 1.35 : 1.55) * (sprint ? 1.85 : 1);
    if (mag > 1) {
      mx /= mag;
      mz /= mag;
    }
    const stepX = mx * spd * dt;
    const stepZ = mz * spd * dt;
    this.speed = Math.hypot(stepX, stepZ) / Math.max(dt, 0.0001);
    this.tryStep(stepX, 0);
    this.tryStep(0, stepZ);
    if (keys.has("Space")) this.pitch = Math.min(1.05, this.pitch + dt * 0.8);
    this.yaw -= this.lookDX * 0.005;
    this.pitch -= this.lookDY * 0.005;
    this.lookDX = 0;
    this.lookDY = 0;
    this.pitch = Math.max(-1.15, Math.min(1.15, this.pitch));
  }

  private tryStep(dx: number, dz: number) {
    const nx = this.foot.x + dx;
    const nz = this.foot.z + dz;
    const y = this.support(nx, nz, this.foot.y);
    if (y == null) return;
    if (Math.abs(y - this.foot.y) > 0.42 && y > this.foot.y) return;
    const floor = Math.max(0, Math.min(2, Math.floor((y + 0.25) / HY))) as FloorIndex;
    if (this.hits(floor, nx, nz)) return;
    if (this.headroom(nx, nz, y)) return;
    this.foot.x = nx;
    this.foot.z = nz;
    this.foot.y = y;
  }

  private support(x: number, z: number, foot: number) {
    let best: number | null = null;
    let bestAbs = 0.55;
    const consider = (y: number) => {
      const d = y - foot;
      if (d > 0.38) return;
      if (d < -0.55) return;
      const ad = Math.abs(d);
      if (ad < bestAbs) {
        bestAbs = ad;
        best = y;
      }
    };
    if (this.onSlab(0, x, z)) consider(0);
    if (this.onSlab(1, x, z)) consider(HY);
    if (this.onSlab(2, x, z)) consider(HY * 2);
    if (z < 0 && z > -2.3 && x > 4.1 && x < 9.3) consider(0);
    for (const t of this.treads) {
      if (x < t.x0 || x > t.x1 || z < t.z0 || z > t.z1) continue;
      consider(t.yTop);
    }
    return best;
  }

  private onSlab(level: FloorIndex, x: number, z: number) {
    if (level === 0) return x >= -0.05 && x <= XW + 0.05 && z >= -0.05 && z <= ZD + 0.05;
    if (level === 1) {
      if (x < 0 || x > XW || z < 0 || z > ZD) return false;
      return !this.inHole(x, z);
    }
    const west = x >= 0 && x <= X_B && z >= 0 && z <= ZD;
    const mid = x >= X_B && x <= X_ST1 && z >= Z_C0 && z <= ZD;
    const east = x >= X_ST1 && x <= XW && z >= Z_C0 && z <= ZD;
    if (!(west || mid || east)) return false;
    return !this.inHole(x, z);
  }

  private inHole(x: number, z: number) {
    return x > STAIR.x0 + 0.02 && x < STAIR.x1 - 0.02 && z > STAIR.z0 + 0.02 && z < STAIR.z1 - 0.02;
  }

  private hits(floor: FloorIndex, x: number, z: number) {
    const test = (b: Block) => {
      if (b.floor !== floor) return false;
      const cx = Math.max(b.x0, Math.min(x, b.x1));
      const cz = Math.max(b.z0, Math.min(z, b.z1));
      return (x - cx) ** 2 + (z - cz) ** 2 < PLAYER_R * PLAYER_R;
    };
    if (this.blocks.some(test)) return true;
    if (this.furnBlocks.some(test)) return true;
    for (const d of this.doors) {
      if (Math.abs(d.angle) > 0.55) continue;
      if (test(d.block)) return true;
    }
    return false;
  }

  private headroom(x: number, z: number, foot: number) {
    const need = this.eye === "child" ? 1.2 : 1.7;
    let low = Infinity;
    for (const t of this.treads) {
      if (x < t.x0 || x > t.x1 || z < t.z0 || z > t.z1) continue;
      if (t.ySoffit > foot + 0.05) low = Math.min(low, t.ySoffit);
    }
    return low - foot < need;
  }

  private applyVisibility() {
    const solo = this.view === "ortho" || this.view === "cut";
    for (let i = 0; i < 3; i++) {
      const show = this.introOn ? true : this.focus === "all" ? (solo ? i === 0 : true) : this.focus === i;
      this.floors[i].visible = show;
    }
    const hideShell = this.view === "doll" && (!this.introOn || this.intro >= stepAt("settle"));
    for (const m of this.shell) m.visible = !hideShell;
    const showRoof =
      (this.introOn && this.roofReveal > 0.04 && this.intro < stepAt("settle")) ||
      (!this.introOn && this.ceilings && this.view !== "ortho" && this.view !== "cut");
    for (const m of this.roofs) m.visible = showRoof;
    const labelsOn = !this.introOn || this.intro >= stepAt("furn");
    for (const s of this.labels) {
      s.visible = this.view !== "fps" && (s.userData.room ? labelsOn : true);
    }
    const fl = this.focus === "all" ? 0 : this.focus;
    const cutY = this.floors[fl].position.y + 1.35;
    this.clip.constant = cutY;
    const lamp = sampleTime(this.timeOfDay).lamp;
    const camPos = (this.view === "ortho" ? this.ortho : this.persp).position;
    for (const L of this.lamps) {
      const vis = this.floors[L.floor].visible;
      const bulbsOn = !this.introOn || this.intro >= stepAt("furn");
      L.bulb.visible = Boolean(vis && bulbsOn);
      L.light.getWorldPosition(this.tmp);
      const near = this.view !== "fps" || this.tmp.distanceTo(camPos) < 11;
      L.light.intensity = vis && near ? lamp * (L.dim ? 1.6 : 4.6) : 0;
    }
    this.bulbMat.emissiveIntensity = lamp * 1.4;
    this.glassMat.emissiveIntensity = lamp * 0.45;
  }

  private applyTime() {
    const t = sampleTime(this.timeOfDay);
    const sky = new THREE.Color(t.skyA).lerp(new THREE.Color(t.skyB), t.f);
    const ground = new THREE.Color(t.groundA).lerp(new THREE.Color(t.groundB), t.f);
    this.scene.background = sky;
    if (this.scene.fog instanceof THREE.Fog) this.scene.fog.color.copy(sky);
    this.hemi.color.copy(sky);
    this.hemi.groundColor.copy(ground);
    const decor = DECORS.find((item) => item.id === this.decorId) ?? DECORS[0];
    this.hemi.groundColor.lerp(new THREE.Color(decor.floor), this.timeOfDay > 4.2 ? 0.12 : 0.42);
    this.hemi.intensity = t.amb;
    this.sun.intensity = t.sun;
    this.sun.color.set(t.elev < 12 ? "#ffb27a" : "#fff2dd");
    const elev = THREE.MathUtils.degToRad(t.elev);
    const az = THREE.MathUtils.degToRad(t.az);
    const dist = 36;
    this.sun.position.set(
      Math.cos(elev) * Math.sin(az) * dist + XW / 2,
      Math.sin(elev) * dist + 4,
      Math.cos(elev) * Math.cos(az) * dist + ZD / 2,
    );
  }

  private applyCamera() {
    if (this.view === "fps") {
      const eye = this.eye === "child" ? 1.12 : 1.6;
      this.persp.position.set(this.foot.x, this.foot.y + eye, this.foot.z);
      this.persp.rotation.order = "YXZ";
      this.persp.rotation.y = this.yaw;
      this.persp.rotation.x = this.pitch;
      return;
    }
    if (this.view === "ortho") {
      const aspect = this.persp.aspect || 1;
      const h = this.orthoHalf;
      this.ortho.left = -h * aspect;
      this.ortho.right = h * aspect;
      this.ortho.top = h;
      this.ortho.bottom = -h;
      this.ortho.position.set(this.target.x, 50, this.target.z);
      this.ortho.up.set(0, 0, 1);
      this.ortho.lookAt(this.target.x, 0, this.target.z);
      this.ortho.updateProjectionMatrix();
      return;
    }
    const sinP = Math.sin(this.phi);
    this.persp.position.set(
      this.target.x + this.radius * sinP * Math.sin(this.theta),
      this.target.y + this.radius * Math.cos(this.phi),
      this.target.z + this.radius * sinP * Math.cos(this.theta),
    );
    this.persp.up.set(0, 1, 0);
    this.persp.lookAt(this.target);
  }

  private installProbe() {
    const self = this;
    window.__controlsTest = {
      getYaw: () => self.yaw,
      getSpeed: () => self.speed,
      getPos: () => ({ x: self.foot.x, y: self.foot.y, z: self.foot.z }),
      setKeys: (codes: string[] | null) => {
        self.qaKeys = codes ? new Set(codes) : null;
      },
      setPose: (x: number, z: number, yaw: number) => {
        self.foot.set(x, 0, z);
        const y = self.support(x, z, 0);
        self.foot.y = y ?? 0;
        self.yaw = yaw;
        self.pitch = 0;
      },
      setView: (v: ViewMode) => self.setView(v),
      screenOf: (id: string) => {
        const item = self.movableById.get(id);
        if (!item) return null;
        const v = new THREE.Vector3();
        item.obj.getWorldPosition(v);
        v.y += 0.35;
        const cam = self.view === "ortho" ? self.ortho : self.persp;
        v.project(cam);
        const rect = self.canvas.getBoundingClientRect();
        return {
          x: rect.left + (v.x * 0.5 + 0.5) * rect.width,
          y: rect.top + (-v.y * 0.5 + 0.5) * rect.height,
          wx: item.obj.position.x,
          wz: item.obj.position.z,
          floor: item.floor,
        };
      },
      findItem: (room: string) => self.movables.find((m) => m.id.startsWith(room + "-"))?.id ?? null,
      buildAt: (t: number) => {
        self.ready = true;
        self.introOn = true;
        self.introHold = true;
        self.intro = t;
        self.stepIndex = -1;
        self.applyIntro();
      },
      buildState: () => ({
        t: Number(self.intro.toFixed(2)),
        on: self.introOn,
        step: self.stepIndex,
        slab: self.slabs.map((s) => Number(s.scale.y.toFixed(2))),
        wall: self.grow.map((g) => Number(g.scale.y.toFixed(2))),
        open: self.openings.map((o) => o.visible),
        stair: self.stairGroups.map((s) => s.visible),
        roof: Number(self.roofReveal.toFixed(2)),
        furn: self.furn.map((f) => f.visible),
        shell: self.shell[0]?.visible ?? false,
      }),
    };
    // remember swing on pivots
    for (const d of this.doors) {
      if (!d.pivot.userData.swing) d.pivot.userData.swing = this.doorSwingFromId(d);
      if (d.id === "entry" || d.id.startsWith("stair") || d.id === "hall-garden" || d.id === "flex-garden") {
        d.target = d.pivot.userData.swing as number;
      }
    }
  }

  private doorSwingFromId(d: Door) {
    // Defaults were passed at creation; recover from the initial target if set.
    if (d.id === "entry" || d.id.startsWith("stair") || d.id === "service" || d.id === "wc") return -1.15;
    if (d.id === "b-hall" || d.id === "office-hall" || d.id === "kit-hall" || d.id === "flex-hall" || d.id === "hall-garden" || d.id === "b-lobby")
      return 1.15;
    if (d.id === "read-garden") return 1.2;
    return -1.15;
  }
}

const SLAB_T = 0.16;
const SLAB_HALF = SLAB_T / 2;

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      getPos: () => { x: number; y: number; z: number };
      setKeys: (codes: string[] | null) => void;
      setPose: (x: number, z: number, yaw: number) => void;
      setView: (v: ViewMode) => void;
      screenOf: (id: string) => { x: number; y: number; wx: number; wz: number; floor: FloorIndex } | null;
      findItem: (room: string) => string | null;
      buildAt: (t: number) => void;
      buildState: () => {
        t: number;
        on: boolean;
        step: number;
        slab: number[];
        wall: number[];
        open: boolean[];
        stair: boolean[];
        roof: number;
        furn: boolean[];
        shell: boolean;
      };
    };
  }
}

export function describeRoom(id: string) {
  const room = roomById(id);
  if (!room) return null;
  const m = roomMetrics(room);
  const rows = STATIC_ITEMS.filter((p) => p.room === id);
  const seen = new Set<string>();
  const furniture: { name: string; file: string }[] = [];
  for (const p of rows) {
    if (seen.has(p.asset)) continue;
    seen.add(p.asset);
    furniture.push({ name: CATALOG[p.asset].name, file: p.asset });
  }
  return {
    ...room,
    area: m.area,
    span: m.span,
    deep: m.deep,
    clear: m.clear,
    furniture,
    sceneName: "教学布置",
    change: room.note,
  };
}
