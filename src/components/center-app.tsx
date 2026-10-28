import { DECORS, type FloorIndex, type ViewMode } from "@/experience/data";
import { BUILD_STEPS, describeRoom, KindergartenWorld } from "@/experience/world";
import { Eye, EyeOff, Layers, Maximize2, PersonStanding, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type MutableRefObject, type PointerEvent as ReactPointerEvent } from "react";

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: "doll", label: "立体剖视" },
  { id: "ortho", label: "正交俯视" },
  { id: "cut", label: "1.35m 剖切" },
  { id: "fps", label: "漫游" },
];

const TOOLS = [
  { id: "look", label: "观察", text: "看门洞、窗台和净高。点击门扇可以开合。" },
  { id: "scale", label: "尺度", text: "儿童视线 1.12 米，成人 1.60 米。家具按这个高度对照。" },
  { id: "flow", label: "动线", text: "主入口对着塔子山公园。过道向东直通厨房。后勤门在东侧，不穿过儿童主路。" },
] as const;

export function CenterApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<KindergartenWorld | null>(null);
  const [view, setView] = useState<ViewMode>("doll");
  const [focus, setFocus] = useState<FloorIndex | "all">("all");
  const [explode, setExplode] = useState(true);
  const [ceilings, setCeilings] = useState(false);
  const [decor, setDecor] = useState(DECORS[0].id);
  const [eye, setEye] = useState<"child" | "adult">("child");
  const [time, setTime] = useState(1.15);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [tool, setTool] = useState<(typeof TOOLS)[number]["id"]>("look");
  const [blown, setBlown] = useState(false);
  const pinnedRef = useRef(false);
  pinnedRef.current = pinned;
  const nub = useRef({ x: 0, y: 0 });
  const [, bump] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const world = new KindergartenWorld(canvas, {
      onProgress: setProgress,
      onReady: () => setReady(true),
      onRoom: (id) => {
        setRoomId((prev) => (prev === id && !pinnedRef.current ? null : id));
      },
      onIntro: (done) => {
        if (done) setIntroDone(true);
      },
      onStep: (index) => setBuildStep(index),
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

  useEffect(() => {
    worldRef.current?.setView(view);
  }, [view]);
  useEffect(() => {
    worldRef.current?.setFocus(focus);
  }, [focus]);
  useEffect(() => {
    worldRef.current?.setExplode(explode);
  }, [explode]);
  useEffect(() => {
    worldRef.current?.setCeilings(ceilings);
  }, [ceilings]);
  useEffect(() => {
    const saved = localStorage.getItem("huixing-decor");
    if (saved && DECORS.some((d) => d.id === saved)) setDecor(saved);
  }, []);
  useEffect(() => {
    worldRef.current?.setDecor(decor);
  }, [decor]);
  useEffect(() => {
    worldRef.current?.setEye(eye);
  }, [eye]);
  useEffect(() => {
    worldRef.current?.setTime(time);
  }, [time]);

  const room = roomId ? describeRoom(roomId) : null;
  const viewName = VIEWS.find((v) => v.id === view)?.label ?? "";
  const decorMeta = DECORS.find((d) => d.id === decor) ?? DECORS[0];
  const weather = weatherAt(time);

  return (
    <main className="stage">
      <canvas ref={canvasRef} aria-label="彗行自然实践中心三维模型" />
      <div className="hud">
        <header className="topbar">
          <div className="brand-block">
            <div className="kicker">成都 · 塔子山公园</div>
            <div className="brand-name">自然实践中心</div>
          </div>
          <div className="time-block">
            <div className="time-row">
              <span>{weather.name}</span>
              <span>{weather.weather}</span>
            </div>
            <input
              aria-label="时间"
              type="range"
              min={0}
              max={5}
              step={0.01}
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
            />
          </div>
          <div className="meta">
            {viewName}
            <br />
            {decorMeta.name}
          </div>
          <button className="icon-btn" type="button" onClick={() => void document.documentElement.requestFullscreen?.()} aria-label="全屏">
            <Maximize2 size={16} />
          </button>
          <button
            className="icon-btn"
            type="button"
            onClick={() => {
              setIntroDone(false);
              setView("doll");
              worldRef.current?.replay();
            }}
          >
            <RotateCcw size={16} />
            重播
          </button>
        </header>

        <aside className="side left">
          <h2>视角</h2>
          <div className="stack">
            {VIEWS.map((v) => (
              <button key={v.id} className={view === v.id ? "chip wide active" : "chip wide"} type="button" onClick={() => setView(v.id)}>
                {v.label}
              </button>
            ))}
          </div>
          <h2>身高</h2>
          <div className="stack">
            <button className={eye === "child" ? "chip wide active" : "chip wide"} type="button" onClick={() => setEye("child")}>
              <PersonStanding size={16} />
              儿童 1.12m
            </button>
            <button className={eye === "adult" ? "chip wide active" : "chip wide"} type="button" onClick={() => setEye("adult")}>
              成人 1.60m
            </button>
          </div>
          <p className="note">教室、阅读室和办公室里的物件可以按住拖动，松手放下，Q / E 旋转。厨房和卫生间保持固定。</p>
          <button className="chip wide" type="button" onClick={() => worldRef.current?.resetMoves()}>
            家具复位
          </button>
        </aside>

        <aside className="film">
          <h2>装修效果</h2>
          <p className="note">十二张效果图。点大图看全貌，点名字就换整栋的墙面、地面、木作和织物。</p>
          <button className="shot-hero" type="button" onClick={() => setBlown(true)}>
            <img src={decorMeta.image} alt={decorMeta.name} />
            <span>
              <strong>{decorMeta.name}</strong>
              {decorMeta.note}
            </span>
          </button>
          <div className="film-list">
            {DECORS.map((item) => (
              <button key={item.id} className={decor === item.id ? "shot active" : "shot"} type="button" onClick={() => setDecor(item.id)}>
                <img src={item.image} alt={item.name} />
                <span>
                  <strong>{item.name}</strong>
                  {item.note}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="dock">
          {(["0", "1", "2", "all"] as const).map((id) => {
            const f = id === "all" ? "all" : (Number(id) as FloorIndex);
            const label = id === "all" ? "全部" : id === "0" ? "一层" : id === "1" ? "二层" : "三层";
            return (
              <button key={id} className={focus === f ? "chip active" : "chip"} type="button" onClick={() => setFocus(f)}>
                {label}
              </button>
            );
          })}
          <button className={explode ? "chip active" : "chip"} type="button" onClick={() => setExplode((v) => !v)}>
            <Layers size={15} />
            {explode ? "分层" : "合并"}
          </button>
          <button className={ceilings ? "chip active" : "chip"} type="button" onClick={() => setCeilings((v) => !v)}>
            {ceilings ? <Eye size={15} /> : <EyeOff size={15} />}
            屋顶
          </button>
          <span className="mobile-only">
            {VIEWS.map((v) => (
              <button key={v.id} className={view === v.id ? "chip active" : "chip"} type="button" onClick={() => setView(v.id)}>
                {v.label}
              </button>
            ))}
          </span>
        </div>

        {room ? (
          <article className="card">
            <div className="row">
              <h3>{room.name}</h3>
              <span className="muted">{floorName(room.floor)}</span>
            </div>
            <div className="row">
              <span>面积 {room.area.toFixed(1)} ㎡</span>
              <span className="muted">净高 {room.clear.toFixed(2)} m</span>
            </div>
            <div className="row">
              <span>开间 {room.span.toFixed(1)} m</span>
              <span>进深 {room.deep.toFixed(1)} m</span>
            </div>
            <p className="note">适合：{room.suit}</p>
            <p className="note">{room.change}</p>
            <ul>
              {room.furniture.length
                ? room.furniture.map((item) => (
                    <li key={item.file}>
                      {item.name}
                      <span className="muted"> {item.file}.glb</span>
                    </li>
                  ))
                : <li>以空间本身为主</li>}
            </ul>
            <div className="card-actions">
              <button className="chip" type="button" onClick={() => worldRef.current?.focusRoom(room.id)}>
                定位
              </button>
              <button
                className="chip"
                type="button"
                onClick={() => {
                  setPinned((v) => !v);
                }}
              >
                {pinned ? "已固定" : "固定"}
              </button>
              <button className="chip" type="button" onClick={() => setRoomId(null)}>
                关闭
              </button>
            </div>
          </article>
        ) : null}

        {blown ? (
          <div className="lightbox" role="dialog" aria-label={decorMeta.name}>
            <button className="lightbox-back" type="button" onClick={() => setBlown(false)}>
              收起
            </button>
            <img src={decorMeta.image} alt={decorMeta.name} />
            <div className="lightbox-cap">
              <strong>{decorMeta.name}</strong>
              <span>{decorMeta.note}</span>
            </div>
            <div className="lightbox-row">
              {DECORS.map((item) => (
                <button
                  key={item.id}
                  className={decor === item.id ? "mini active" : "mini"}
                  type="button"
                  onClick={() => setDecor(item.id)}
                >
                  <img src={item.image} alt={item.name} />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {view === "fps" ? (
          <div className="hint">
            <div className="card-actions">
              {TOOLS.map((item) => (
                <button key={item.id} className={tool === item.id ? "chip active" : "chip"} type="button" onClick={() => setTool(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
            <p>{TOOLS.find((item) => item.id === tool)?.text}</p>
            <p>W A S D 移动，A 向左、D 向右。Shift 加速，Space 抬头，滚轮微调俯仰。点击门扇开合。</p>
          </div>
        ) : null}
        {view === "fps" ? <div className="crosshair" /> : null}

        {view === "fps" ? (
          <div
            className="stick-wrap"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              aimStick(e, worldRef.current, nub, () => bump((n) => n + 1));
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) aimStick(e, worldRef.current, nub, () => bump((n) => n + 1));
            }}
            onPointerUp={(e) => {
              worldRef.current?.setStick(0, 0);
              nub.current = { x: 0, y: 0 };
              bump((n) => n + 1);
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
          >
            <div className="nub" style={{ left: `${2.25 + nub.current.x * 2.1}rem`, top: `${2.25 - nub.current.y * 2.1}rem` }} />
          </div>
        ) : null}
        {view === "fps" ? (
          <div
            className="look-pad"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              e.currentTarget.dataset.x = String(e.clientX);
              e.currentTarget.dataset.y = String(e.clientY);
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
              const px = Number(e.currentTarget.dataset.x || e.clientX);
              const py = Number(e.currentTarget.dataset.y || e.clientY);
              worldRef.current?.setLook(e.clientX - px, e.clientY - py);
              e.currentTarget.dataset.x = String(e.clientX);
              e.currentTarget.dataset.y = String(e.clientY);
            }}
          />
        ) : null}

        {!ready ? (
          <div className="load">
            <div className="load-copy">
              <p className="kicker">家具与门窗</p>
              <h2>正在把生活搬进来</h2>
              <p>32 件家具带着木纹、织物和石材贴图。别墅四周是塔子山公园的草坪和树木。</p>
              <div className="bar">
                <span style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            </div>
          </div>
        ) : null}

        {ready && !introDone ? (
          <div className="intro">
            <div className="intro-copy">
              <p className="kicker">施工 {buildStep + 1} / {BUILD_STEPS.length}</p>
              <h2>{BUILD_STEPS[buildStep]?.name ?? "放线"}</h2>
              <p>{BUILD_STEPS[buildStep]?.hint}</p>
              <ol className="build-steps">
                {BUILD_STEPS.map((step, i) => (
                  <li key={step.id} className={i === buildStep ? "now" : i < buildStep ? "done" : ""}>
                    {step.name}
                  </li>
                ))}
              </ol>
              <div className="card-actions">
                <button
                  className="chip active"
                  type="button"
                  onClick={() => {
                    worldRef.current?.skipIntro();
                    setIntroDone(true);
                  }}
                >
                  跳过施工
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function floorName(floor: FloorIndex) {
  return floor === 0 ? "一层" : floor === 1 ? "二层" : "三层";
}

function weatherAt(t: number) {
  const names = [
    { name: "早晨", weather: "薄雾，东向微光" },
    { name: "上午", weather: "晴朗，冷白昼光" },
    { name: "正午", weather: "高照，影子很短" },
    { name: "下午", weather: "暖黄侧光" },
    { name: "黄昏", weather: "窗边余温" },
    { name: "夜晚", weather: "室内灯火" },
  ];
  const i = Math.max(0, Math.min(5, Math.round(t)));
  return names[i];
}

function aimStick(
  e: ReactPointerEvent<HTMLDivElement>,
  world: KindergartenWorld | null,
  nub: MutableRefObject<{ x: number; y: number }>,
  refresh: () => void,
) {
  const rect = e.currentTarget.getBoundingClientRect();
  let x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
  let y = -((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
  const m = Math.hypot(x, y) || 1;
  if (m > 1) {
    x /= m;
    y /= m;
  }
  nub.current = { x, y };
  world?.setStick(x, y);
  refresh();
}
