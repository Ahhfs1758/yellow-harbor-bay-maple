export const HY = 3;
export const SLAB = 0.16;
export const WALL_H = HY - SLAB;
export const WT = 0.14;
export const XW = 15.6;
export const ZD = 10.2;
export const X_B = 5.3;
export const X_L = 7.5;
export const X_K = 11;
export const X_ST0 = 5.3;
export const X_ST1 = 9.6;
export const Z_C0 = 4.2;
export const Z_C1 = 5.45;
export const Z_SPLIT = 7.75;

export const STAIR = {
  x0: X_ST0,
  x1: X_ST1,
  z0: Z_C1,
  z1: ZD,
  west0: 5.52,
  west1: 6.72,
  east0: 8.12,
  east1: 9.35,
  zStart: 5.48,
  tread: 0.268,
  steps: 9,
};

export const RISER = HY / (STAIR.steps * 2);
export const LAND_Z = STAIR.zStart + STAIR.steps * STAIR.tread;

export type FloorIndex = 0 | 1 | 2;
export type ViewMode = "doll" | "ortho" | "cut" | "fps";

export type RoomDef = {
  id: string;
  name: string;
  floor: FloorIndex;
  x0: number;
  x1: number;
  z0: number;
  z1: number;
  suit: string;
  note: string;
};

export const ROOMS: RoomDef[] = [
  { id: "func", name: "功能教室", floor: 0, x0: 0, x1: X_B, z0: Z_C1, z1: ZD, suit: "手工与小组教学", note: "与普通教室之间以楼梯相隔，南侧直通过道。" },
  { id: "stair", name: "楼梯间", floor: 0, x0: X_ST0, x1: X_ST1, z0: Z_C1, z1: ZD, suit: "垂直交通", note: "之字折返双跑。西跑向北，东跑折返向南，出入口均朝南侧过道。高侧窗引入北向天光。" },
  { id: "wc", name: "卫生间", floor: 0, x0: 7.28, x1: 9.42, z0: 5.58, z1: 7.52, suit: "如厕与盥洗", note: "利用上部折跑下方的净高，南侧经缓冲门厅进入过道，不穿越儿童主教室。" },
  { id: "classA", name: "普通教室 A", floor: 0, x0: X_ST1, x1: XW, z0: Z_C1, z1: ZD, suit: "日常集体教学", note: "位于楼梯东侧，南门连接过道。" },
  { id: "hall", name: "过道", floor: 0, x0: 0, x1: XW, z0: Z_C0, z1: Z_C1, suit: "教学与后勤分流", note: "东西向交通核。西接两间教室，中部进楼梯与卫生间，东端直通厨房。" },
  { id: "classB", name: "普通教室 B", floor: 0, x0: 0, x1: X_B, z0: 0, z1: Z_C0, suit: "日常集体教学", note: "北门入过道，东门入门厅，是儿童到达后的第一间教室。" },
  { id: "lobby", name: "门厅", floor: 0, x0: X_B, x1: X_L, z0: 0, z1: Z_C0, suit: "到达与告别", note: "南向主入口正对塔子山公园。家长在此停留，再进入办公室或教室。" },
  { id: "office", name: "教室办公室", floor: 0, x0: X_L, x1: X_K, z0: 0, z1: Z_C0, suit: "教师办公与家长沟通", note: "北门对过道，与厨房并置但不直接连通，避免备餐流线穿过办公。" },
  { id: "kitchen", name: "厨房", floor: 0, x0: X_K, x1: XW, z0: 0, z1: Z_C0, suit: "备餐与后勤", note: "北侧由过道送达，东侧另设后勤入口，与儿童主入口分开。" },
  { id: "flex", name: "备用教室", floor: 1, x0: 0, x1: X_B, z0: 0, z1: Z_C0, suit: "日常小组教学", note: "二层西南角的普通教室。朝南看见公园，北门进南廊，东门进露台花园。" },
  { id: "garden2", name: "二层花园", floor: 1, x0: X_B, x1: XW, z0: 0, z1: Z_C0, suit: "户外自然活动", note: "南向开敞，直接对着塔子山公园的树冠。可从南廊进入。" },
  { id: "hall2", name: "二层南廊", floor: 1, x0: 0, x1: XW, z0: Z_C0, z1: Z_C1, suit: "室内外渗透", note: "楼梯在此落地。廊南是花园与备用教室，廊北是教室。" },
  { id: "class1", name: "教室一", floor: 1, x0: 0, x1: X_B, z0: Z_C1, z1: ZD, suit: "日常集体教学", note: "围绕交通核的西侧教室。" },
  { id: "class2", name: "教室二", floor: 1, x0: X_ST1, x1: XW, z0: Z_C1, z1: Z_SPLIT, suit: "日常集体教学", note: "南侧大玻璃面向花园。" },
  { id: "func2", name: "功能室", floor: 1, x0: X_ST1, x1: XW, z0: Z_SPLIT, z1: ZD, suit: "手工与展示", note: "可向南串联教室二，间接连通前侧活动区。" },
  { id: "garden3", name: "屋顶花园", floor: 2, x0: 0, x1: X_B, z0: 0, z1: Z_C1, suit: "自然观察", note: "露台花园，北接阅读室，东侧可转入南廊俯看二层树冠。" },
  { id: "read", name: "家长阅读室", floor: 2, x0: 0, x1: X_B, z0: Z_C1, z1: ZD, suit: "安静陪伴", note: "偏北、照度更柔和，适合停留与亲子共读。" },
  { id: "hall3", name: "三层南廊", floor: 2, x0: X_B, x1: XW, z0: Z_C0, z1: Z_C1, suit: "俯看花园", note: "南缘只有木栏杆，视线落向二层花园。楼梯与木工教室都从这里进入。" },
  { id: "wood", name: "木工教室", floor: 2, x0: X_ST1, x1: XW, z0: Z_C1, z1: ZD, suit: "儿童实践", note: "东、北向采光，配置操作台、工具墙与安全储物。" },
];

export function roomById(id: string) {
  return ROOMS.find((r) => r.id === id) ?? null;
}

export function roomMetrics(r: RoomDef) {
  const w = Math.abs(r.x1 - r.x0);
  const d = Math.abs(r.z1 - r.z0);
  const innerW = Math.max(0.6, w - WT);
  const innerD = Math.max(0.6, d - WT);
  return {
    span: Math.max(innerW, innerD),
    deep: Math.min(innerW, innerD),
    area: innerW * innerD,
    clear: WALL_H,
  };
}

export type AssetId =
  | "child-desk"
  | "child-chair"
  | "podium"
  | "blackboard"
  | "wall-cabinet"
  | "cart"
  | "mat"
  | "toy-shelf"
  | "teacher-desk"
  | "office-chair"
  | "bookcase"
  | "file-cab"
  | "guest-chair"
  | "round-table"
  | "craft-table"
  | "teach-cab"
  | "rack"
  | "plinth"
  | "kitchen-cab"
  | "counter"
  | "fridge"
  | "prep"
  | "sink"
  | "toilet"
  | "urinal"
  | "stall"
  | "sofa"
  | "low-shelf"
  | "bed"
  | "nightstand"
  | "wood-bench"
  | "outdoor-set";

export const ASSET_IDS: AssetId[] = [
  "child-desk", "child-chair", "podium", "blackboard", "wall-cabinet", "cart", "mat", "toy-shelf",
  "teacher-desk", "office-chair", "bookcase", "file-cab", "guest-chair", "round-table",
  "craft-table", "teach-cab", "rack", "plinth",
  "kitchen-cab", "counter", "fridge", "prep",
  "sink", "toilet", "urinal", "stall",
  "sofa", "low-shelf", "bed", "nightstand",
  "wood-bench", "outdoor-set",
];

export const CATALOG: Record<AssetId, { name: string; w: number; d: number; block: boolean }> = {
  "child-desk": { name: "儿童课桌", w: 0.72, d: 0.5, block: true },
  "child-chair": { name: "儿童椅", w: 0.36, d: 0.36, block: true },
  podium: { name: "教师讲台桌", w: 1.0, d: 0.58, block: true },
  blackboard: { name: "黑板", w: 1.95, d: 0.2, block: true },
  "wall-cabinet": { name: "墙面收纳柜", w: 1.22, d: 0.4, block: true },
  cart: { name: "移动教具车", w: 0.7, d: 0.46, block: true },
  mat: { name: "儿童阅读垫", w: 1.36, d: 0.96, block: false },
  "toy-shelf": { name: "玩具展示架", w: 0.92, d: 0.32, block: true },
  "teacher-desk": { name: "教师办公桌", w: 1.42, d: 0.72, block: true },
  "office-chair": { name: "办公椅", w: 0.52, d: 0.52, block: true },
  bookcase: { name: "高书柜", w: 0.88, d: 0.34, block: true },
  "file-cab": { name: "矮文件柜", w: 0.5, d: 0.52, block: true },
  "guest-chair": { name: "会客椅", w: 0.56, d: 0.56, block: true },
  "round-table": { name: "圆形会议桌", w: 1.12, d: 1.12, block: true },
  "craft-table": { name: "手工桌", w: 1.52, d: 0.78, block: true },
  "teach-cab": { name: "教具柜", w: 1.08, d: 0.44, block: true },
  rack: { name: "材料收纳架", w: 0.92, d: 0.42, block: true },
  plinth: { name: "低矮展示台", w: 0.82, d: 0.5, block: true },
  "kitchen-cab": { name: "橱柜", w: 1.66, d: 0.66, block: true },
  counter: { name: "料理台", w: 1.48, d: 0.68, block: true },
  fridge: { name: "冰箱", w: 0.68, d: 0.7, block: true },
  prep: { name: "备餐桌", w: 1.22, d: 0.72, block: true },
  sink: { name: "洗手台", w: 0.76, d: 0.54, block: true },
  toilet: { name: "马桶", w: 0.42, d: 0.62, block: true },
  urinal: { name: "小便器", w: 0.38, d: 0.32, block: true },
  stall: { name: "卫生间隔断", w: 1.25, d: 0.95, block: true },
  sofa: { name: "阅读沙发", w: 1.6, d: 0.82, block: true },
  "low-shelf": { name: "矮书架", w: 1.18, d: 0.34, block: true },
  bed: { name: "单人床", w: 1.08, d: 2.05, block: true },
  nightstand: { name: "床头柜", w: 0.48, d: 0.42, block: true },
  "wood-bench": { name: "木工桌", w: 1.58, d: 0.74, block: true },
  "outdoor-set": { name: "户外儿童桌椅", w: 1.35, d: 1.25, block: true },
};

export type Placement = {
  asset: AssetId;
  floor: FloorIndex;
  room: string;
  x: number;
  z: number;
  rot: number;
};

function desks(room: string, floor: FloorIndex, cols: number[], rows: number[], rot = 0): Placement[] {
  const out: Placement[] = [];
  for (const x of cols) {
    for (const z of rows) {
      out.push({ asset: "child-desk", floor, room, x, z, rot });
      out.push({ asset: "child-chair", floor, room, x, z: z - 0.42, rot });
    }
  }
  return out;
}

export const STATIC_ITEMS: Placement[] = [
  ...desks("classA", 0, [11.15, 12.55, 13.95], [6.55, 7.45]),
  { asset: "blackboard", floor: 0, room: "classA", x: 12.6, z: 9.95, rot: 0 },
  { asset: "podium", floor: 0, room: "classA", x: 12.6, z: 8.55, rot: 0 },
  { asset: "wall-cabinet", floor: 0, room: "classA", x: 9.95, z: 8.3, rot: Math.PI / 2 },
  { asset: "toy-shelf", floor: 0, room: "classA", x: 15.15, z: 6.35, rot: -Math.PI / 2 },
  { asset: "mat", floor: 0, room: "classA", x: 14.15, z: 9.15, rot: 0 },
  { asset: "cart", floor: 0, room: "classA", x: 10.15, z: 6.4, rot: 0 },

  ...desks("classB", 0, [1.35, 2.85], [1.35, 2.35]),
  { asset: "blackboard", floor: 0, room: "classB", x: 2.4, z: 3.9, rot: 0 },
  { asset: "podium", floor: 0, room: "classB", x: 2.4, z: 3.15, rot: 0 },
  { asset: "toy-shelf", floor: 0, room: "classB", x: 0.4, z: 2.4, rot: Math.PI / 2 },
  { asset: "mat", floor: 0, room: "classB", x: 4.2, z: 1.15, rot: 0 },

  { asset: "craft-table", floor: 0, room: "func", x: 2.5, z: 7.3, rot: 0 },
  { asset: "craft-table", floor: 0, room: "func", x: 2.5, z: 8.7, rot: 0 },
  { asset: "teach-cab", floor: 0, room: "func", x: 0.45, z: 8.4, rot: Math.PI / 2 },
  { asset: "rack", floor: 0, room: "func", x: 4.85, z: 8.6, rot: -Math.PI / 2 },
  { asset: "plinth", floor: 0, room: "func", x: 4.6, z: 6.3, rot: 0 },
  { asset: "cart", floor: 0, room: "func", x: 1.2, z: 6.2, rot: 0.2 },

  { asset: "teacher-desk", floor: 0, room: "office", x: 8.6, z: 2.55, rot: Math.PI },
  { asset: "office-chair", floor: 0, room: "office", x: 8.6, z: 1.85, rot: Math.PI },
  { asset: "bookcase", floor: 0, room: "office", x: 7.85, z: 3.55, rot: 0 },
  { asset: "file-cab", floor: 0, room: "office", x: 10.5, z: 3.55, rot: 0 },
  { asset: "round-table", floor: 0, room: "office", x: 9.7, z: 1.15, rot: 0 },
  { asset: "guest-chair", floor: 0, room: "office", x: 9.05, z: 1.15, rot: Math.PI / 2 },
  { asset: "guest-chair", floor: 0, room: "office", x: 10.4, z: 1.15, rot: -Math.PI / 2 },

  { asset: "kitchen-cab", floor: 0, room: "kitchen", x: 14.95, z: 2.3, rot: -Math.PI / 2 },
  { asset: "counter", floor: 0, room: "kitchen", x: 13.4, z: 3.55, rot: Math.PI },
  { asset: "fridge", floor: 0, room: "kitchen", x: 11.55, z: 3.55, rot: Math.PI },
  { asset: "prep", floor: 0, room: "kitchen", x: 13.1, z: 1.55, rot: 0 },

  { asset: "sink", floor: 0, room: "wc", x: 7.7, z: 7.05, rot: 0 },
  { asset: "urinal", floor: 0, room: "wc", x: 8.35, z: 7.15, rot: 0 },
  { asset: "toilet", floor: 0, room: "wc", x: 9.05, z: 6.85, rot: 0 },
  { asset: "stall", floor: 0, room: "wc", x: 8.55, z: 6.15, rot: 0 },

  ...desks("class1", 1, [1.4, 3.0], [6.7, 7.7]),
  { asset: "blackboard", floor: 1, room: "class1", x: 2.5, z: 9.9, rot: 0 },
  { asset: "podium", floor: 1, room: "class1", x: 2.5, z: 8.7, rot: 0 },
  { asset: "wall-cabinet", floor: 1, room: "class1", x: 0.4, z: 7.4, rot: Math.PI / 2 },
  { asset: "mat", floor: 1, room: "class1", x: 4.15, z: 9.2, rot: 0 },

  ...desks("class2", 1, [11.3, 13.2], [6.15]),
  { asset: "blackboard", floor: 1, room: "class2", x: 12.6, z: 7.45, rot: 0 },
  { asset: "podium", floor: 1, room: "class2", x: 14.5, z: 6.3, rot: 0 },
  { asset: "toy-shelf", floor: 1, room: "class2", x: 15.2, z: 6.0, rot: -Math.PI / 2 },

  { asset: "craft-table", floor: 1, room: "func2", x: 12.4, z: 8.7, rot: 0 },
  { asset: "teach-cab", floor: 1, room: "func2", x: 15.15, z: 9.2, rot: -Math.PI / 2 },
  { asset: "rack", floor: 1, room: "func2", x: 10.15, z: 9.15, rot: Math.PI / 2 },
  { asset: "plinth", floor: 1, room: "func2", x: 14.4, z: 8.0, rot: 0 },

  { asset: "outdoor-set", floor: 1, room: "garden2", x: 8.2, z: 2.1, rot: 0.2 },
  { asset: "outdoor-set", floor: 1, room: "garden2", x: 12.8, z: 1.5, rot: -0.4 },

  { asset: "sofa", floor: 2, room: "read", x: 2.5, z: 7.3, rot: Math.PI },
  { asset: "low-shelf", floor: 2, room: "read", x: 2.4, z: 9.7, rot: 0 },
  { asset: "guest-chair", floor: 2, room: "read", x: 4.4, z: 7.6, rot: -Math.PI / 2 },
  { asset: "bookcase", floor: 2, room: "read", x: 0.4, z: 8.2, rot: Math.PI / 2 },

  { asset: "wood-bench", floor: 2, room: "wood", x: 12.3, z: 7.4, rot: 0 },
  { asset: "wood-bench", floor: 2, room: "wood", x: 12.3, z: 9.0, rot: 0 },
  { asset: "rack", floor: 2, room: "wood", x: 15.15, z: 8.3, rot: -Math.PI / 2 },
  { asset: "wall-cabinet", floor: 2, room: "wood", x: 10.2, z: 9.5, rot: Math.PI / 2 },
  { asset: "plinth", floor: 2, room: "wood", x: 14.6, z: 6.15, rot: 0 },

  { asset: "outdoor-set", floor: 2, room: "garden3", x: 2.6, z: 2.2, rot: 0.3 },

  ...desks("flex", 1, [1.45, 3.05], [1.55]),
  { asset: "blackboard", floor: 1, room: "flex", x: 3.85, z: 3.78, rot: 0 },
  { asset: "podium", floor: 1, room: "flex", x: 3.85, z: 3.05, rot: 0 },
  { asset: "toy-shelf", floor: 1, room: "flex", x: 0.42, z: 2.15, rot: Math.PI / 2 },
  { asset: "mat", floor: 1, room: "flex", x: 4.35, z: 1.15, rot: 0 },
  { asset: "cart", floor: 1, room: "flex", x: 4.55, z: 2.55, rot: 0.2 },
];

export type Decor = {
  id: string;
  name: string;
  note: string;
  image: string;
  wall: string;
  floor: string;
  wood: string;
  woodDark: string;
  fabric: string;
  sage: string;
  stone: string;
  grass: string;
  roof: string;
  accent: string;
};

export const DECORS: Decor[] = [
  { id: "oak", name: "暖白原木", note: "白墙、浅橡木、亚麻。", image: "/decor/oak.jpg", wall: "#f4efe4", floor: "#d7b07a", wood: "#c4924e", woodDark: "#7a5230", fabric: "#efe4d4", sage: "#6e7d62", stone: "#d5cfc4", grass: "#7f9a78", roof: "#efe6d8", accent: "#c98962" },
  { id: "bamboo", name: "竹青教室", note: "竹色墙面，浅木与苔绿织物。", image: "/decor/bamboo.jpg", wall: "#cfe6b8", floor: "#d2c07a", wood: "#b7a04a", woodDark: "#3e5c30", fabric: "#c5dcb0", sage: "#2f6a38", stone: "#c5d2bc", grass: "#5f8a48", roof: "#d5e8c8", accent: "#6e9a42" },
  { id: "mist", name: "塔子山晨雾", note: "灰绿石灰墙，雾色木地板。", image: "/decor/mist.jpg", wall: "#c5d2ce", floor: "#b3b0a4", wood: "#9a968c", woodDark: "#5c5a56", fabric: "#d4dbd8", sage: "#6e8680", stone: "#b7beb8", grass: "#8aa890", roof: "#dce6e2", accent: "#8aa098" },
  { id: "charcoal", name: "白墙黛木", note: "白墙配炭色木作。", image: "/decor/charcoal.jpg", wall: "#f6f4f0", floor: "#a48468", wood: "#4a433e", woodDark: "#241f1c", fabric: "#ddd6cc", sage: "#3c4640", stone: "#c8c0b6", grass: "#667a60", roof: "#e8e4dc", accent: "#6a6258" },
  { id: "clay", name: "赤陶暖阳", note: "陶土墙，蜜色橡木。", image: "/decor/clay.jpg", wall: "#e7b088", floor: "#e09858", wood: "#d06a32", woodDark: "#7a3418", fabric: "#f0c4a4", sage: "#c45a38", stone: "#e4c8b0", grass: "#8a9a5c", roof: "#f0c8a8", accent: "#d4542c" },
  { id: "forest", name: "森系深木", note: "胡桃木与苔藓绿。", image: "/decor/forest.jpg", wall: "#b7c8a4", floor: "#6a4630", wood: "#4a2e1c", woodDark: "#24160e", fabric: "#a8bc98", sage: "#245032", stone: "#b4baa8", grass: "#3f5c38", roof: "#c5d4b4", accent: "#5a7040" },
  { id: "cream", name: "奶油教室", note: "奶油墙，浅橡与麻布。", image: "/decor/cream.jpg", wall: "#f6e4bc", floor: "#f0d4a0", wood: "#e8c98a", woodDark: "#c4a06a", fabric: "#fbe6c4", sage: "#e4cba0", stone: "#f0e4d0", grass: "#b4c498", roof: "#fbf0d8", accent: "#f0b090" },
  { id: "stone", name: "青石园", note: "矿物涂料墙，青石与橡木。", image: "/decor/stone.jpg", wall: "#c8c4b4", floor: "#8a8478", wood: "#7a7064", woodDark: "#3e3c38", fabric: "#d4cfc0", sage: "#5e6a60", stone: "#8a8680", grass: "#6e8468", roof: "#ddd8cc", accent: "#6e6a62" },
  { id: "ginkgo", name: "银杏秋色", note: "暖橡木，银杏黄点缀。", image: "/decor/ginkgo.jpg", wall: "#f6edd0", floor: "#e8b040", wood: "#e09a18", woodDark: "#8a5410", fabric: "#f6d48a", sage: "#d4a010", stone: "#ead8b4", grass: "#c6a04a", roof: "#f8e8c0", accent: "#f0b000" },
  { id: "ink", name: "水墨留白", note: "纸白墙，炭色木家具。", image: "/decor/ink.jpg", wall: "#f2f1ee", floor: "#6a6762", wood: "#2e2c2a", woodDark: "#141312", fabric: "#bdbab4", sage: "#4a4e4c", stone: "#b0aea8", grass: "#4e5a4e", roof: "#e8e6e2", accent: "#2a2a2a" },
  { id: "lamp", name: "夜读暖灯", note: "暖橡木与琥珀织物。", image: "/decor/lamp.jpg", wall: "#f0c498", floor: "#e09a58", wood: "#d4843a", woodDark: "#6a3818", fabric: "#f0bc88", sage: "#c07840", stone: "#e4d0b4", grass: "#6a7050", roof: "#f3d4b0", accent: "#f0a040" },
  { id: "nordic", name: "北欧白橡", note: "白橡、浅灰墙、亚麻。", image: "/decor/nordic.jpg", wall: "#e2e6ea", floor: "#f2e4d0", wood: "#efe0cc", woodDark: "#c8b49a", fabric: "#eceae6", sage: "#b7c2bc", stone: "#d8dcde", grass: "#a8c0a8", roof: "#f4f5f6", accent: "#d0c6bc" },
];

export const TIME_STOPS = [
  { name: "早晨", weather: "薄雾，东向微光", sky: "#f3d7c4", ground: "#cbb89a", elev: 14, az: -78, sun: 0.85, amb: 0.46, lamp: 0.18 },
  { name: "上午", weather: "晴朗，冷白昼光", sky: "#e7f0f2", ground: "#d5ddd4", elev: 40, az: -32, sun: 1.15, amb: 0.55, lamp: 0 },
  { name: "正午", weather: "高照，影子很短", sky: "#e4eef3", ground: "#d7e0d8", elev: 68, az: 6, sun: 1.22, amb: 0.5, lamp: 0 },
  { name: "下午", weather: "暖黄侧光", sky: "#f4ead4", ground: "#e2d2b4", elev: 34, az: 46, sun: 1.02, amb: 0.48, lamp: 0 },
  { name: "黄昏", weather: "窗边余温", sky: "#f0b48a", ground: "#c98962", elev: 7, az: 78, sun: 0.62, amb: 0.3, lamp: 0.55 },
  { name: "夜晚", weather: "室内灯火", sky: "#1b2433", ground: "#141a16", elev: -14, az: 100, sun: 0.04, amb: 0.07, lamp: 1 },
];

export function sampleTime(t: number) {
  const x = Math.min(5, Math.max(0, t));
  const i = Math.min(4, Math.floor(x));
  const f = x - i;
  const a = TIME_STOPS[i];
  const b = TIME_STOPS[i + 1];
  const mix = (p: number, q: number) => p + (q - p) * f;
  return {
    name: f < 0.5 ? a.name : b.name,
    weather: f < 0.5 ? a.weather : b.weather,
    skyA: a.sky,
    skyB: b.sky,
    groundA: a.ground,
    groundB: b.ground,
    f,
    elev: mix(a.elev, b.elev),
    az: mix(a.az, b.az),
    sun: mix(a.sun, b.sun),
    amb: mix(a.amb, b.amb),
    lamp: mix(a.lamp, b.lamp),
  };
}
