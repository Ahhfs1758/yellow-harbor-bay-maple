import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Layers, i as Maximize2, n as RotateCcw, o as Eye, r as PersonStanding, s as EyeOff } from "../_libs/lucide-react.mjs";
import { A as RingGeometry, C as OrthographicCamera, D as PointLight, E as PlaneGeometry, F as SpriteMaterial, I as TextureLoader, L as Vector2, M as Scene, N as SphereGeometry, O as Raycaster, P as Sprite, R as Vector3, S as Object3D, T as Plane, _ as LinearSRGBColorSpace, a as CanvasTexture, b as MeshBasicMaterial, c as CylinderGeometry, d as Fog, f as Group, g as LineSegments, h as LineBasicMaterial, i as BufferGeometry, j as SRGBColorSpace, k as RepeatWrapping, l as DirectionalLight, m as InstancedMesh, n as BoxGeometry, o as CircleGeometry, p as HemisphereLight, r as BufferAttribute, s as Color, t as GLTFLoader, u as Float32BufferAttribute, v as MathUtils, w as PerspectiveCamera, x as MeshStandardMaterial, y as Mesh, z as WebGLRenderer } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dg2LPzNH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WALL_H = 2.84;
var WT = .14;
var XW = 15.6;
var ZD = 10.2;
var X_B = 5.3;
var X_L = 7.5;
var X_ST0 = 5.3;
var X_ST1 = 9.6;
var Z_C0 = 4.2;
var Z_C1 = 5.45;
var Z_SPLIT = 7.75;
var STAIR = {
	x0: X_ST0,
	x1: X_ST1,
	z0: Z_C1,
	z1: ZD,
	west0: 5.52,
	west1: 6.72,
	east0: 8.12,
	east1: 9.35,
	zStart: 5.48,
	tread: .268,
	steps: 9
};
var RISER = 3 / (STAIR.steps * 2);
var LAND_Z = STAIR.zStart + STAIR.steps * STAIR.tread;
var ROOMS = [
	{
		id: "func",
		name: "功能教室",
		floor: 0,
		x0: 0,
		x1: X_B,
		z0: Z_C1,
		z1: ZD,
		suit: "手工与小组教学",
		note: "与普通教室之间以楼梯相隔，南侧直通过道。"
	},
	{
		id: "stair",
		name: "楼梯间",
		floor: 0,
		x0: X_ST0,
		x1: X_ST1,
		z0: Z_C1,
		z1: ZD,
		suit: "垂直交通",
		note: "之字折返双跑。西跑向北，东跑折返向南，出入口均朝南侧过道。高侧窗引入北向天光。"
	},
	{
		id: "wc",
		name: "卫生间",
		floor: 0,
		x0: 7.28,
		x1: 9.42,
		z0: 5.58,
		z1: 7.52,
		suit: "如厕与盥洗",
		note: "利用上部折跑下方的净高，南侧经缓冲门厅进入过道，不穿越儿童主教室。"
	},
	{
		id: "classA",
		name: "普通教室 A",
		floor: 0,
		x0: X_ST1,
		x1: XW,
		z0: Z_C1,
		z1: ZD,
		suit: "日常集体教学",
		note: "位于楼梯东侧，南门连接过道。"
	},
	{
		id: "hall",
		name: "过道",
		floor: 0,
		x0: 0,
		x1: XW,
		z0: Z_C0,
		z1: Z_C1,
		suit: "教学与后勤分流",
		note: "东西向交通核。西接两间教室，中部进楼梯与卫生间，东端直通厨房。"
	},
	{
		id: "classB",
		name: "普通教室 B",
		floor: 0,
		x0: 0,
		x1: X_B,
		z0: 0,
		z1: Z_C0,
		suit: "日常集体教学",
		note: "北门入过道，东门入门厅，是儿童到达后的第一间教室。"
	},
	{
		id: "lobby",
		name: "门厅",
		floor: 0,
		x0: X_B,
		x1: X_L,
		z0: 0,
		z1: Z_C0,
		suit: "到达与告别",
		note: "南向主入口正对塔子山公园。家长在此停留，再进入办公室或教室。"
	},
	{
		id: "office",
		name: "教室办公室",
		floor: 0,
		x0: X_L,
		x1: 11,
		z0: 0,
		z1: Z_C0,
		suit: "教师办公与家长沟通",
		note: "北门对过道，与厨房并置但不直接连通，避免备餐流线穿过办公。"
	},
	{
		id: "kitchen",
		name: "厨房",
		floor: 0,
		x0: 11,
		x1: XW,
		z0: 0,
		z1: Z_C0,
		suit: "备餐与后勤",
		note: "北侧由过道送达，东侧另设后勤入口，与儿童主入口分开。"
	},
	{
		id: "flex",
		name: "备用教室",
		floor: 1,
		x0: 0,
		x1: X_B,
		z0: 0,
		z1: Z_C0,
		suit: "日常小组教学",
		note: "二层西南角的普通教室。朝南看见公园，北门进南廊，东门进露台花园。"
	},
	{
		id: "garden2",
		name: "二层花园",
		floor: 1,
		x0: X_B,
		x1: XW,
		z0: 0,
		z1: Z_C0,
		suit: "户外自然活动",
		note: "南向开敞，直接对着塔子山公园的树冠。可从南廊进入。"
	},
	{
		id: "hall2",
		name: "二层南廊",
		floor: 1,
		x0: 0,
		x1: XW,
		z0: Z_C0,
		z1: Z_C1,
		suit: "室内外渗透",
		note: "楼梯在此落地。廊南是花园与备用教室，廊北是教室。"
	},
	{
		id: "class1",
		name: "教室一",
		floor: 1,
		x0: 0,
		x1: X_B,
		z0: Z_C1,
		z1: ZD,
		suit: "日常集体教学",
		note: "围绕交通核的西侧教室。"
	},
	{
		id: "class2",
		name: "教室二",
		floor: 1,
		x0: X_ST1,
		x1: XW,
		z0: Z_C1,
		z1: Z_SPLIT,
		suit: "日常集体教学",
		note: "南侧大玻璃面向花园。"
	},
	{
		id: "func2",
		name: "功能室",
		floor: 1,
		x0: X_ST1,
		x1: XW,
		z0: Z_SPLIT,
		z1: ZD,
		suit: "手工与展示",
		note: "可向南串联教室二，间接连通前侧活动区。"
	},
	{
		id: "garden3",
		name: "屋顶花园",
		floor: 2,
		x0: 0,
		x1: X_B,
		z0: 0,
		z1: Z_C1,
		suit: "自然观察",
		note: "露台花园，北接阅读室，东侧可转入南廊俯看二层树冠。"
	},
	{
		id: "read",
		name: "家长阅读室",
		floor: 2,
		x0: 0,
		x1: X_B,
		z0: Z_C1,
		z1: ZD,
		suit: "安静陪伴",
		note: "偏北、照度更柔和，适合停留与亲子共读。"
	},
	{
		id: "hall3",
		name: "三层南廊",
		floor: 2,
		x0: X_B,
		x1: XW,
		z0: Z_C0,
		z1: Z_C1,
		suit: "俯看花园",
		note: "南缘只有木栏杆，视线落向二层花园。楼梯与木工教室都从这里进入。"
	},
	{
		id: "wood",
		name: "木工教室",
		floor: 2,
		x0: X_ST1,
		x1: XW,
		z0: Z_C1,
		z1: ZD,
		suit: "儿童实践",
		note: "东、北向采光，配置操作台、工具墙与安全储物。"
	}
];
function roomById(id) {
	return ROOMS.find((r) => r.id === id) ?? null;
}
function roomMetrics(r) {
	const w = Math.abs(r.x1 - r.x0);
	const d = Math.abs(r.z1 - r.z0);
	const innerW = Math.max(.6, w - WT);
	const innerD = Math.max(.6, d - WT);
	return {
		span: Math.max(innerW, innerD),
		deep: Math.min(innerW, innerD),
		area: innerW * innerD,
		clear: WALL_H
	};
}
var ASSET_IDS = [
	"child-desk",
	"child-chair",
	"podium",
	"blackboard",
	"wall-cabinet",
	"cart",
	"mat",
	"toy-shelf",
	"teacher-desk",
	"office-chair",
	"bookcase",
	"file-cab",
	"guest-chair",
	"round-table",
	"craft-table",
	"teach-cab",
	"rack",
	"plinth",
	"kitchen-cab",
	"counter",
	"fridge",
	"prep",
	"sink",
	"toilet",
	"urinal",
	"stall",
	"sofa",
	"low-shelf",
	"bed",
	"nightstand",
	"wood-bench",
	"outdoor-set"
];
var CATALOG = {
	"child-desk": {
		name: "儿童课桌",
		w: .72,
		d: .5,
		block: true
	},
	"child-chair": {
		name: "儿童椅",
		w: .36,
		d: .36,
		block: true
	},
	podium: {
		name: "教师讲台桌",
		w: 1,
		d: .58,
		block: true
	},
	blackboard: {
		name: "黑板",
		w: 1.95,
		d: .2,
		block: true
	},
	"wall-cabinet": {
		name: "墙面收纳柜",
		w: 1.22,
		d: .4,
		block: true
	},
	cart: {
		name: "移动教具车",
		w: .7,
		d: .46,
		block: true
	},
	mat: {
		name: "儿童阅读垫",
		w: 1.36,
		d: .96,
		block: false
	},
	"toy-shelf": {
		name: "玩具展示架",
		w: .92,
		d: .32,
		block: true
	},
	"teacher-desk": {
		name: "教师办公桌",
		w: 1.42,
		d: .72,
		block: true
	},
	"office-chair": {
		name: "办公椅",
		w: .52,
		d: .52,
		block: true
	},
	bookcase: {
		name: "高书柜",
		w: .88,
		d: .34,
		block: true
	},
	"file-cab": {
		name: "矮文件柜",
		w: .5,
		d: .52,
		block: true
	},
	"guest-chair": {
		name: "会客椅",
		w: .56,
		d: .56,
		block: true
	},
	"round-table": {
		name: "圆形会议桌",
		w: 1.12,
		d: 1.12,
		block: true
	},
	"craft-table": {
		name: "手工桌",
		w: 1.52,
		d: .78,
		block: true
	},
	"teach-cab": {
		name: "教具柜",
		w: 1.08,
		d: .44,
		block: true
	},
	rack: {
		name: "材料收纳架",
		w: .92,
		d: .42,
		block: true
	},
	plinth: {
		name: "低矮展示台",
		w: .82,
		d: .5,
		block: true
	},
	"kitchen-cab": {
		name: "橱柜",
		w: 1.66,
		d: .66,
		block: true
	},
	counter: {
		name: "料理台",
		w: 1.48,
		d: .68,
		block: true
	},
	fridge: {
		name: "冰箱",
		w: .68,
		d: .7,
		block: true
	},
	prep: {
		name: "备餐桌",
		w: 1.22,
		d: .72,
		block: true
	},
	sink: {
		name: "洗手台",
		w: .76,
		d: .54,
		block: true
	},
	toilet: {
		name: "马桶",
		w: .42,
		d: .62,
		block: true
	},
	urinal: {
		name: "小便器",
		w: .38,
		d: .32,
		block: true
	},
	stall: {
		name: "卫生间隔断",
		w: 1.25,
		d: .95,
		block: true
	},
	sofa: {
		name: "阅读沙发",
		w: 1.6,
		d: .82,
		block: true
	},
	"low-shelf": {
		name: "矮书架",
		w: 1.18,
		d: .34,
		block: true
	},
	bed: {
		name: "单人床",
		w: 1.08,
		d: 2.05,
		block: true
	},
	nightstand: {
		name: "床头柜",
		w: .48,
		d: .42,
		block: true
	},
	"wood-bench": {
		name: "木工桌",
		w: 1.58,
		d: .74,
		block: true
	},
	"outdoor-set": {
		name: "户外儿童桌椅",
		w: 1.35,
		d: 1.25,
		block: true
	}
};
function desks(room, floor, cols, rows, rot = 0) {
	const out = [];
	for (const x of cols) for (const z of rows) {
		out.push({
			asset: "child-desk",
			floor,
			room,
			x,
			z,
			rot
		});
		out.push({
			asset: "child-chair",
			floor,
			room,
			x,
			z: z - .42,
			rot
		});
	}
	return out;
}
var STATIC_ITEMS = [
	...desks("classA", 0, [
		11.15,
		12.55,
		13.95
	], [6.55, 7.45]),
	{
		asset: "blackboard",
		floor: 0,
		room: "classA",
		x: 12.6,
		z: 9.95,
		rot: 0
	},
	{
		asset: "podium",
		floor: 0,
		room: "classA",
		x: 12.6,
		z: 8.55,
		rot: 0
	},
	{
		asset: "wall-cabinet",
		floor: 0,
		room: "classA",
		x: 9.95,
		z: 8.3,
		rot: Math.PI / 2
	},
	{
		asset: "toy-shelf",
		floor: 0,
		room: "classA",
		x: 15.15,
		z: 6.35,
		rot: -Math.PI / 2
	},
	{
		asset: "mat",
		floor: 0,
		room: "classA",
		x: 14.15,
		z: 9.15,
		rot: 0
	},
	{
		asset: "cart",
		floor: 0,
		room: "classA",
		x: 10.15,
		z: 6.4,
		rot: 0
	},
	...desks("classB", 0, [1.35, 2.85], [1.35, 2.35]),
	{
		asset: "blackboard",
		floor: 0,
		room: "classB",
		x: 2.4,
		z: 3.9,
		rot: 0
	},
	{
		asset: "podium",
		floor: 0,
		room: "classB",
		x: 2.4,
		z: 3.15,
		rot: 0
	},
	{
		asset: "toy-shelf",
		floor: 0,
		room: "classB",
		x: .4,
		z: 2.4,
		rot: Math.PI / 2
	},
	{
		asset: "mat",
		floor: 0,
		room: "classB",
		x: 4.2,
		z: 1.15,
		rot: 0
	},
	{
		asset: "craft-table",
		floor: 0,
		room: "func",
		x: 2.5,
		z: 7.3,
		rot: 0
	},
	{
		asset: "craft-table",
		floor: 0,
		room: "func",
		x: 2.5,
		z: 8.7,
		rot: 0
	},
	{
		asset: "teach-cab",
		floor: 0,
		room: "func",
		x: .45,
		z: 8.4,
		rot: Math.PI / 2
	},
	{
		asset: "rack",
		floor: 0,
		room: "func",
		x: 4.85,
		z: 8.6,
		rot: -Math.PI / 2
	},
	{
		asset: "plinth",
		floor: 0,
		room: "func",
		x: 4.6,
		z: 6.3,
		rot: 0
	},
	{
		asset: "cart",
		floor: 0,
		room: "func",
		x: 1.2,
		z: 6.2,
		rot: .2
	},
	{
		asset: "teacher-desk",
		floor: 0,
		room: "office",
		x: 8.6,
		z: 2.55,
		rot: Math.PI
	},
	{
		asset: "office-chair",
		floor: 0,
		room: "office",
		x: 8.6,
		z: 1.85,
		rot: Math.PI
	},
	{
		asset: "bookcase",
		floor: 0,
		room: "office",
		x: 7.85,
		z: 3.55,
		rot: 0
	},
	{
		asset: "file-cab",
		floor: 0,
		room: "office",
		x: 10.5,
		z: 3.55,
		rot: 0
	},
	{
		asset: "round-table",
		floor: 0,
		room: "office",
		x: 9.7,
		z: 1.15,
		rot: 0
	},
	{
		asset: "guest-chair",
		floor: 0,
		room: "office",
		x: 9.05,
		z: 1.15,
		rot: Math.PI / 2
	},
	{
		asset: "guest-chair",
		floor: 0,
		room: "office",
		x: 10.4,
		z: 1.15,
		rot: -Math.PI / 2
	},
	{
		asset: "kitchen-cab",
		floor: 0,
		room: "kitchen",
		x: 14.95,
		z: 2.3,
		rot: -Math.PI / 2
	},
	{
		asset: "counter",
		floor: 0,
		room: "kitchen",
		x: 13.4,
		z: 3.55,
		rot: Math.PI
	},
	{
		asset: "fridge",
		floor: 0,
		room: "kitchen",
		x: 11.55,
		z: 3.55,
		rot: Math.PI
	},
	{
		asset: "prep",
		floor: 0,
		room: "kitchen",
		x: 13.1,
		z: 1.55,
		rot: 0
	},
	{
		asset: "sink",
		floor: 0,
		room: "wc",
		x: 7.7,
		z: 7.05,
		rot: 0
	},
	{
		asset: "urinal",
		floor: 0,
		room: "wc",
		x: 8.35,
		z: 7.15,
		rot: 0
	},
	{
		asset: "toilet",
		floor: 0,
		room: "wc",
		x: 9.05,
		z: 6.85,
		rot: 0
	},
	{
		asset: "stall",
		floor: 0,
		room: "wc",
		x: 8.55,
		z: 6.15,
		rot: 0
	},
	...desks("class1", 1, [1.4, 3], [6.7, 7.7]),
	{
		asset: "blackboard",
		floor: 1,
		room: "class1",
		x: 2.5,
		z: 9.9,
		rot: 0
	},
	{
		asset: "podium",
		floor: 1,
		room: "class1",
		x: 2.5,
		z: 8.7,
		rot: 0
	},
	{
		asset: "wall-cabinet",
		floor: 1,
		room: "class1",
		x: .4,
		z: 7.4,
		rot: Math.PI / 2
	},
	{
		asset: "mat",
		floor: 1,
		room: "class1",
		x: 4.15,
		z: 9.2,
		rot: 0
	},
	...desks("class2", 1, [11.3, 13.2], [6.15]),
	{
		asset: "blackboard",
		floor: 1,
		room: "class2",
		x: 12.6,
		z: 7.45,
		rot: 0
	},
	{
		asset: "podium",
		floor: 1,
		room: "class2",
		x: 14.5,
		z: 6.3,
		rot: 0
	},
	{
		asset: "toy-shelf",
		floor: 1,
		room: "class2",
		x: 15.2,
		z: 6,
		rot: -Math.PI / 2
	},
	{
		asset: "craft-table",
		floor: 1,
		room: "func2",
		x: 12.4,
		z: 8.7,
		rot: 0
	},
	{
		asset: "teach-cab",
		floor: 1,
		room: "func2",
		x: 15.15,
		z: 9.2,
		rot: -Math.PI / 2
	},
	{
		asset: "rack",
		floor: 1,
		room: "func2",
		x: 10.15,
		z: 9.15,
		rot: Math.PI / 2
	},
	{
		asset: "plinth",
		floor: 1,
		room: "func2",
		x: 14.4,
		z: 8,
		rot: 0
	},
	{
		asset: "outdoor-set",
		floor: 1,
		room: "garden2",
		x: 8.2,
		z: 2.1,
		rot: .2
	},
	{
		asset: "outdoor-set",
		floor: 1,
		room: "garden2",
		x: 12.8,
		z: 1.5,
		rot: -.4
	},
	{
		asset: "sofa",
		floor: 2,
		room: "read",
		x: 2.5,
		z: 7.3,
		rot: Math.PI
	},
	{
		asset: "low-shelf",
		floor: 2,
		room: "read",
		x: 2.4,
		z: 9.7,
		rot: 0
	},
	{
		asset: "guest-chair",
		floor: 2,
		room: "read",
		x: 4.4,
		z: 7.6,
		rot: -Math.PI / 2
	},
	{
		asset: "bookcase",
		floor: 2,
		room: "read",
		x: .4,
		z: 8.2,
		rot: Math.PI / 2
	},
	{
		asset: "wood-bench",
		floor: 2,
		room: "wood",
		x: 12.3,
		z: 7.4,
		rot: 0
	},
	{
		asset: "wood-bench",
		floor: 2,
		room: "wood",
		x: 12.3,
		z: 9,
		rot: 0
	},
	{
		asset: "rack",
		floor: 2,
		room: "wood",
		x: 15.15,
		z: 8.3,
		rot: -Math.PI / 2
	},
	{
		asset: "wall-cabinet",
		floor: 2,
		room: "wood",
		x: 10.2,
		z: 9.5,
		rot: Math.PI / 2
	},
	{
		asset: "plinth",
		floor: 2,
		room: "wood",
		x: 14.6,
		z: 6.15,
		rot: 0
	},
	{
		asset: "outdoor-set",
		floor: 2,
		room: "garden3",
		x: 2.6,
		z: 2.2,
		rot: .3
	},
	...desks("flex", 1, [1.45, 3.05], [1.55]),
	{
		asset: "blackboard",
		floor: 1,
		room: "flex",
		x: 3.85,
		z: 3.78,
		rot: 0
	},
	{
		asset: "podium",
		floor: 1,
		room: "flex",
		x: 3.85,
		z: 3.05,
		rot: 0
	},
	{
		asset: "toy-shelf",
		floor: 1,
		room: "flex",
		x: .42,
		z: 2.15,
		rot: Math.PI / 2
	},
	{
		asset: "mat",
		floor: 1,
		room: "flex",
		x: 4.35,
		z: 1.15,
		rot: 0
	},
	{
		asset: "cart",
		floor: 1,
		room: "flex",
		x: 4.55,
		z: 2.55,
		rot: .2
	}
];
var DECORS = [
	{
		id: "oak",
		name: "暖白原木",
		note: "白墙、浅橡木、亚麻。",
		image: "/decor/oak.jpg",
		wall: "#f4efe4",
		floor: "#d7b07a",
		wood: "#c4924e",
		woodDark: "#7a5230",
		fabric: "#efe4d4",
		sage: "#6e7d62",
		stone: "#d5cfc4",
		grass: "#7f9a78",
		roof: "#efe6d8",
		accent: "#c98962"
	},
	{
		id: "bamboo",
		name: "竹青教室",
		note: "竹色墙面，浅木与苔绿织物。",
		image: "/decor/bamboo.jpg",
		wall: "#cfe6b8",
		floor: "#d2c07a",
		wood: "#b7a04a",
		woodDark: "#3e5c30",
		fabric: "#c5dcb0",
		sage: "#2f6a38",
		stone: "#c5d2bc",
		grass: "#5f8a48",
		roof: "#d5e8c8",
		accent: "#6e9a42"
	},
	{
		id: "mist",
		name: "塔子山晨雾",
		note: "灰绿石灰墙，雾色木地板。",
		image: "/decor/mist.jpg",
		wall: "#c5d2ce",
		floor: "#b3b0a4",
		wood: "#9a968c",
		woodDark: "#5c5a56",
		fabric: "#d4dbd8",
		sage: "#6e8680",
		stone: "#b7beb8",
		grass: "#8aa890",
		roof: "#dce6e2",
		accent: "#8aa098"
	},
	{
		id: "charcoal",
		name: "白墙黛木",
		note: "白墙配炭色木作。",
		image: "/decor/charcoal.jpg",
		wall: "#f6f4f0",
		floor: "#a48468",
		wood: "#4a433e",
		woodDark: "#241f1c",
		fabric: "#ddd6cc",
		sage: "#3c4640",
		stone: "#c8c0b6",
		grass: "#667a60",
		roof: "#e8e4dc",
		accent: "#6a6258"
	},
	{
		id: "clay",
		name: "赤陶暖阳",
		note: "陶土墙，蜜色橡木。",
		image: "/decor/clay.jpg",
		wall: "#e7b088",
		floor: "#e09858",
		wood: "#d06a32",
		woodDark: "#7a3418",
		fabric: "#f0c4a4",
		sage: "#c45a38",
		stone: "#e4c8b0",
		grass: "#8a9a5c",
		roof: "#f0c8a8",
		accent: "#d4542c"
	},
	{
		id: "forest",
		name: "森系深木",
		note: "胡桃木与苔藓绿。",
		image: "/decor/forest.jpg",
		wall: "#b7c8a4",
		floor: "#6a4630",
		wood: "#4a2e1c",
		woodDark: "#24160e",
		fabric: "#a8bc98",
		sage: "#245032",
		stone: "#b4baa8",
		grass: "#3f5c38",
		roof: "#c5d4b4",
		accent: "#5a7040"
	},
	{
		id: "cream",
		name: "奶油教室",
		note: "奶油墙，浅橡与麻布。",
		image: "/decor/cream.jpg",
		wall: "#f6e4bc",
		floor: "#f0d4a0",
		wood: "#e8c98a",
		woodDark: "#c4a06a",
		fabric: "#fbe6c4",
		sage: "#e4cba0",
		stone: "#f0e4d0",
		grass: "#b4c498",
		roof: "#fbf0d8",
		accent: "#f0b090"
	},
	{
		id: "stone",
		name: "青石园",
		note: "矿物涂料墙，青石与橡木。",
		image: "/decor/stone.jpg",
		wall: "#c8c4b4",
		floor: "#8a8478",
		wood: "#7a7064",
		woodDark: "#3e3c38",
		fabric: "#d4cfc0",
		sage: "#5e6a60",
		stone: "#8a8680",
		grass: "#6e8468",
		roof: "#ddd8cc",
		accent: "#6e6a62"
	},
	{
		id: "ginkgo",
		name: "银杏秋色",
		note: "暖橡木，银杏黄点缀。",
		image: "/decor/ginkgo.jpg",
		wall: "#f6edd0",
		floor: "#e8b040",
		wood: "#e09a18",
		woodDark: "#8a5410",
		fabric: "#f6d48a",
		sage: "#d4a010",
		stone: "#ead8b4",
		grass: "#c6a04a",
		roof: "#f8e8c0",
		accent: "#f0b000"
	},
	{
		id: "ink",
		name: "水墨留白",
		note: "纸白墙，炭色木家具。",
		image: "/decor/ink.jpg",
		wall: "#f2f1ee",
		floor: "#6a6762",
		wood: "#2e2c2a",
		woodDark: "#141312",
		fabric: "#bdbab4",
		sage: "#4a4e4c",
		stone: "#b0aea8",
		grass: "#4e5a4e",
		roof: "#e8e6e2",
		accent: "#2a2a2a"
	},
	{
		id: "lamp",
		name: "夜读暖灯",
		note: "暖橡木与琥珀织物。",
		image: "/decor/lamp.jpg",
		wall: "#f0c498",
		floor: "#e09a58",
		wood: "#d4843a",
		woodDark: "#6a3818",
		fabric: "#f0bc88",
		sage: "#c07840",
		stone: "#e4d0b4",
		grass: "#6a7050",
		roof: "#f3d4b0",
		accent: "#f0a040"
	},
	{
		id: "nordic",
		name: "北欧白橡",
		note: "白橡、浅灰墙、亚麻。",
		image: "/decor/nordic.jpg",
		wall: "#e2e6ea",
		floor: "#f2e4d0",
		wood: "#efe0cc",
		woodDark: "#c8b49a",
		fabric: "#eceae6",
		sage: "#b7c2bc",
		stone: "#d8dcde",
		grass: "#a8c0a8",
		roof: "#f4f5f6",
		accent: "#d0c6bc"
	}
];
var TIME_STOPS = [
	{
		name: "早晨",
		weather: "薄雾，东向微光",
		sky: "#f3d7c4",
		ground: "#cbb89a",
		elev: 14,
		az: -78,
		sun: .85,
		amb: .46,
		lamp: .18
	},
	{
		name: "上午",
		weather: "晴朗，冷白昼光",
		sky: "#e7f0f2",
		ground: "#d5ddd4",
		elev: 40,
		az: -32,
		sun: 1.15,
		amb: .55,
		lamp: 0
	},
	{
		name: "正午",
		weather: "高照，影子很短",
		sky: "#e4eef3",
		ground: "#d7e0d8",
		elev: 68,
		az: 6,
		sun: 1.22,
		amb: .5,
		lamp: 0
	},
	{
		name: "下午",
		weather: "暖黄侧光",
		sky: "#f4ead4",
		ground: "#e2d2b4",
		elev: 34,
		az: 46,
		sun: 1.02,
		amb: .48,
		lamp: 0
	},
	{
		name: "黄昏",
		weather: "窗边余温",
		sky: "#f0b48a",
		ground: "#c98962",
		elev: 7,
		az: 78,
		sun: .62,
		amb: .3,
		lamp: .55
	},
	{
		name: "夜晚",
		weather: "室内灯火",
		sky: "#1b2433",
		ground: "#141a16",
		elev: -14,
		az: 100,
		sun: .04,
		amb: .07,
		lamp: 1
	}
];
function sampleTime(t) {
	const x = Math.min(5, Math.max(0, t));
	const i = Math.min(4, Math.floor(x));
	const f = x - i;
	const a = TIME_STOPS[i];
	const b = TIME_STOPS[i + 1];
	const mix = (p, q) => p + (q - p) * f;
	return {
		name: f < .5 ? a.name : b.name,
		weather: f < .5 ? a.weather : b.weather,
		skyA: a.sky,
		skyB: b.sky,
		groundA: a.ground,
		groundB: b.ground,
		f,
		elev: mix(a.elev, b.elev),
		az: mix(a.az, b.az),
		sun: mix(a.sun, b.sun),
		amb: mix(a.amb, b.amb),
		lamp: mix(a.lamp, b.lamp)
	};
}
var LIFT = 4.6;
var PLAYER_R = .22;
var CLASS_ROOMS = /* @__PURE__ */ new Set([
	"func",
	"classA",
	"classB",
	"flex",
	"office",
	"read",
	"class1",
	"class2",
	"func2",
	"wood"
]);
var BUILD_STEPS = [
	{
		id: "plan",
		t: 0,
		name: "放线",
		hint: "在塔子山公园的场地上弹出三层平面。"
	},
	{
		id: "slab0",
		t: 1.5,
		name: "地基",
		hint: "浇筑一层楼板，厨房和卫生间铺上石材。"
	},
	{
		id: "wall0",
		t: 2.7,
		name: "一层墙体",
		hint: "墙从楼板往上砌，门窗洞先留出来。"
	},
	{
		id: "open0",
		t: 4.3,
		name: "一层门窗",
		hint: "门扇和玻璃装进一层的洞口。"
	},
	{
		id: "stair0",
		t: 5.3,
		name: "楼梯",
		hint: "之字折返楼梯从一层接到二层，梯下是卫生间。"
	},
	{
		id: "slab1",
		t: 6.4,
		name: "二层楼板",
		hint: "二层楼板盖上，楼梯间留出洞口。"
	},
	{
		id: "wall1",
		t: 7.5,
		name: "二层墙体",
		hint: "二层教室的墙和南侧花园栏杆。"
	},
	{
		id: "open1",
		t: 9,
		name: "二层门窗",
		hint: "二层门窗就位。"
	},
	{
		id: "stair1",
		t: 9.9,
		name: "二层楼梯",
		hint: "第二跑楼梯接到三层。"
	},
	{
		id: "slab2",
		t: 10.8,
		name: "三层楼板",
		hint: "三层楼板、露台和甲板一起铺上。"
	},
	{
		id: "wall2",
		t: 11.8,
		name: "三层墙体",
		hint: "阅读室、木工教室和屋顶栏杆。"
	},
	{
		id: "open2",
		t: 13.2,
		name: "三层门窗",
		hint: "顶层门窗安装完成。"
	},
	{
		id: "roof",
		t: 14.1,
		name: "屋顶",
		hint: "屋面盖上。看清室内时可以再关掉屋顶。"
	},
	{
		id: "furn",
		t: 15.5,
		name: "家具",
		hint: "家具、灯具和花园里的植物搬进来。"
	},
	{
		id: "settle",
		t: 17.1,
		name: "分层",
		hint: "楼层轻轻拉开，方便看清每一间。"
	}
];
var INTRO_DUR = 18.8;
var WALL_GROW = [
	1.45,
	1.35,
	1.25
];
function stepAt(id) {
	return BUILD_STEPS.find((s) => s.id === id).t;
}
var KindergartenWorld = class {
	hooks;
	renderer;
	scene = new Scene();
	persp;
	ortho;
	clock = 0;
	last = performance.now();
	view = "doll";
	focus = "all";
	explodeWanted = true;
	ceilings = false;
	eye = "child";
	timeOfDay = 1.15;
	decorId = DECORS[0].id;
	intro = 0;
	introDur = INTRO_DUR;
	introOn = true;
	introHold = false;
	stepIndex = -1;
	grabbed = false;
	keys = /* @__PURE__ */ new Set();
	qaKeys = null;
	stick = {
		x: 0,
		y: 0
	};
	lookDX = 0;
	lookDY = 0;
	yaw = Math.PI;
	pitch = 0;
	foot = new Vector3(6.4, 0, 2.05);
	speed = 0;
	theta = .2;
	phi = .42;
	radius = 22;
	target = new Vector3(XW / 2, .3, ZD / 2);
	orthoHalf = 8.2;
	drag = {
		x: 0,
		y: 0,
		mode: ""
	};
	moved = 0;
	labels = [];
	floors = [];
	grow = [];
	furn = [];
	slabs = [];
	openings = [];
	stairGroups = [];
	roofGroup = new Group();
	roofReveal = 0;
	roofs = [];
	shell = [];
	blocks = [];
	furnBlocks = [];
	movables = [];
	movableById = /* @__PURE__ */ new Map();
	selected = null;
	dragFurn = null;
	grab = {
		x: 0,
		z: 0
	};
	ring;
	dragPlane = new Plane();
	dragHit = new Vector3();
	books = [];
	arch;
	doors = [];
	treads = [];
	tweens = [];
	templates = {};
	lamps = [];
	tmp = new Vector3();
	sun;
	hemi;
	clip = new Plane(new Vector3(0, 1, 0), 1.35);
	planMat;
	glassMat;
	bulbMat;
	ray = new Raycaster();
	pointer = new Vector2();
	disposed = false;
	ready = false;
	canvas;
	onDown;
	onMove;
	onUp;
	onWheel;
	onKeyDown;
	onKeyUp;
	onBlur;
	onMenu;
	onLock;
	constructor(canvas, hooks) {
		this.hooks = hooks;
		this.canvas = canvas;
		this.renderer = new WebGLRenderer({
			canvas,
			antialias: true
		});
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
		this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.toneMapping = 4;
		this.renderer.toneMappingExposure = 1.14;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = 2;
		this.renderer.localClippingEnabled = true;
		this.persp = new PerspectiveCamera(42, 1, .08, 200);
		this.ortho = new OrthographicCamera(-10, 10, 10, -10, .1, 120);
		this.scene.background = new Color("#e7f0f2");
		this.scene.fog = new Fog("#d5e3d4", 46, 130);
		this.planMat = new LineBasicMaterial({
			color: "#3c4a38",
			transparent: true,
			opacity: 1
		});
		this.glassMat = new MeshStandardMaterial({
			color: "#d5e4dc",
			transparent: true,
			opacity: .28,
			roughness: .08,
			metalness: .04,
			emissive: new Color("#ffd2a4"),
			emissiveIntensity: 0
		});
		this.bulbMat = new MeshStandardMaterial({
			color: "#fff1d6",
			emissive: new Color("#ffc98a"),
			emissiveIntensity: 0,
			roughness: .4
		});
		const mats = this.makeMaterials();
		this.arch = mats;
		this.applyTint(DECORS[0].id);
		this.ring = new Mesh(new RingGeometry(.46, .56, 28), new MeshBasicMaterial({
			color: "#c46b45",
			side: 2,
			depthTest: false
		}));
		this.ring.rotation.x = -Math.PI / 2;
		this.ring.position.y = .07;
		this.ring.visible = false;
		this.ring.renderOrder = 4;
		this.sun = new DirectionalLight("#fff4e4", 1.1);
		this.sun.castShadow = true;
		this.sun.shadow.mapSize.set(1024, 1024);
		this.sun.shadow.camera.near = 1;
		this.sun.shadow.camera.far = 90;
		this.sun.shadow.camera.left = -24;
		this.sun.shadow.camera.right = 24;
		this.sun.shadow.camera.top = 24;
		this.sun.shadow.camera.bottom = -24;
		this.sun.shadow.bias = -25e-5;
		this.sun.shadow.normalBias = .035;
		const sunTarget = new Object3D();
		sunTarget.position.set(XW / 2, 2, ZD / 2);
		this.scene.add(sunTarget);
		this.sun.target = sunTarget;
		this.scene.add(this.sun);
		this.hemi = new HemisphereLight("#e7f0f2", "#cbb89a", .5);
		this.scene.add(this.hemi);
		this.buildSite(mats);
		for (let i = 0; i < 3; i++) {
			const g = new Group();
			g.position.y = i * 3;
			const grow = new Group();
			grow.scale.y = .001;
			const furn = new Group();
			furn.position.y = -.8;
			furn.visible = false;
			const slab = new Group();
			slab.position.y = -SLAB_T;
			slab.scale.y = .001;
			const openings = new Group();
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
		this.roofGroup.scale.y = .001;
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
	setView(v) {
		this.view = v;
		if (v === "fps") {
			this.explodeWanted = this.explodeWanted;
			this.snapFloors();
			if (this.intro < this.introDur) this.finishIntro();
			this.pitch = 0;
		} else if (document.pointerLockElement === this.canvas) document.exitPointerLock();
		if (v === "doll" && !this.introOn) {
			this.theta = 2.55;
			this.phi = 1.02;
			this.radius = this.exploded ? 42 : 30;
			this.target.set(7.6, this.exploded ? 6.2 : 2.4, 5.2);
		}
		if (v === "cut" && !this.introOn) {
			const f = this.focus === "all" ? 0 : this.focus;
			this.theta = .15;
			this.phi = .72;
			this.radius = 16;
			this.target.set(XW / 2, f * 3 + .4, ZD / 2);
		}
		if (v === "ortho" && !this.introOn) {
			this.target.set(XW / 2, 0, ZD / 2);
			this.orthoHalf = 8.4;
		}
	}
	setFocus(f) {
		this.focus = f;
		if (this.view === "fps" || this.introOn) return;
		const fl = f === "all" ? 1 : f;
		const lifted = f === "all" && this.explodeWanted && this.view === "doll";
		this.target.set(XW / 2, lifted ? 6.2 : fl * 3 + .6, ZD / 2);
		if (f !== "all") this.radius = 16;
	}
	setExplode(on) {
		this.explodeWanted = on;
		if (this.introOn || this.view !== "doll") return;
		this.radius = on ? 34 : 26;
		this.target.y = on ? 6.2 : 2.4;
	}
	setCeilings(on) {
		this.ceilings = on;
	}
	setEye(eye) {
		this.eye = eye;
	}
	setTime(t) {
		this.timeOfDay = t;
		this.applyTime();
	}
	setDecor(id) {
		const d = DECORS.find((item) => item.id === id) ?? DECORS[0];
		this.applyTint(d.id);
		try {
			localStorage.setItem("huixing-decor", d.id);
		} catch {}
	}
	applyTint(id) {
		const d = DECORS.find((item) => item.id === id) ?? DECORS[0];
		this.decorId = d.id;
		const a = this.arch;
		const paint = (mat, hex) => {
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
		a.white.color.set("#ffffff").lerp(new Color(d.wall), .16);
		a.ground.color.set("#ffffff").lerp(new Color(d.grass), .16);
		a.leaf.color.set("#ffffff").lerp(new Color(d.sage), .2);
		a.leafGold.color.set("#ffffff").lerp(new Color(d.accent), .32);
		a.trunk.color.set("#ffffff").lerp(new Color(d.woodDark), .2);
		this.glassMat.color.set("#e7f2ec").lerp(new Color(d.wall), .35);
		const darkWood = d.id === "ink" || d.id === "charcoal" || d.id === "forest";
		const matteWall = d.id === "clay" || d.id === "bamboo" || d.id === "forest";
		a.wood.roughness = darkWood ? .34 : .5;
		a.woodDark.roughness = darkWood ? .28 : .46;
		a.floor.roughness = .55;
		a.deck.roughness = .6;
		a.wall.roughness = matteWall ? .96 : d.id === "nordic" || d.id === "ink" ? .66 : .88;
		a.roof.roughness = a.wall.roughness;
		a.fabric.roughness = .86;
		a.sage.roughness = .76;
		a.clay.roughness = .8;
		for (const book of this.books) {
			const base = book.userData.base || "#8d6844";
			book.color.set(base).lerp(new Color(d.accent), .62);
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
	focusRoom(id) {
		const r = roomById(id);
		if (!r) return;
		this.focus = r.floor;
		this.view = this.view === "fps" ? "fps" : "doll";
		const y = this.floors[r.floor]?.position.y ?? r.floor * 3;
		if (this.view === "fps") this.foot.set((r.x0 + r.x1) / 2, r.floor * 3, (r.z0 + r.z1) / 2);
		else {
			this.target.set((r.x0 + r.x1) / 2, y + .8, (r.z0 + r.z1) / 2);
			this.radius = 11;
			this.phi = .95;
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
		this.theta = .2;
		this.phi = .42;
		this.radius = 22;
		this.target.set(XW / 2, .3, ZD / 2);
		this.stepIndex = -1;
		this.resetBuild();
		this.syncStep();
	}
	skipIntro() {
		this.finishIntro();
	}
	setStick(x, y) {
		this.stick.x = x;
		this.stick.y = y;
	}
	setLook(dx, dy) {
		this.lookDX += dx;
		this.lookDY += dy;
	}
	finishIntro() {
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
	resetBuild() {
		for (const g of this.grow) g.scale.y = .001;
		for (const f of this.furn) {
			f.position.y = -.8;
			f.visible = false;
		}
		for (const s of this.slabs) s.scale.y = .001;
		for (const o of this.openings) {
			o.visible = false;
			o.position.y = 0;
		}
		for (const s of this.stairGroups) {
			s.visible = false;
			s.position.y = 0;
		}
		this.roofGroup.scale.y = .001;
		this.roofReveal = 0;
		this.planMat.opacity = 1;
		for (let i = 0; i < 3; i++) this.floors[i].position.y = i * 3;
	}
	completeBuild() {
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
	get exploded() {
		return this.explodeWanted && this.view === "doll" && this.focus === "all";
	}
	snapFloors() {
		for (let i = 0; i < 3; i++) this.floors[i].position.y = i * 3;
	}
	makeMaterials() {
		const woodImg = this.paintTex((g, n) => this.drawWood(g, n), 1);
		const wallImg = this.paintTex((g, n) => this.drawPlaster(g, n), 1);
		const stoneImg = this.paintTex((g, n) => this.drawStone(g, n), 1);
		const grassImg = this.paintTex((g, n) => this.drawGrass(g, n), 1);
		const leafImg = this.paintTex((g, n) => this.drawFoliage(g, n, false), 1);
		const goldImg = this.paintTex((g, n) => this.drawFoliage(g, n, true), 1);
		const fabricImg = this.paintTex((g, n) => this.drawFabric(g, n), 1);
		const std = (map, rough = .78, metal = .02) => new MeshStandardMaterial({
			color: "#ffffff",
			map,
			roughness: rough,
			metalness: metal,
			bumpMap: map,
			bumpScale: .015
		});
		const books = [
			"#8d6844",
			"#6d7c64",
			"#c98962",
			"#5c6b55",
			"#7f8c9a"
		].map((color) => {
			const mat = new MeshStandardMaterial({
				color,
				map: fabricImg,
				roughness: .82,
				bumpMap: fabricImg,
				bumpScale: .02
			});
			mat.userData.base = color;
			return mat;
		});
		this.books = books;
		return {
			wall: std(wallImg, .92),
			wood: std(woodImg, .55),
			floor: std(woodImg, .58),
			woodDark: std(woodImg, .62),
			sage: std(fabricImg, .72),
			stone: std(stoneImg, .84),
			grass: std(grassImg, .94),
			ground: std(grassImg, .96),
			deck: std(woodImg, .62),
			roof: std(wallImg, .88),
			trunk: std(woodImg, .8),
			leaf: std(leafImg, .88),
			leafGold: std(goldImg, .86),
			metal: new MeshStandardMaterial({
				color: "#8d9290",
				roughness: .32,
				metalness: .72
			}),
			white: std(wallImg, .6),
			fabric: std(fabricImg, .88),
			clay: std(fabricImg, .74)
		};
	}
	wearPhotos() {
		const loader = new TextureLoader();
		const a = this.arch;
		const take = (url, mats, bumpScale, lo, hi) => {
			loader.load(url, (tex) => {
				const albedo = this.neutralMap(tex.image, lo, hi);
				const bump = this.neutralMap(tex.image, .02, 1);
				tex.dispose();
				if (!albedo || !bump) return;
				bump.colorSpace = LinearSRGBColorSpace;
				for (const mat of mats) {
					mat.map = albedo;
					mat.bumpMap = bump;
					mat.bumpScale = bumpScale;
					mat.needsUpdate = true;
				}
			});
		};
		take("/textures/oak.jpg", [
			a.wood,
			a.floor,
			a.deck
		], .09, .46, 1);
		take("/textures/walnut.jpg", [a.woodDark], .11, .34, .96);
		take("/textures/plaster.jpg", [
			a.wall,
			a.roof,
			a.white
		], .055, .9, 1);
		take("/textures/linen.jpg", [
			a.fabric,
			a.sage,
			a.clay,
			...this.books
		], .07, .74, 1);
		take("/textures/stone.jpg", [a.stone], .09, .58, 1);
		take("/textures/grass.jpg", [a.grass], .05, .72, 1);
		loader.load("/textures/grass.jpg", (tex) => {
			tex.wrapS = tex.wrapT = RepeatWrapping;
			tex.colorSpace = SRGBColorSpace;
			tex.anisotropy = 8;
			a.ground.map = tex;
			a.ground.bumpMap = tex;
			a.ground.bumpScale = .03;
			a.ground.needsUpdate = true;
		});
		loader.load("/textures/walnut.jpg", (tex) => {
			tex.wrapS = tex.wrapT = RepeatWrapping;
			tex.colorSpace = SRGBColorSpace;
			tex.anisotropy = 8;
			a.trunk.map = tex;
			a.trunk.bumpMap = tex;
			a.trunk.bumpScale = .05;
			a.trunk.needsUpdate = true;
		});
	}
	neutralMap(image, lo, hi) {
		const w = Math.max(2, image.naturalWidth || image.width || 512);
		const h = Math.max(2, image.naturalHeight || image.height || 512);
		const c = document.createElement("canvas");
		c.width = w;
		c.height = h;
		const g = c.getContext("2d", { willReadFrequently: true });
		if (!g) return null;
		g.drawImage(image, 0, 0, w, h);
		const img = g.getImageData(0, 0, w, h);
		const px = img.data;
		for (let i = 0; i < px.length; i += 4) {
			const l = (px[i] * .299 + px[i + 1] * .587 + px[i + 2] * .114) / 255;
			const v = Math.round((lo + (hi - lo) * l) * 255);
			px[i] = px[i + 1] = px[i + 2] = v;
		}
		g.putImageData(img, 0, 0);
		const tex = new CanvasTexture(c);
		tex.wrapS = tex.wrapT = RepeatWrapping;
		tex.anisotropy = 8;
		tex.colorSpace = SRGBColorSpace;
		return tex;
	}
	meterUV(geo) {
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
		geo.setAttribute("uv", new BufferAttribute(uv, 2));
	}
	paintTex(draw, repeat) {
		const n = 512;
		const c = document.createElement("canvas");
		c.width = n;
		c.height = n;
		const g = c.getContext("2d");
		if (!g) return null;
		draw(g, n);
		const t = new CanvasTexture(c);
		t.wrapS = t.wrapT = RepeatWrapping;
		t.repeat.set(repeat, repeat);
		t.colorSpace = SRGBColorSpace;
		t.anisotropy = 8;
		return t;
	}
	drawWood(g, n) {
		g.fillStyle = "#f4f4f4";
		g.fillRect(0, 0, n, n);
		for (let i = 0; i < 42; i++) {
			const y = (i + .5) / 42 * n;
			const wave = Math.sin(i * .7) * 8;
			g.strokeStyle = `rgba(28, 28, 28, ${.08 + i % 4 * .035})`;
			g.lineWidth = i % 6 === 0 ? 2 : 1;
			g.beginPath();
			g.moveTo(0, y);
			g.bezierCurveTo(n * .35, y + wave, n * .7, y - wave * .6, n, y + wave * .3);
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
	drawPlaster(g, n) {
		g.fillStyle = "#f7f7f7";
		g.fillRect(0, 0, n, n);
		for (let i = 0; i < 1800; i++) {
			const v = 214 + i * 37 % 28;
			g.fillStyle = `rgba(${v}, ${v}, ${v}, 0.2)`;
			const s = 1 + i % 3;
			g.fillRect(i * 19 % n, i * 47 % n, s, s);
		}
		for (let i = 0; i < 30; i++) {
			g.fillStyle = `rgba(80,80,80,${.03 + i % 4 * .012})`;
			g.beginPath();
			g.ellipse(i * 80 % n, i * 53 % n, 40 + i % 5 * 6, 18, i, 0, Math.PI * 2);
			g.fill();
		}
	}
	drawStone(g, n) {
		g.fillStyle = "#e4e4e4";
		g.fillRect(0, 0, n, n);
		const tile = 64;
		for (let y = 0; y < n; y += tile) for (let x = 0; x < n; x += tile) {
			const v = 196 + ((x + y) % 17 - 8);
			g.fillStyle = `rgb(${v}, ${v}, ${v})`;
			g.fillRect(x + 1, y + 1, 62, 62);
			for (let k = 0; k < 8; k++) {
				g.fillStyle = `rgba(40,40,40,${.05 + k % 3 * .03})`;
				g.beginPath();
				g.ellipse(x + k * 23 % tile, y + k * 17 % tile, 6, 4, k, 0, Math.PI * 2);
				g.fill();
			}
		}
	}
	drawGrass(g, n) {
		g.fillStyle = "#6f8f64";
		g.fillRect(0, 0, n, n);
		for (let i = 0; i < 1400; i++) {
			const x = i * 47 % n;
			const y = i * 83 % n;
			const h = 6 + i % 9;
			g.strokeStyle = i % 3 === 0 ? "#8eae78" : i % 3 === 1 ? "#5d7c52" : "#c6b25a";
			g.globalAlpha = .35;
			g.beginPath();
			g.moveTo(x, y);
			g.lineTo(x + (i % 5 - 2), y - h);
			g.stroke();
		}
		g.globalAlpha = 1;
	}
	drawFoliage(g, n, gold) {
		g.fillStyle = gold ? "#e4d48a" : "#8fb57a";
		g.fillRect(0, 0, n, n);
		for (let i = 0; i < 900; i++) {
			const x = i * 61 % n;
			const y = i * 97 % n;
			if (gold) g.fillStyle = `rgba(${190 + i % 40}, ${150 + i % 36}, ${48 + i % 24}, 0.42)`;
			else g.fillStyle = `rgba(${46 + i % 50}, ${96 + i % 70}, ${38 + i % 28}, 0.45)`;
			g.beginPath();
			g.ellipse(x, y, 10 + i % 14, 6 + i % 7, i * .4, 0, Math.PI * 2);
			g.fill();
		}
	}
	drawFabric(g, n) {
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
	buildSite(mats) {
		const ground = new Mesh(new CircleGeometry(86, 80), mats.ground);
		ground.rotation.x = -Math.PI / 2;
		ground.position.set(XW / 2, -.06, ZD / 2);
		ground.receiveShadow = true;
		this.meterUV(ground.geometry);
		this.scene.add(ground);
		const ring = new Mesh(new RingGeometry(13.2, 15.1, 72), mats.stone);
		ring.rotation.x = -Math.PI / 2;
		ring.position.set(XW / 2, -.03, ZD / 2);
		ring.receiveShadow = true;
		this.meterUV(ring.geometry);
		this.scene.add(ring);
		const path = new Mesh(new PlaneGeometry(2.6, 24), mats.stone);
		path.rotation.x = -Math.PI / 2;
		path.position.set(6.4, -.02, -12.4);
		path.receiveShadow = true;
		this.meterUV(path.geometry);
		this.scene.add(path);
		const apron = new Mesh(new BoxGeometry(7.2, .05, 3.6), mats.stone);
		apron.position.set(6.4, 0, -1.5);
		apron.receiveShadow = true;
		this.meterUV(apron.geometry);
		this.scene.add(apron);
		const count = 128;
		const trunkGeo = new CylinderGeometry(.12, .2, 1.7, 7);
		const lowGeo = new SphereGeometry(1.05, 8, 6);
		lowGeo.scale(1.2, .62, 1.15);
		const highGeo = new SphereGeometry(.72, 8, 6);
		const trunks = new InstancedMesh(trunkGeo, mats.trunk, count);
		const lows = new InstancedMesh(lowGeo, mats.leaf, count);
		const highs = new InstancedMesh(highGeo, mats.leaf, count);
		const golds = new InstancedMesh(lowGeo, mats.leafGold, count);
		trunks.castShadow = true;
		lows.castShadow = true;
		highs.castShadow = true;
		golds.castShadow = true;
		const dummy = new Object3D();
		const spots = [];
		let seed = 19;
		const rnd = () => {
			seed = seed * 16807 % 2147483647;
			return seed / 2147483647;
		};
		const clearOf = (x, z) => {
			if (x > -3.2 && x < 18.8 && z > -4 && z < 10.2 + 2.6) return false;
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
			const z = ZD / 2 - 1 + Math.sin(ang) * rad * .92;
			if (!clearOf(x, z)) continue;
			spots.push({
				x,
				z,
				s: .85 + rnd() * 1.25,
				gold: rnd() < .2
			});
		}
		let green = 0;
		let gold = 0;
		spots.forEach((p, n) => {
			dummy.position.set(p.x, .85 * p.s, p.z);
			dummy.rotation.set(0, p.x, 0);
			dummy.scale.set(p.s * .9, p.s, p.s * .9);
			dummy.updateMatrix();
			trunks.setMatrixAt(n, dummy.matrix);
			dummy.position.y = 1.85 * p.s;
			dummy.scale.set(p.s * 1.25, p.s * .95, p.s * 1.2);
			dummy.updateMatrix();
			if (p.gold) {
				golds.setMatrixAt(gold, dummy.matrix);
				gold += 1;
			} else {
				lows.setMatrixAt(green, dummy.matrix);
				green += 1;
				dummy.position.y = 2.55 * p.s;
				dummy.position.x += .15 * p.s;
				dummy.scale.set(p.s * .72, p.s * .7, p.s * .72);
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
		const shrubGeo = new SphereGeometry(.42, 7, 5);
		shrubGeo.scale(1.15, .65, 1.05);
		const shrubs = new InstancedMesh(shrubGeo, mats.leaf, 70);
		let s = 0;
		for (let i = 0; i < 90 && s < 70; i++) {
			const ang = i / 90 * Math.PI * 2 + .2;
			const rad = 9.4 + i % 4 * .55;
			const x = XW / 2 + Math.cos(ang) * rad * 1.15;
			const z = ZD / 2 + Math.sin(ang) * rad * .85;
			if (x > -.4 && x < 16 && z > -.6 && z < 10.6) continue;
			if (Math.abs(x - 6.4) < 2.6 && z < .4) continue;
			dummy.position.set(x, .28, z);
			dummy.rotation.set(0, ang, 0);
			dummy.scale.set(.8 + i % 3 * .28, .7, .9);
			dummy.updateMatrix();
			shrubs.setMatrixAt(s, dummy.matrix);
			s += 1;
		}
		shrubs.count = s;
		shrubs.instanceMatrix.needsUpdate = true;
		shrubs.castShadow = true;
		this.scene.add(shrubs);
		const petalGeo = new SphereGeometry(.12, 6, 4);
		const petals = [
			"#f7f3ea",
			"#e7a3b4",
			"#e6c85c"
		].map((color) => new InstancedMesh(petalGeo, new MeshStandardMaterial({
			color,
			roughness: .7
		}), 36));
		for (let i = 0; i < 36; i++) {
			const x = 6.4 + (i % 2 === 0 ? -1 : 1) * (1.7 + i % 3 * .35);
			const z = -2.2 - i % 18 * .85;
			dummy.position.set(x, .1, z);
			dummy.scale.set(1, .6, 1);
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
		const nearTrunk = new InstancedMesh(trunkGeo, mats.trunk, nearCount);
		const nearLeaf = new InstancedMesh(lowGeo, mats.leaf, nearCount);
		const nearGold = new InstancedMesh(lowGeo, mats.leafGold, nearCount);
		nearTrunk.castShadow = true;
		nearLeaf.castShadow = true;
		nearGold.castShadow = true;
		const belt = [
			{
				x: -5.2,
				z: 1.2,
				s: 1.15,
				y: 0,
				gold: false
			},
			{
				x: -6.4,
				z: 5.4,
				s: 1.35,
				y: 0,
				gold: true
			},
			{
				x: -4.6,
				z: 9.2,
				s: 1.05,
				y: 0,
				gold: false
			},
			{
				x: -3.4,
				z: 12.4,
				s: 1.2,
				y: 0,
				gold: false
			},
			{
				x: 2.2,
				z: 14.2,
				s: 1.4,
				y: 0,
				gold: true
			},
			{
				x: 8.4,
				z: 15.6,
				s: 1.55,
				y: 0,
				gold: false
			},
			{
				x: 14.2,
				z: 14.4,
				s: 1.25,
				y: 0,
				gold: false
			},
			{
				x: 19.4,
				z: 8.6,
				s: 1.3,
				y: 0,
				gold: true
			},
			{
				x: 20.2,
				z: 3.2,
				s: 1.15,
				y: 0,
				gold: false
			},
			{
				x: 19.2,
				z: -2.4,
				s: 1.05,
				y: 0,
				gold: false
			},
			{
				x: 12.8,
				z: -4.6,
				s: 1.2,
				y: 0,
				gold: true
			},
			{
				x: 2.4,
				z: -4.2,
				s: 1.1,
				y: 0,
				gold: false
			},
			{
				x: -2.8,
				z: -3.2,
				s: .95,
				y: 0,
				gold: false
			},
			{
				x: 22,
				z: 36,
				s: 1.6,
				y: 2.4,
				gold: true
			},
			{
				x: 16,
				z: 42,
				s: 1.35,
				y: 2.8,
				gold: false
			},
			{
				x: 28,
				z: 40,
				s: 1.45,
				y: 2.2,
				gold: true
			},
			{
				x: 12,
				z: 34,
				s: 1.2,
				y: 1.4,
				gold: false
			},
			{
				x: 24,
				z: 30,
				s: 1.15,
				y: 1.1,
				gold: false
			}
		];
		let ni = 0;
		let ng = 0;
		let nGreen = 0;
		for (const p of belt) {
			if (ni >= nearCount) break;
			dummy.position.set(p.x, p.y + .85 * p.s, p.z);
			dummy.rotation.set(0, p.x, 0);
			dummy.scale.set(p.s * .85, p.s, p.s * .85);
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
		const hill = new Mesh(new SphereGeometry(22, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), mats.grass);
		hill.scale.set(1.55, .16, 1.05);
		hill.position.set(20, -.35, 40);
		hill.receiveShadow = true;
		this.scene.add(hill);
		const hillTag = this.makeLabel("塔子山");
		hillTag.position.set(20, 6.4, 40);
		hillTag.scale.set(7.2, 1.8, 1);
		this.scene.add(hillTag);
		this.labels.push(hillTag);
	}
	box(w, h, d) {
		return new BoxGeometry(w, h, d);
	}
	addBox(parent, mat, x, y, z, w, h, d, shadow = true) {
		const m = new Mesh(this.box(w, h, d), mat);
		this.meterUV(m.geometry);
		m.position.set(x, y, z);
		m.castShadow = shadow;
		m.receiveShadow = true;
		parent.add(m);
		return m;
	}
	buildArchitecture(mats) {
		const slab = (floor, x0, x1, z0, z1, mat) => {
			if (x1 - x0 < .05 || z1 - z0 < .05) return;
			const mesh = this.addBox(this.slabs[floor], mat, (x0 + x1) / 2, SLAB_HALF, (z0 + z1) / 2, x1 - x0, SLAB_T, z1 - z0, false);
			mesh.castShadow = false;
			return mesh;
		};
		slab(0, 0, XW, 0, ZD, mats.floor);
		this.slabAroundStair(1, mats.floor, 0, XW, 0, ZD);
		this.slabAroundStair(2, mats.floor, 0, X_B, 0, ZD);
		this.slabAroundStair(2, mats.deck, X_B, X_ST1, Z_C0, ZD);
		this.slabAroundStair(2, mats.floor, X_ST1, XW, Z_C0, ZD);
		this.addBox(this.slabs[0], mats.stone, (11 + XW) / 2, .015 + SLAB_T, Z_C0 / 2, XW - 11, .03, Z_C0, false);
		this.addBox(this.slabs[0], mats.stone, 16.7 / 2, .02 + SLAB_T, 13.1 / 2, 2.1, .03, 1.9, false);
		const wall = mats.wall;
		const sage = mats.sage;
		this.run(0, "x", 0, 0, XW, wall, true, [
			{
				a: 5.62,
				b: 6.72,
				sill: 0,
				head: 2.15,
				door: true,
				swing: -1.15,
				id: "entry"
			},
			{
				a: 1.1,
				b: 3.5,
				sill: .72,
				head: 2.2
			},
			{
				a: 8.1,
				b: 10.2,
				sill: .85,
				head: 2.15
			},
			{
				a: 12.1,
				b: 14.6,
				sill: 1.35,
				head: 2.15
			}
		]);
		this.run(0, "x", ZD, 0, XW, wall, false, [
			{
				a: .8,
				b: 3.6,
				sill: .75,
				head: 2.2
			},
			{
				a: 5.7,
				b: 8.8,
				sill: 1.85,
				head: 2.55
			},
			{
				a: 10.4,
				b: 14.4,
				sill: .75,
				head: 2.2
			}
		]);
		this.run(0, "z", 0, 0, ZD, wall, false, [{
			a: .6,
			b: 2.4,
			sill: .75,
			head: 2.15
		}, {
			a: 6.2,
			b: 8.8,
			sill: .75,
			head: 2.2
		}]);
		this.run(0, "z", XW, 0, ZD, wall, false, [{
			a: 1.25,
			b: 2.25,
			sill: 0,
			head: 2.15,
			door: true,
			swing: -1.15,
			id: "service"
		}, {
			a: 6.3,
			b: 8.6,
			sill: .8,
			head: 2.15
		}]);
		this.run(0, "x", Z_C0, 0, XW, wall, false, [
			{
				a: 2.05,
				b: 3.05,
				sill: 0,
				head: 2.15,
				door: true,
				swing: 1.15,
				id: "b-hall"
			},
			{
				a: 5.7,
				b: 6.6,
				sill: 0,
				head: 2.15,
				door: true,
				swing: -1.15,
				id: "lobby-hall"
			},
			{
				a: 8.55,
				b: 9.5,
				sill: 0,
				head: 2.15,
				door: true,
				swing: 1.15,
				id: "office-hall"
			},
			{
				a: 12.35,
				b: 13.35,
				sill: 0,
				head: 2.15,
				door: true,
				swing: 1.15,
				id: "kit-hall"
			}
		]);
		this.run(0, "x", Z_C1, 0, XW, wall, false, [
			{
				a: 1.85,
				b: 2.85,
				sill: 0,
				head: 2.15,
				door: true,
				swing: -1.15,
				id: "func-hall"
			},
			{
				a: 5.5,
				b: 6.72,
				sill: 0,
				head: 2.15,
				door: true,
				swing: -1.15,
				id: "stair0"
			},
			{
				a: 7.65,
				b: 8.55,
				sill: 0,
				head: 2.15,
				door: true,
				swing: -1.15,
				id: "wc"
			},
			{
				a: 11.5,
				b: 12.5,
				sill: 0,
				head: 2.15,
				door: true,
				swing: -1.15,
				id: "a-hall"
			}
		]);
		this.run(0, "z", X_B, 0, Z_C0, wall, false, [{
			a: 1.35,
			b: 2.3,
			sill: 0,
			head: 2.15,
			door: true,
			swing: 1.15,
			id: "b-lobby"
		}]);
		this.run(0, "z", X_L, 0, Z_C0, wall, false, [{
			a: 1.5,
			b: 2.45,
			sill: 0,
			head: 2.15,
			door: true,
			swing: -1.15,
			id: "lobby-off"
		}]);
		this.run(0, "z", 11, 0, Z_C0, wall, false, []);
		this.run(0, "z", X_ST0, Z_C1, ZD, wall, false, []);
		this.run(0, "z", X_ST1, Z_C1, ZD, wall, false, []);
		this.run(0, "z", 7.28, 5.58, 7.5, wall, false, []);
		this.run(0, "x", 7.5, 7.28, 9.42, wall, false, []);
		this.run(0, "z", 9.42, 5.58, 7.5, sage, false, []);
		this.run(1, "x", 0, 0, X_B, wall, true, [{
			a: 1.3,
			b: 3.5,
			sill: .7,
			head: 2.2
		}]);
		this.run(1, "z", 0, 0, ZD, wall, false, [{
			a: .7,
			b: 2.6,
			sill: .7,
			head: 2.2
		}, {
			a: 6.4,
			b: 9,
			sill: .7,
			head: 2.2
		}]);
		this.run(1, "x", ZD, 0, XW, wall, false, [{
			a: .7,
			b: 3.8,
			sill: .75,
			head: 2.2
		}, {
			a: 10.3,
			b: 14.6,
			sill: .75,
			head: 2.2
		}]);
		this.run(1, "z", XW, Z_C1, ZD, wall, false, [{
			a: 6.2,
			b: 9.2,
			sill: .55,
			head: 2.25
		}]);
		this.run(1, "z", X_B, 0, Z_C0, wall, false, [
			{
				a: .35,
				b: 1.35,
				sill: .15,
				head: 2.3
			},
			{
				a: 1.55,
				b: 2.5,
				sill: 0,
				head: 2.15,
				door: true,
				swing: -1.15,
				id: "flex-garden"
			},
			{
				a: 2.7,
				b: 3.9,
				sill: .15,
				head: 2.3
			}
		]);
		this.run(1, "x", Z_C0, 0, X_B, wall, false, [{
			a: 1.9,
			b: 2.9,
			sill: 0,
			head: 2.15,
			door: true,
			swing: 1.15,
			id: "flex-hall"
		}]);
		this.run(1, "x", Z_C0, X_B, XW, wall, false, [
			{
				a: 6.2,
				b: 10.6,
				sill: .12,
				head: 2.35
			},
			{
				a: 11.7,
				b: 12.7,
				sill: 0,
				head: 2.15,
				door: true,
				swing: 1.15,
				id: "hall-garden"
			},
			{
				a: 12.95,
				b: 15.2,
				sill: .12,
				head: 2.35
			}
		]);
		this.run(1, "x", Z_C1, 0, XW, wall, false, [
			{
				a: 1.85,
				b: 2.85,
				sill: 0,
				head: 2.15,
				door: true,
				swing: -1.15,
				id: "c1-hall"
			},
			{
				a: 5.5,
				b: 6.72,
				sill: 0,
				head: 2.15,
				door: true,
				swing: -1.15,
				id: "stair1"
			},
			{
				a: 11.4,
				b: 12.45,
				sill: 0,
				head: 2.15,
				door: true,
				swing: -1.15,
				id: "c2-hall"
			}
		]);
		this.run(1, "z", X_ST0, Z_C1, ZD, wall, false, []);
		this.run(1, "z", X_ST1, Z_C1, ZD, wall, false, []);
		this.run(1, "x", Z_SPLIT, X_ST1, XW, wall, false, [{
			a: 11.6,
			b: 12.6,
			sill: 0,
			head: 2.15,
			door: true,
			swing: -1.15,
			id: "c2-func"
		}]);
		this.rail(1, X_B, .12, XW, .12);
		this.rail(1, XW - .1, .12, XW - .1, Z_C0);
		this.run(2, "z", 0, Z_C1, ZD, wall, false, [{
			a: 6.5,
			b: 8.8,
			sill: .8,
			head: 2.15
		}]);
		this.run(2, "x", ZD, 0, XW, wall, false, [{
			a: .8,
			b: 3.4,
			sill: .9,
			head: 2.05
		}, {
			a: 10.6,
			b: 14.5,
			sill: .7,
			head: 2.25
		}]);
		this.run(2, "z", XW, Z_C1, ZD, wall, false, [{
			a: 6.4,
			b: 9.1,
			sill: .55,
			head: 2.3
		}]);
		this.run(2, "x", Z_C1, 0, X_B, wall, false, [{
			a: 1.9,
			b: 2.9,
			sill: 0,
			head: 2.15,
			door: true,
			swing: 1.2,
			id: "read-garden"
		}]);
		this.run(2, "z", X_B, Z_C0, Z_C1, wall, false, [{
			a: 4.55,
			b: 5.25,
			sill: 0,
			head: 2.15,
			door: true,
			swing: -1.15,
			id: "g3-hall"
		}]);
		this.run(2, "x", Z_C1, X_B, XW, wall, false, [{
			a: 5.5,
			b: 6.72,
			sill: 0,
			head: 2.15,
			door: true,
			swing: -1.15,
			id: "stair2"
		}, {
			a: 12,
			b: 13.05,
			sill: 0,
			head: 2.15,
			door: true,
			swing: -1.15,
			id: "wood-hall"
		}]);
		this.run(2, "z", X_ST0, Z_C1, ZD, wall, false, []);
		this.run(2, "z", X_ST1, Z_C1, ZD, wall, false, []);
		this.rail(2, .12, .12, X_B - .05, .12);
		this.rail(2, X_B - .08, .12, X_B - .08, Z_C0);
		this.rail(2, .12, .12, .12, Z_C1);
		this.rail(2, X_B, Z_C0 + .1, XW - .1, Z_C0 + .1);
		const roof = (x0, x1, z0, z1) => {
			const m = this.addBox(this.roofGroup, mats.roof, (x0 + x1) / 2, .08, (z0 + z1) / 2, x1 - x0 + .28, .14, z1 - z0 + .28, true);
			this.roofs.push(m);
		};
		roof(0, X_B, Z_C1, ZD);
		roof(X_ST0, X_ST1, Z_C1, ZD);
		roof(X_ST1, XW, Z_C1, ZD);
		roof(X_B, XW, Z_C0, Z_C1);
		const entry = this.doors.find((d) => d.id === "entry");
		if (entry) entry.target = -1.15;
	}
	slabAroundStair(floor, mat, x0, x1, z0, z1) {
		const hx0 = Math.max(x0, STAIR.x0);
		const hx1 = Math.min(x1, STAIR.x1);
		const hz0 = Math.max(z0, STAIR.z0);
		const hz1 = Math.min(z1, STAIR.z1);
		const hole = hx1 - hx0 > .2 && hz1 - hz0 > .2;
		const put = (a, b, c, d) => {
			if (b - a < .04 || d - c < .04) return;
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
	run(floor, axis, fixed, from, to, mat, dollHide, gaps) {
		const parent = this.grow[floor];
		const height = WALL_H;
		const ordered = [...gaps].sort((p, q) => p.a - q.a);
		const spanBox = (a, b, y0, y1, material, hide = dollHide) => {
			if (b - a < .02 || y1 - y0 < .02) return;
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
			if (g.sill > .02) spanBox(a, b, 0, g.sill, mat, false);
			if (g.head < height - .02) spanBox(a, b, g.head, height, mat, false);
			if (!g.door && g.head - g.sill > .2) {
				const x = axis === "x" ? (a + b) / 2 : fixed;
				const z = axis === "z" ? (a + b) / 2 : fixed;
				const w = axis === "x" ? b - a - .06 : .02;
				const d = axis === "z" ? b - a - .06 : .02;
				const glass = this.addBox(this.openings[floor], this.glassMat, x, (g.sill + g.head) / 2, z, Math.max(.05, w), g.head - g.sill - .04, Math.max(.05, d), false);
				glass.castShadow = false;
				const frameMat = mat;
				spanBox(a, a + .04, g.sill, g.head, frameMat, false);
				spanBox(b - .04, b, g.sill, g.head, frameMat, false);
			}
			if (g.door) this.addDoor(floor, axis, fixed, a, b, g.swing ?? -1.15, g.id ?? `d-${floor}-${a}`);
			cursor = Math.max(cursor, b);
		}
		if (cursor < to) spanBox(cursor, to, 0, height, mat);
		const doors = ordered.filter((g) => g.door);
		let c = from;
		const parts = [];
		for (const g of doors) {
			if (g.a > c) parts.push([c, g.a]);
			c = Math.max(c, g.b);
		}
		if (c < to) parts.push([c, to]);
		for (const [a, b] of parts) {
			if (b - a < .02) continue;
			if (axis === "x") this.blocks.push({
				floor,
				x0: a,
				x1: b,
				z0: fixed - WT / 2,
				z1: fixed + WT / 2
			});
			else this.blocks.push({
				floor,
				x0: fixed - WT / 2,
				x1: fixed + WT / 2,
				z0: a,
				z1: b
			});
		}
	}
	addDoor(floor, axis, fixed, a, b, swing, id) {
		const width = b - a;
		const h = 2.12;
		const pivot = new Group();
		const yaw = axis === "x" ? 0 : -Math.PI / 2;
		if (axis === "x") pivot.position.set(a, 0, fixed);
		else pivot.position.set(fixed, 0, a);
		pivot.rotation.y = yaw;
		const leaf = new Mesh(this.box(width - .04, h, .045), this.arch.wood);
		leaf.position.set(width / 2, h / 2, 0);
		leaf.castShadow = true;
		const band = new Mesh(this.box(width - .08, .08, .05), this.arch.sage);
		band.position.set(width / 2, 1.05, 0);
		const handle = new Mesh(this.box(.03, .12, .06), this.arch.sage);
		handle.position.set(width - .12, 1.02, 0);
		leaf.userData.kind = "door";
		leaf.userData.door = id;
		pivot.add(leaf, band, handle);
		pivot.userData.kind = "door";
		pivot.userData.door = id;
		pivot.userData.swing = swing;
		this.openings[floor].add(pivot);
		const block = axis === "x" ? {
			floor,
			x0: a,
			x1: b,
			z0: fixed - .18,
			z1: fixed + .18
		} : {
			floor,
			x0: fixed - .18,
			x1: fixed + .18,
			z0: a,
			z1: b
		};
		this.doors.push({
			id,
			floor,
			pivot,
			yaw,
			angle: 0,
			target: 0,
			block
		});
	}
	rail(floor, x0, z0, x1, z1) {
		const parent = this.grow[floor];
		const mat = this.arch.wood;
		const dx = x1 - x0;
		const dz = z1 - z0;
		const len = Math.hypot(dx, dz) || .01;
		const mx = (x0 + x1) / 2;
		const mz = (z0 + z1) / 2;
		const yaw = Math.atan2(dx, dz);
		const top = new Mesh(new BoxGeometry(.08, .08, len), mat);
		top.position.set(mx, .92, mz);
		top.rotation.y = yaw;
		top.castShadow = true;
		const mid = new Mesh(new BoxGeometry(.04, .04, len), mat);
		mid.position.set(mx, .48, mz);
		mid.rotation.y = yaw;
		parent.add(top, mid);
		const n = Math.max(2, Math.floor(len / 1.1));
		for (let i = 0; i <= n; i++) {
			const t = i / n;
			const p = new Mesh(new BoxGeometry(.06, .92, .06), mat);
			p.position.set(x0 + dx * t, .46, z0 + dz * t);
			p.castShadow = true;
			parent.add(p);
		}
		const thick = .12;
		if (Math.abs(dx) >= Math.abs(dz)) this.blocks.push({
			floor,
			x0: Math.min(x0, x1),
			x1: Math.max(x0, x1),
			z0: mz - thick,
			z1: mz + thick
		});
		else this.blocks.push({
			floor,
			x0: mx - thick,
			x1: mx + thick,
			z0: Math.min(z0, z1),
			z1: Math.max(z0, z1)
		});
	}
	buildStairs(wood) {
		const railMat = this.arch.wood;
		for (const level of [0, 1]) {
			const parent = new Group();
			parent.visible = false;
			this.floors[level].add(parent);
			this.stairGroups[level] = parent;
			const base = level * 3;
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
					ySoffit: base + yTop - RISER
				});
				const post = new Mesh(new CylinderGeometry(.025, .025, .7, 6), railMat);
				post.position.set(STAIR.west0 + .04, yTop + .35, (z0 + z1) / 2);
				parent.add(post);
			}
			this.slopeRail(parent, railMat, STAIR.west0 + .05, STAIR.zStart, STAIR.zStart + STAIR.steps * STAIR.tread, RISER, (STAIR.steps + 1) * RISER);
			this.slopeRail(parent, railMat, STAIR.west1 - .02, STAIR.zStart, STAIR.zStart + STAIR.steps * STAIR.tread, RISER, (STAIR.steps + 1) * RISER);
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
					ySoffit: base + yTop - RISER
				});
			}
			this.slopeRail(parent, railMat, STAIR.east0 + .02, LAND_Z, STAIR.zStart, STAIR.steps * RISER + RISER, 3 + RISER * .2);
			this.slopeRail(parent, railMat, STAIR.east1 - .04, LAND_Z, STAIR.zStart, STAIR.steps * RISER + RISER, 3);
			const landY = STAIR.steps * RISER;
			const landZ1 = Math.min(ZD - .28, LAND_Z + 2.05);
			this.addBox(parent, wood, (STAIR.west0 + STAIR.east1) / 2, landY - .06, (LAND_Z + landZ1) / 2, STAIR.east1 - STAIR.west0, .12, landZ1 - LAND_Z);
			this.treads.push({
				x0: STAIR.west0,
				x1: STAIR.east1,
				z0: LAND_Z,
				z1: landZ1,
				yTop: base + landY,
				ySoffit: base + landY - .12
			});
			this.addBox(parent, railMat, (STAIR.west1 + STAIR.east0) / 2, landY + .4, LAND_Z, Math.max(.2, STAIR.east0 - STAIR.west1), .8, .06);
			this.blocks.push({
				floor: level,
				x0: STAIR.west1,
				x1: STAIR.east0,
				z0: LAND_Z - .06,
				z1: LAND_Z + .1
			});
		}
	}
	slopeRail(parent, mat, x, z0, z1, y0, y1) {
		const ay = y0 + .72;
		const by = y1 + .72;
		const len = Math.hypot(z1 - z0, by - ay);
		const rail = new Mesh(new CylinderGeometry(.03, .03, len, 8), mat);
		rail.position.set(x, (ay + by) / 2, (z0 + z1) / 2);
		rail.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), new Vector3(0, by - ay, z1 - z0).normalize());
		rail.castShadow = true;
		parent.add(rail);
	}
	buildGardens(mats) {
		const patch = (floor, x, z, w, d) => {
			const m = this.addBox(this.slabs[floor], mats.grass, x, .03 + SLAB_T, z, w, .04, d, false);
			m.castShadow = false;
		};
		patch(1, 8.4, 2.35, 3.2, 2.2);
		patch(1, 13.2, 2.5, 3.4, 2.4);
		patch(2, 2.5, 2.3, 3.2, 2.6);
		const plantAt = (floor, x, z, s) => {
			const parent = this.furn[floor];
			const trunk = new Mesh(new CylinderGeometry(.03, .05, .28 * s, 6), mats.trunk);
			trunk.position.set(x, .14 * s, z);
			const crown = new Mesh(new SphereGeometry(.22 * s, 10, 8), mats.leaf);
			crown.position.set(x, .32 * s, z);
			crown.castShadow = true;
			parent.add(trunk, crown);
		};
		plantAt(1, 6.3, 1.1, 1.1);
		plantAt(1, 7.4, 3.2, .8);
		plantAt(1, 10.4, .8, 1.3);
		plantAt(1, 14.6, 3.3, 1);
		plantAt(1, 11.6, 3.4, .7);
		plantAt(2, 1.1, 1.2, 1);
		plantAt(2, 4.2, 3.5, .85);
		plantAt(2, 3.6, .7, 1.15);
		for (let i = 0; i < 5; i++) this.addBox(this.slabs[1], mats.deck, 6.4 + i * .28, .025 + SLAB_T, 2.2, .22, .03, 1.6, false);
	}
	buildLabels() {
		for (const r of ROOMS) {
			const sprite = this.makeLabel(r.name);
			sprite.position.set((r.x0 + r.x1) / 2, r.id.startsWith("hall") ? .35 : 1.45, (r.z0 + r.z1) / 2);
			this.floors[r.floor].add(sprite);
			sprite.userData.room = true;
			this.labels.push(sprite);
		}
	}
	makeLabel(text) {
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
		const tex = new CanvasTexture(c);
		tex.colorSpace = SRGBColorSpace;
		const mat = new SpriteMaterial({
			map: tex,
			transparent: true,
			depthWrite: false
		});
		const sprite = new Sprite(mat);
		sprite.scale.set(2.4, .6, 1);
		return sprite;
	}
	buildLamps() {
		for (const spot of [
			{
				floor: 0,
				x: 2.6,
				z: 8.1
			},
			{
				floor: 0,
				x: 12.6,
				z: 7.8
			},
			{
				floor: 0,
				x: 2.5,
				z: 2
			},
			{
				floor: 0,
				x: 9.2,
				z: 2.3
			},
			{
				floor: 0,
				x: 13.3,
				z: 2.1
			},
			{
				floor: 0,
				x: 6.4,
				z: 2.1
			},
			{
				floor: 1,
				x: 2.6,
				z: 8
			},
			{
				floor: 1,
				x: 12.6,
				z: 6.4
			},
			{
				floor: 1,
				x: 12.5,
				z: 8.9
			},
			{
				floor: 1,
				x: 2.6,
				z: 2.1
			},
			{
				floor: 2,
				x: 2.6,
				z: 8
			},
			{
				floor: 2,
				x: 12.6,
				z: 8
			},
			{
				floor: 1,
				x: 10.2,
				z: 1.5,
				y: .42,
				dim: true
			},
			{
				floor: 2,
				x: 2.5,
				z: 1.7,
				y: .42,
				dim: true
			}
		]) {
			const y = spot.y ?? 2.45;
			const light = new PointLight("#ffc98a", 0, spot.dim ? 3.2 : 6.5, 2);
			light.position.set(spot.x, y, spot.z);
			const bulb = new Mesh(new SphereGeometry(spot.dim ? .045 : .06, 8, 8), this.bulbMat);
			bulb.position.copy(light.position);
			this.floors[spot.floor].add(light, bulb);
			this.lamps.push({
				light,
				bulb,
				floor: spot.floor,
				dim: spot.dim
			});
		}
	}
	planLines() {
		const pts = [];
		const seg = (x0, z0, x1, z1) => {
			pts.push(x0, .06, z0, x1, .06, z1);
		};
		seg(0, 0, XW, 0);
		seg(XW, 0, XW, ZD);
		seg(XW, ZD, 0, ZD);
		seg(0, ZD, 0, 0);
		seg(0, Z_C0, XW, Z_C0);
		seg(0, Z_C1, XW, Z_C1);
		seg(X_B, 0, X_B, Z_C0);
		seg(X_L, 0, X_L, Z_C0);
		seg(11, 0, 11, Z_C0);
		seg(X_ST0, Z_C1, X_ST0, ZD);
		seg(X_ST1, Z_C1, X_ST1, ZD);
		const geo = new BufferGeometry();
		geo.setAttribute("position", new Float32BufferAttribute(pts, 3));
		const lines = new LineSegments(geo, this.planMat);
		this.scene.add(lines);
	}
	loadFurniture() {
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
		for (const id of ASSET_IDS) loader.load(`/models/${id}.glb`, (gltf) => {
			gltf.scene.traverse((ch) => {
				const mesh = ch;
				if (mesh.isMesh) this.projectUV(mesh);
			});
			this.templates[id] = gltf.scene;
			step();
		}, void 0, () => {
			this.templates[id] = new Group();
			step();
		});
	}
	placeAll() {
		this.furnBlocks = [];
		this.movables = [];
		this.movableById.clear();
		let saved = {};
		try {
			saved = JSON.parse(localStorage.getItem("huixing-moves") || "{}");
		} catch {
			saved = {};
		}
		STATIC_ITEMS.forEach((p, i) => this.place(p, i, saved));
	}
	place(p, index, saved) {
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
		if (canMove) obj.traverse((ch) => {
			ch.userData.movable = id;
		});
		this.furn[p.floor].add(obj);
		const block = spec.block ? {
			floor: p.floor,
			x0: 0,
			x1: 0,
			z0: 0,
			z1: 0
		} : null;
		if (block) this.furnBlocks.push(block);
		const item = {
			id,
			obj,
			floor: p.floor,
			w: spec.w,
			d: spec.d,
			block,
			homeX: p.x,
			homeZ: p.z,
			homeRot: p.rot
		};
		this.syncBlock(item);
		if (!canMove) return;
		this.movables.push(item);
		this.movableById.set(id, item);
	}
	projectUV(mesh) {
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
		geo.setAttribute("uv", new BufferAttribute(uv, 2));
	}
	dress(root) {
		root.traverse((ch) => {
			const mesh = ch;
			if (!mesh.isMesh) return;
			const name = (mesh.material?.name || "").toLowerCase();
			mesh.material = this.bucket(name);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
		});
	}
	bucket(name) {
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
	syncBlock(item) {
		if (!item.block) return;
		const swap = Math.abs(Math.sin(item.obj.rotation.y)) > .7;
		const w = (swap ? item.d : item.w) / 2;
		const d = (swap ? item.w : item.d) / 2;
		item.block.floor = item.floor;
		item.block.x0 = item.obj.position.x - w;
		item.block.x1 = item.obj.position.x + w;
		item.block.z0 = item.obj.position.z - d;
		item.block.z1 = item.obj.position.z + d;
	}
	persistMoves() {
		const data = {};
		for (const m of this.movables) data[m.id] = {
			x: m.obj.position.x,
			z: m.obj.position.z,
			rot: m.obj.rotation.y
		};
		try {
			localStorage.setItem("huixing-moves", JSON.stringify(data));
		} catch {}
	}
	aim(e) {
		const rect = this.canvas.getBoundingClientRect();
		this.pointer.x = (e.clientX - rect.left) / rect.width * 2 - 1;
		this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
	}
	pickMovable(e) {
		this.aim(e);
		const cam = this.view === "ortho" ? this.ortho : this.persp;
		this.ray.setFromCamera(this.pointer, cam);
		const hits = this.ray.intersectObjects(this.movables.map((m) => m.obj), true);
		for (const hit of hits) {
			let o = hit.object;
			while (o) {
				const id = o.userData.movable;
				if (id && this.movableById.has(id)) return this.movableById.get(id) ?? null;
				o = o.parent;
			}
		}
		return null;
	}
	floorPoint(e, floor) {
		this.aim(e);
		const cam = this.view === "ortho" ? this.ortho : this.persp;
		this.ray.setFromCamera(this.pointer, cam);
		this.dragPlane.set(new Vector3(0, 1, 0), -this.floors[floor].position.y);
		return this.ray.ray.intersectPlane(this.dragPlane, this.dragHit) ? this.dragHit : null;
	}
	clampMove(floor, x, z) {
		x = Math.max(.35, Math.min(XW - .35, x));
		z = Math.max(.3, Math.min(ZD - .3, z));
		if (floor > 0 && x > STAIR.x0 + .25 && x < STAIR.x1 - .25 && z > STAIR.z0 + .25 && z < STAIR.z1 - .25) {
			const dx0 = Math.abs(x - STAIR.x0);
			const dx1 = Math.abs(x - STAIR.x1);
			const dz0 = Math.abs(z - STAIR.z0);
			const dz1 = Math.abs(z - STAIR.z1);
			const m = Math.min(dx0, dx1, dz0, dz1);
			if (m === dx0) x = STAIR.x0 - .2;
			else if (m === dx1) x = STAIR.x1 + .2;
			else if (m === dz0) z = STAIR.z0 - .2;
			else z = STAIR.z1 + .2;
		}
		if (floor === 2 && !(x <= 5.3 || z >= 4.15)) z = Z_C0 + .35;
		return {
			x,
			z
		};
	}
	select(item) {
		this.selected = item;
		if (!item) {
			this.ring.visible = false;
			this.ring.removeFromParent();
			return;
		}
		item.obj.add(this.ring);
		this.ring.visible = true;
		const s = Math.max(item.w, item.d) * .85;
		this.ring.scale.set(s, s, 1);
	}
	footprint(p) {
		const spec = CATALOG[p.asset];
		if (!spec.block) return null;
		const swap = Math.abs(Math.sin(p.rot)) > .7;
		const w = swap ? spec.d : spec.w;
		const d = swap ? spec.w : spec.d;
		return {
			floor: p.floor,
			x0: p.x - w / 2,
			x1: p.x + w / 2,
			z0: p.z - d / 2,
			z1: p.z + d / 2
		};
	}
	rebuildFurnBlocks() {
		this.furnBlocks = [];
		for (const p of STATIC_ITEMS) {
			const b = this.footprint(p);
			if (b) this.furnBlocks.push(b);
		}
	}
	bind() {
		this.onDown = (e) => {
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
		this.onMove = (e) => {
			if (this.view === "fps" && document.pointerLockElement === this.canvas) {
				this.yaw -= e.movementX * .0022;
				this.pitch -= e.movementY * .0022;
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
				this.dragFurn.obj.position.y = .08;
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
				this.theta -= dx * .005;
				this.phi = Math.max(.22, Math.min(1.35, this.phi - dy * .004));
			} else if (this.drag.mode === "pan") {
				const s = .012 * (this.view === "ortho" ? this.orthoHalf / 8 : this.radius / 20);
				this.target.x -= dx * s;
				this.target.z += dy * s;
			}
		};
		this.onUp = (e) => {
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
		this.onWheel = (e) => {
			e.preventDefault();
			if (this.view === "ortho") this.orthoHalf = Math.max(3.2, Math.min(16, this.orthoHalf * (e.deltaY > 0 ? 1.08 : .92)));
			else if (this.view === "fps") this.pitch = Math.max(-1.1, Math.min(1.1, this.pitch - Math.sign(e.deltaY) * .08));
			else this.radius = Math.max(6, Math.min(48, this.radius * (e.deltaY > 0 ? 1.08 : .92)));
		};
		this.onKeyDown = (e) => {
			this.keys.add(e.code);
			if (this.selected && this.view !== "fps" && (e.code === "KeyQ" || e.code === "KeyE")) {
				this.selected.obj.rotation.y += e.code === "KeyQ" ? .18 : -.18;
				this.syncBlock(this.selected);
				this.persistMoves();
				e.preventDefault();
			}
			if ([
				"Space",
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight"
			].includes(e.code)) e.preventDefault();
		};
		this.onKeyUp = (e) => {
			this.keys.delete(e.code);
		};
		this.onBlur = () => {
			this.keys.clear();
			this.stick.x = 0;
			this.stick.y = 0;
		};
		this.onMenu = (e) => e.preventDefault();
		this.onLock = () => {};
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
	click(e) {
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
		this.pointer.x = (e.clientX - rect.left) / rect.width * 2 - 1;
		this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
		const cam = this.view === "ortho" ? this.ortho : this.persp;
		if (this.view === "fps" && document.pointerLockElement === this.canvas) this.pointer.set(0, 0);
		this.ray.setFromCamera(this.pointer, cam);
		const hits = this.ray.intersectObjects(this.floors, true);
		for (const hit of hits) {
			let o = hit.object;
			while (o) {
				if (o.userData.kind === "door" && typeof o.userData.door === "string") {
					this.toggleDoor(o.userData.door);
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
	toggleDoor(id) {
		const d = this.doors.find((door) => door.id === id);
		if (!d) return;
		const swing = d.pivot.userData.swing ?? this.swingOf(d);
		d.target = Math.abs(d.target) > .4 ? 0 : swing;
	}
	swingOf(d) {
		return d.pivot.userData.swing || -1.15;
	}
	floorFromY(y) {
		let best = 0;
		let score = Infinity;
		for (let i = 0; i < 3; i++) {
			const ly = y - this.floors[i].position.y;
			if (ly < -.35 || ly > 3.29) continue;
			const s = Math.abs(ly - 1.1);
			if (s < score) {
				score = s;
				best = i;
			}
		}
		return best;
	}
	roomAt(floor, x, z) {
		let best = null;
		let margin = -Infinity;
		for (const r of ROOMS) {
			if (r.floor !== floor) continue;
			const m = Math.min(x - r.x0, r.x1 - x, z - r.z0, r.z1 - z);
			if (m > margin) {
				margin = m;
				best = r.id;
			}
		}
		return margin > -.25 ? best : null;
	}
	frame() {
		if (this.disposed) return;
		const now = performance.now();
		const dt = Math.min(.05, (now - this.last) / 1e3);
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
	applyIntro() {
		const ease = (t) => {
			const x = Math.max(0, Math.min(1, t));
			return x * x * (3 - 2 * x);
		};
		const growAt = (id, dur) => ease((this.intro - stepAt(id)) / dur);
		for (let i = 0; i < 3; i++) {
			const slabId = [
				"slab0",
				"slab1",
				"slab2"
			][i];
			const wallId = [
				"wall0",
				"wall1",
				"wall2"
			][i];
			const openId = [
				"open0",
				"open1",
				"open2"
			][i];
			this.slabs[i].scale.y = Math.max(.001, growAt(slabId, 1.05));
			this.grow[i].scale.y = Math.max(.001, growAt(wallId, WALL_GROW[i]));
			const open = growAt(openId, .7);
			this.openings[i].visible = open > .08;
			this.openings[i].position.y = (1 - open) * -.12;
			const furnLag = ease((this.intro - stepAt("furn") - i * .22) / 1.15);
			this.furn[i].visible = furnLag > .04;
			this.furn[i].position.y = (1 - furnLag) * -.7;
		}
		for (const level of [0, 1]) {
			const stair = growAt(level === 0 ? "stair0" : "stair1", .85);
			const group = this.stairGroups[level];
			if (!group) continue;
			group.visible = stair > .05;
			group.position.y = (1 - stair) * -.9;
		}
		this.roofReveal = growAt("roof", 1.15);
		this.roofGroup.scale.y = Math.max(.001, this.roofReveal);
		this.planMat.opacity = 1 - ease((this.intro - stepAt("wall0")) / 1.5);
		if (!this.grabbed && this.view === "doll") this.driveBuildCamera(ease);
		this.syncStep();
	}
	driveBuildCamera(ease) {
		const endR = this.exploded ? 42 : 30;
		const endY = this.exploded ? 6.2 : 2.4;
		const keys = [
			{
				t: 0,
				phi: .42,
				theta: .2,
				radius: 22,
				tx: XW / 2,
				ty: .3,
				tz: ZD / 2
			},
			{
				t: stepAt("wall0"),
				phi: .98,
				theta: .62,
				radius: 20,
				tx: 7.2,
				ty: 2.6,
				tz: 5.2
			},
			{
				t: stepAt("slab2"),
				phi: 1.06,
				theta: 1.05,
				radius: 26,
				tx: 7.6,
				ty: 5.4,
				tz: 5
			},
			{
				t: stepAt("roof"),
				phi: .76,
				theta: 1.28,
				radius: 28,
				tx: 7.8,
				ty: 6.6,
				tz: 5
			},
			{
				t: stepAt("settle"),
				phi: .9,
				theta: 1.75,
				radius: 32,
				tx: 7.6,
				ty: 6.2,
				tz: 5.2
			},
			{
				t: INTRO_DUR,
				phi: 1.02,
				theta: 2.55,
				radius: endR,
				tx: 7.6,
				ty: endY,
				tz: 5.2
			}
		];
		let a = keys[0];
		let b = keys[keys.length - 1];
		const t = this.intro;
		for (let i = 0; i < keys.length - 1; i++) if (t >= keys[i].t && t <= keys[i + 1].t) {
			a = keys[i];
			b = keys[i + 1];
			break;
		}
		const k = ease((t - a.t) / Math.max(.001, b.t - a.t));
		this.phi = a.phi + (b.phi - a.phi) * k;
		this.theta = a.theta + (b.theta - a.theta) * k;
		this.radius = a.radius + (b.radius - a.radius) * k;
		this.target.set(a.tx + (b.tx - a.tx) * k, a.ty + (b.ty - a.ty) * k, a.tz + (b.tz - a.tz) * k);
	}
	syncStep() {
		let index = 0;
		for (let i = 0; i < BUILD_STEPS.length; i++) if (this.intro >= BUILD_STEPS[i].t) index = i;
		if (index === this.stepIndex) return;
		this.stepIndex = index;
		this.hooks.onStep(index);
	}
	animateFloors(dt) {
		const k = 1 - Math.exp(-5 * dt);
		for (let i = 0; i < 3; i++) {
			const built = !this.introOn || this.intro >= stepAt("settle");
			const dest = i * 3 + (built && this.exploded ? i * LIFT : 0);
			if (this.view === "fps") this.floors[i].position.y = i * 3;
			else this.floors[i].position.y += (dest - this.floors[i].position.y) * k;
		}
	}
	animateDoors(dt) {
		const k = 1 - Math.exp(-10 * dt);
		for (const d of this.doors) {
			d.angle += (d.target - d.angle) * k;
			d.pivot.rotation.y = d.yaw + d.angle;
		}
	}
	animateTweens() {
		for (const tw of this.tweens) {
			const t = (this.clock - tw.start - tw.delay) / tw.dur;
			if (t < 0) continue;
			const x = Math.max(0, Math.min(1, t));
			const e = x * x * (3 - 2 * x);
			tw.obj.position.set(tw.fromX + (tw.toX - tw.fromX) * e, tw.fromY + (tw.toY - tw.fromY) * e, tw.fromZ + (tw.toZ - tw.fromZ) * e);
			tw.obj.rotation.y = tw.fromRot + (tw.toRot - tw.fromRot) * e;
			tw.obj.scale.setScalar(tw.fromS + (tw.toS - tw.fromS) * e);
		}
		this.tweens = this.tweens.filter((tw) => {
			if (this.clock < tw.start + tw.delay + tw.dur) return true;
			if (tw.remove) tw.obj.parent?.remove(tw.obj);
			return false;
		});
	}
	held() {
		return this.qaKeys ?? this.keys;
	}
	movePlayer(dt) {
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
		this.speed = Math.hypot(stepX, stepZ) / Math.max(dt, 1e-4);
		this.tryStep(stepX, 0);
		this.tryStep(0, stepZ);
		if (keys.has("Space")) this.pitch = Math.min(1.05, this.pitch + dt * .8);
		this.yaw -= this.lookDX * .005;
		this.pitch -= this.lookDY * .005;
		this.lookDX = 0;
		this.lookDY = 0;
		this.pitch = Math.max(-1.15, Math.min(1.15, this.pitch));
	}
	tryStep(dx, dz) {
		const nx = this.foot.x + dx;
		const nz = this.foot.z + dz;
		const y = this.support(nx, nz, this.foot.y);
		if (y == null) return;
		if (Math.abs(y - this.foot.y) > .42 && y > this.foot.y) return;
		const floor = Math.max(0, Math.min(2, Math.floor((y + .25) / 3)));
		if (this.hits(floor, nx, nz)) return;
		if (this.headroom(nx, nz, y)) return;
		this.foot.x = nx;
		this.foot.z = nz;
		this.foot.y = y;
	}
	support(x, z, foot) {
		let best = null;
		let bestAbs = .55;
		const consider = (y) => {
			const d = y - foot;
			if (d > .38) return;
			if (d < -.55) return;
			const ad = Math.abs(d);
			if (ad < bestAbs) {
				bestAbs = ad;
				best = y;
			}
		};
		if (this.onSlab(0, x, z)) consider(0);
		if (this.onSlab(1, x, z)) consider(3);
		if (this.onSlab(2, x, z)) consider(6);
		if (z < 0 && z > -2.3 && x > 4.1 && x < 9.3) consider(0);
		for (const t of this.treads) {
			if (x < t.x0 || x > t.x1 || z < t.z0 || z > t.z1) continue;
			consider(t.yTop);
		}
		return best;
	}
	onSlab(level, x, z) {
		if (level === 0) return x >= -.05 && x <= 15.65 && z >= -.05 && z <= 10.25;
		if (level === 1) {
			if (x < 0 || x > 15.6 || z < 0 || z > 10.2) return false;
			return !this.inHole(x, z);
		}
		if (!(x >= 0 && x <= 5.3 && z >= 0 && z <= 10.2 || x >= 5.3 && x <= 9.6 && z >= 4.2 && z <= 10.2 || x >= 9.6 && x <= 15.6 && z >= 4.2 && z <= 10.2)) return false;
		return !this.inHole(x, z);
	}
	inHole(x, z) {
		return x > STAIR.x0 + .02 && x < STAIR.x1 - .02 && z > STAIR.z0 + .02 && z < STAIR.z1 - .02;
	}
	hits(floor, x, z) {
		const test = (b) => {
			if (b.floor !== floor) return false;
			const cx = Math.max(b.x0, Math.min(x, b.x1));
			const cz = Math.max(b.z0, Math.min(z, b.z1));
			return (x - cx) ** 2 + (z - cz) ** 2 < PLAYER_R * PLAYER_R;
		};
		if (this.blocks.some(test)) return true;
		if (this.furnBlocks.some(test)) return true;
		for (const d of this.doors) {
			if (Math.abs(d.angle) > .55) continue;
			if (test(d.block)) return true;
		}
		return false;
	}
	headroom(x, z, foot) {
		const need = this.eye === "child" ? 1.2 : 1.7;
		let low = Infinity;
		for (const t of this.treads) {
			if (x < t.x0 || x > t.x1 || z < t.z0 || z > t.z1) continue;
			if (t.ySoffit > foot + .05) low = Math.min(low, t.ySoffit);
		}
		return low - foot < need;
	}
	applyVisibility() {
		const solo = this.view === "ortho" || this.view === "cut";
		for (let i = 0; i < 3; i++) {
			const show = this.introOn ? true : this.focus === "all" ? solo ? i === 0 : true : this.focus === i;
			this.floors[i].visible = show;
		}
		const hideShell = this.view === "doll" && (!this.introOn || this.intro >= stepAt("settle"));
		for (const m of this.shell) m.visible = !hideShell;
		const showRoof = this.introOn && this.roofReveal > .04 && this.intro < stepAt("settle") || !this.introOn && this.ceilings && this.view !== "ortho" && this.view !== "cut";
		for (const m of this.roofs) m.visible = showRoof;
		const labelsOn = !this.introOn || this.intro >= stepAt("furn");
		for (const s of this.labels) s.visible = this.view !== "fps" && (s.userData.room ? labelsOn : true);
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
		this.glassMat.emissiveIntensity = lamp * .45;
	}
	applyTime() {
		const t = sampleTime(this.timeOfDay);
		const sky = new Color(t.skyA).lerp(new Color(t.skyB), t.f);
		const ground = new Color(t.groundA).lerp(new Color(t.groundB), t.f);
		this.scene.background = sky;
		if (this.scene.fog instanceof Fog) this.scene.fog.color.copy(sky);
		this.hemi.color.copy(sky);
		this.hemi.groundColor.copy(ground);
		const decor = DECORS.find((item) => item.id === this.decorId) ?? DECORS[0];
		this.hemi.groundColor.lerp(new Color(decor.floor), this.timeOfDay > 4.2 ? .12 : .42);
		this.hemi.intensity = t.amb;
		this.sun.intensity = t.sun;
		this.sun.color.set(t.elev < 12 ? "#ffb27a" : "#fff2dd");
		const elev = MathUtils.degToRad(t.elev);
		const az = MathUtils.degToRad(t.az);
		const dist = 36;
		this.sun.position.set(Math.cos(elev) * Math.sin(az) * dist + XW / 2, Math.sin(elev) * dist + 4, Math.cos(elev) * Math.cos(az) * dist + ZD / 2);
	}
	applyCamera() {
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
		this.persp.position.set(this.target.x + this.radius * sinP * Math.sin(this.theta), this.target.y + this.radius * Math.cos(this.phi), this.target.z + this.radius * sinP * Math.cos(this.theta));
		this.persp.up.set(0, 1, 0);
		this.persp.lookAt(this.target);
	}
	installProbe() {
		const self = this;
		window.__controlsTest = {
			getYaw: () => self.yaw,
			getSpeed: () => self.speed,
			getPos: () => ({
				x: self.foot.x,
				y: self.foot.y,
				z: self.foot.z
			}),
			setKeys: (codes) => {
				self.qaKeys = codes ? new Set(codes) : null;
			},
			setPose: (x, z, yaw) => {
				self.foot.set(x, 0, z);
				const y = self.support(x, z, 0);
				self.foot.y = y ?? 0;
				self.yaw = yaw;
				self.pitch = 0;
			},
			setView: (v) => self.setView(v),
			screenOf: (id) => {
				const item = self.movableById.get(id);
				if (!item) return null;
				const v = new Vector3();
				item.obj.getWorldPosition(v);
				v.y += .35;
				const cam = self.view === "ortho" ? self.ortho : self.persp;
				v.project(cam);
				const rect = self.canvas.getBoundingClientRect();
				return {
					x: rect.left + (v.x * .5 + .5) * rect.width,
					y: rect.top + (-v.y * .5 + .5) * rect.height,
					wx: item.obj.position.x,
					wz: item.obj.position.z,
					floor: item.floor
				};
			},
			findItem: (room) => self.movables.find((m) => m.id.startsWith(room + "-"))?.id ?? null,
			buildAt: (t) => {
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
				shell: self.shell[0]?.visible ?? false
			})
		};
		for (const d of this.doors) {
			if (!d.pivot.userData.swing) d.pivot.userData.swing = this.doorSwingFromId(d);
			if (d.id === "entry" || d.id.startsWith("stair") || d.id === "hall-garden" || d.id === "flex-garden") d.target = d.pivot.userData.swing;
		}
	}
	doorSwingFromId(d) {
		if (d.id === "entry" || d.id.startsWith("stair") || d.id === "service" || d.id === "wc") return -1.15;
		if (d.id === "b-hall" || d.id === "office-hall" || d.id === "kit-hall" || d.id === "flex-hall" || d.id === "hall-garden" || d.id === "b-lobby") return 1.15;
		if (d.id === "read-garden") return 1.2;
		return -1.15;
	}
};
var SLAB_T = .16;
var SLAB_HALF = SLAB_T / 2;
function describeRoom(id) {
	const room = roomById(id);
	if (!room) return null;
	const m = roomMetrics(room);
	const rows = STATIC_ITEMS.filter((p) => p.room === id);
	const seen = /* @__PURE__ */ new Set();
	const furniture = [];
	for (const p of rows) {
		if (seen.has(p.asset)) continue;
		seen.add(p.asset);
		furniture.push({
			name: CATALOG[p.asset].name,
			file: p.asset
		});
	}
	return {
		...room,
		area: m.area,
		span: m.span,
		deep: m.deep,
		clear: m.clear,
		furniture,
		sceneName: "教学布置",
		change: room.note
	};
}
var VIEWS = [
	{
		id: "doll",
		label: "立体剖视"
	},
	{
		id: "ortho",
		label: "正交俯视"
	},
	{
		id: "cut",
		label: "1.35m 剖切"
	},
	{
		id: "fps",
		label: "漫游"
	}
];
var TOOLS = [
	{
		id: "look",
		label: "观察",
		text: "看门洞、窗台和净高。点击门扇可以开合。"
	},
	{
		id: "scale",
		label: "尺度",
		text: "儿童视线 1.12 米，成人 1.60 米。家具按这个高度对照。"
	},
	{
		id: "flow",
		label: "动线",
		text: "主入口对着塔子山公园。过道向东直通厨房。后勤门在东侧，不穿过儿童主路。"
	}
];
function CenterApp() {
	const canvasRef = (0, import_react.useRef)(null);
	const worldRef = (0, import_react.useRef)(null);
	const [view, setView] = (0, import_react.useState)("doll");
	const [focus, setFocus] = (0, import_react.useState)("all");
	const [explode, setExplode] = (0, import_react.useState)(true);
	const [ceilings, setCeilings] = (0, import_react.useState)(false);
	const [decor, setDecor] = (0, import_react.useState)(DECORS[0].id);
	const [eye, setEye] = (0, import_react.useState)("child");
	const [time, setTime] = (0, import_react.useState)(1.15);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [introDone, setIntroDone] = (0, import_react.useState)(false);
	const [buildStep, setBuildStep] = (0, import_react.useState)(0);
	const [roomId, setRoomId] = (0, import_react.useState)(null);
	const [pinned, setPinned] = (0, import_react.useState)(false);
	const [tool, setTool] = (0, import_react.useState)("look");
	const [blown, setBlown] = (0, import_react.useState)(false);
	const pinnedRef = (0, import_react.useRef)(false);
	pinnedRef.current = pinned;
	const nub = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const [, bump] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const world = new KindergartenWorld(canvas, {
			onProgress: setProgress,
			onReady: () => setReady(true),
			onRoom: (id) => {
				setRoomId((prev) => prev === id && !pinnedRef.current ? null : id);
			},
			onIntro: (done) => {
				if (done) setIntroDone(true);
			},
			onStep: (index) => setBuildStep(index)
		});
		worldRef.current = world;
		const onResize = () => world.resize();
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
			world.dispose();
			worldRef.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		worldRef.current?.setView(view);
	}, [view]);
	(0, import_react.useEffect)(() => {
		worldRef.current?.setFocus(focus);
	}, [focus]);
	(0, import_react.useEffect)(() => {
		worldRef.current?.setExplode(explode);
	}, [explode]);
	(0, import_react.useEffect)(() => {
		worldRef.current?.setCeilings(ceilings);
	}, [ceilings]);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("huixing-decor");
		if (saved && DECORS.some((d) => d.id === saved)) setDecor(saved);
	}, []);
	(0, import_react.useEffect)(() => {
		worldRef.current?.setDecor(decor);
	}, [decor]);
	(0, import_react.useEffect)(() => {
		worldRef.current?.setEye(eye);
	}, [eye]);
	(0, import_react.useEffect)(() => {
		worldRef.current?.setTime(time);
	}, [time]);
	const room = roomId ? describeRoom(roomId) : null;
	const viewName = VIEWS.find((v) => v.id === view)?.label ?? "";
	const decorMeta = DECORS.find((d) => d.id === decor) ?? DECORS[0];
	const weather = weatherAt(time);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "stage",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			"aria-label": "彗行自然实践中心三维模型"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hud",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "topbar",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "brand-block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "kicker",
								children: "成都 · 塔子山公园"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "brand-name",
								children: "自然实践中心"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "time-block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "time-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: weather.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: weather.weather })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "时间",
								type: "range",
								min: 0,
								max: 5,
								step: .01,
								value: time,
								onChange: (e) => setTime(Number(e.target.value))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "meta",
							children: [
								viewName,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								decorMeta.name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "icon-btn",
							type: "button",
							onClick: () => void document.documentElement.requestFullscreen?.(),
							"aria-label": "全屏",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { size: 16 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "icon-btn",
							type: "button",
							onClick: () => {
								setIntroDone(false);
								setView("doll");
								worldRef.current?.replay();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { size: 16 }), "重播"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "side left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "视角" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "stack",
							children: VIEWS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: view === v.id ? "chip wide active" : "chip wide",
								type: "button",
								onClick: () => setView(v.id),
								children: v.label
							}, v.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "身高" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stack",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: eye === "child" ? "chip wide active" : "chip wide",
								type: "button",
								onClick: () => setEye("child"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonStanding, { size: 16 }), "儿童 1.12m"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: eye === "adult" ? "chip wide active" : "chip wide",
								type: "button",
								onClick: () => setEye("adult"),
								children: "成人 1.60m"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "note",
							children: "教室、阅读室和办公室里的物件可以按住拖动，松手放下，Q / E 旋转。厨房和卫生间保持固定。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "chip wide",
							type: "button",
							onClick: () => worldRef.current?.resetMoves(),
							children: "家具复位"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "film",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "装修效果" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "note",
							children: "十二张效果图。点大图看全貌，点名字就换整栋的墙面、地面、木作和织物。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "shot-hero",
							type: "button",
							onClick: () => setBlown(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: decorMeta.image,
								alt: decorMeta.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: decorMeta.name }), decorMeta.note] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "film-list",
							children: DECORS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: decor === item.id ? "shot active" : "shot",
								type: "button",
								onClick: () => setDecor(item.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.image,
									alt: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }), item.note] })]
							}, item.id))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dock",
					children: [
						[
							"0",
							"1",
							"2",
							"all"
						].map((id) => {
							const f = id === "all" ? "all" : Number(id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: focus === f ? "chip active" : "chip",
								type: "button",
								onClick: () => setFocus(f),
								children: id === "all" ? "全部" : id === "0" ? "一层" : id === "1" ? "二层" : "三层"
							}, id);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: explode ? "chip active" : "chip",
							type: "button",
							onClick: () => setExplode((v) => !v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { size: 15 }), explode ? "分层" : "合并"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: ceilings ? "chip active" : "chip",
							type: "button",
							onClick: () => setCeilings((v) => !v),
							children: [ceilings ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 15 }), "屋顶"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mobile-only",
							children: VIEWS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: view === v.id ? "chip active" : "chip",
								type: "button",
								onClick: () => setView(v.id),
								children: v.label
							}, v.id))
						})
					]
				}),
				room ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: room.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "muted",
								children: floorName(room.floor)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"面积 ",
								room.area.toFixed(1),
								" ㎡"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "muted",
								children: [
									"净高 ",
									room.clear.toFixed(2),
									" m"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"开间 ",
								room.span.toFixed(1),
								" m"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"进深 ",
								room.deep.toFixed(1),
								" m"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "note",
							children: ["适合：", room.suit]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "note",
							children: room.change
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: room.furniture.length ? room.furniture.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [item.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "muted",
							children: [
								" ",
								item.file,
								".glb"
							]
						})] }, item.file)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "以空间本身为主" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-actions",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "chip",
									type: "button",
									onClick: () => worldRef.current?.focusRoom(room.id),
									children: "定位"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "chip",
									type: "button",
									onClick: () => {
										setPinned((v) => !v);
									},
									children: pinned ? "已固定" : "固定"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "chip",
									type: "button",
									onClick: () => setRoomId(null),
									children: "关闭"
								})
							]
						})
					]
				}) : null,
				blown ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lightbox",
					role: "dialog",
					"aria-label": decorMeta.name,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "lightbox-back",
							type: "button",
							onClick: () => setBlown(false),
							children: "收起"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: decorMeta.image,
							alt: decorMeta.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lightbox-cap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: decorMeta.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: decorMeta.note })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lightbox-row",
							children: DECORS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: decor === item.id ? "mini active" : "mini",
								type: "button",
								onClick: () => setDecor(item.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.image,
									alt: item.name
								})
							}, item.id))
						})
					]
				}) : null,
				view === "fps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hint",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-actions",
							children: TOOLS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: tool === item.id ? "chip active" : "chip",
								type: "button",
								onClick: () => setTool(item.id),
								children: item.label
							}, item.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: TOOLS.find((item) => item.id === tool)?.text }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "W A S D 移动，A 向左、D 向右。Shift 加速，Space 抬头，滚轮微调俯仰。点击门扇开合。" })
					]
				}) : null,
				view === "fps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "crosshair" }) : null,
				view === "fps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "stick-wrap",
					onPointerDown: (e) => {
						e.currentTarget.setPointerCapture(e.pointerId);
						aimStick(e, worldRef.current, nub, () => bump((n) => n + 1));
					},
					onPointerMove: (e) => {
						if (e.currentTarget.hasPointerCapture(e.pointerId)) aimStick(e, worldRef.current, nub, () => bump((n) => n + 1));
					},
					onPointerUp: (e) => {
						worldRef.current?.setStick(0, 0);
						nub.current = {
							x: 0,
							y: 0
						};
						bump((n) => n + 1);
						e.currentTarget.releasePointerCapture(e.pointerId);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "nub",
						style: {
							left: `${2.25 + nub.current.x * 2.1}rem`,
							top: `${2.25 - nub.current.y * 2.1}rem`
						}
					})
				}) : null,
				view === "fps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "look-pad",
					onPointerDown: (e) => {
						e.currentTarget.setPointerCapture(e.pointerId);
						e.currentTarget.dataset.x = String(e.clientX);
						e.currentTarget.dataset.y = String(e.clientY);
					},
					onPointerMove: (e) => {
						if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
						const px = Number(e.currentTarget.dataset.x || e.clientX);
						const py = Number(e.currentTarget.dataset.y || e.clientY);
						worldRef.current?.setLook(e.clientX - px, e.clientY - py);
						e.currentTarget.dataset.x = String(e.clientX);
						e.currentTarget.dataset.y = String(e.clientY);
					}
				}) : null,
				!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "load",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "load-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "kicker",
								children: "家具与门窗"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "正在把生活搬进来" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "32 件家具带着木纹、织物和石材贴图。别墅四周是塔子山公园的草坪和树木。" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${Math.round(progress * 100)}%` } })
							})
						]
					})
				}) : null,
				ready && !introDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "intro",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "intro-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "kicker",
								children: [
									"施工 ",
									buildStep + 1,
									" / ",
									BUILD_STEPS.length
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: BUILD_STEPS[buildStep]?.name ?? "放线" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: BUILD_STEPS[buildStep]?.hint }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "build-steps",
								children: BUILD_STEPS.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: i === buildStep ? "now" : i < buildStep ? "done" : "",
									children: step.name
								}, step.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "card-actions",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "chip active",
									type: "button",
									onClick: () => {
										worldRef.current?.skipIntro();
										setIntroDone(true);
									},
									children: "跳过施工"
								})
							})
						]
					})
				}) : null
			]
		})]
	});
}
function floorName(floor) {
	return floor === 0 ? "一层" : floor === 1 ? "二层" : "三层";
}
function weatherAt(t) {
	return [
		{
			name: "早晨",
			weather: "薄雾，东向微光"
		},
		{
			name: "上午",
			weather: "晴朗，冷白昼光"
		},
		{
			name: "正午",
			weather: "高照，影子很短"
		},
		{
			name: "下午",
			weather: "暖黄侧光"
		},
		{
			name: "黄昏",
			weather: "窗边余温"
		},
		{
			name: "夜晚",
			weather: "室内灯火"
		}
	][Math.max(0, Math.min(5, Math.round(t)))];
}
function aimStick(e, world, nub, refresh) {
	const rect = e.currentTarget.getBoundingClientRect();
	let x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
	let y = -((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
	const m = Math.hypot(x, y) || 1;
	if (m > 1) {
		x /= m;
		y /= m;
	}
	nub.current = {
		x,
		y
	};
	world?.setStick(x, y);
	refresh();
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenterApp, {});
}
//#endregion
export { Home as component };
