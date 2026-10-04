import { useEffect, useMemo, useRef, useState } from "react";
import { chapterNineEnding, chapterNineLocations, chapterNineOpening, type ChapterNineLine, type ChapterNineLocation } from "../data/chapterNineContent";
import { SectionHeader } from "./UI";

type Props = { onComplete: () => void; paused?: boolean };
type Phase = "opening" | "task" | "map" | "location" | "message" | "ending" | "complete";

const root = `${import.meta.env.BASE_URL}chapter-nine/`;
const asset = (folder: string, name: string) => `${root}${folder}/${name}`;
const portraitSource = (line: ChapterNineLine) => {
  if (!line.portrait) return null;
  return line.portrait.folder === "existing" ? `${import.meta.env.BASE_URL}${line.portrait.file}` : asset("npcs", line.portrait.file);
};

export function ChapterNineStory({ onComplete, paused = false }: Props) {
  const [phase, setPhase] = useState<Phase>("opening");
  const [lineIndex, setLineIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [explored, setExplored] = useState<string[]>([]);
  const clickLock = useRef(false);
  const clickTimer = useRef<number | undefined>(undefined);

  const selected = chapterNineLocations.find((location) => location.id === selectedId) ?? null;
  const active = chapterNineLocations.find((location) => location.id === activeId) ?? null;
  const allExplored = explored.length === chapterNineLocations.length;
  const lines = phase === "opening" ? chapterNineOpening : phase === "ending" ? chapterNineEnding : active?.lines ?? [];
  const currentLine = lines[Math.min(lineIndex, Math.max(0, lines.length - 1))];
  const portrait = currentLine ? portraitSource(currentLine) : null;

  useEffect(() => () => window.clearTimeout(clickTimer.current), []);

  const advance = () => {
    if (paused || clickLock.current || !currentLine) return;
    clickLock.current = true;
    clickTimer.current = window.setTimeout(() => { clickLock.current = false; }, 220);
    if (lineIndex < lines.length - 1) { setLineIndex((value) => value + 1); return; }
    setLineIndex(0);
    if (phase === "opening") setPhase("task");
    if (phase === "location") setPhase("message");
    if (phase === "ending") setPhase("complete");
  };

  const startLocation = (location: ChapterNineLocation) => {
    if (explored.includes(location.id)) return;
    setActiveId(location.id); setSelectedId(null); setLineIndex(0); setPhase("location");
  };

  const returnToMap = () => {
    if (active && !explored.includes(active.id)) setExplored((items) => [...items, active.id]);
    setActiveId(null); setSelectedId(null); setLineIndex(0); setPhase("map");
  };

  const progress = useMemo(() => `${explored.length} / ${chapterNineLocations.length}`, [explored.length]);

  return <section className="scene chapter-nine-story">
    <SectionHeader number="09" kicker="FREE ROAM" title="蒙德城自由探索">
      <p>这次没有追兵，也不用考试。认真逛逛，顺便把散落的回响带回来。</p>
    </SectionHeader>

    {phase === "opening" && <>
      <div className="chapter-nine-visual opening"><img src={`${import.meta.env.BASE_URL}chapter-eight/shenyuanfashimen3.png`} alt="蒙德城外" />{portrait && <img className="chapter-nine-portrait" src={portrait} alt={currentLine.portrait?.alt} />}</div>
      <div className="chapter-nine-dialogue" key={lineIndex}><span className={`dialogue-speaker speaker-${currentLine.speaker}`}>{currentLine.speaker}</span><p>{currentLine.text}</p><button className="dialogue-next" onClick={advance}>继续</button></div>
    </>}

    {phase === "task" && <div className="chapter-nine-task"><span>任务更新</span><h3>探索蒙德城</h3><p>异世界的信息：0 / 8</p><button className="sticker-button" onClick={() => setPhase("map")}>打开地图</button></div>}

    {phase === "map" && <div className="mondstadt-map-page">
      <div className="map-progress"><b>异世界的信息</b><span>{progress}</span></div>
      <div className="mondstadt-map-frame">
        <div className="map-image-placeholder">蒙德旅行手账地图<br /><small>map/mondstadt-map.png</small></div>
        <img className="mondstadt-map-image" src={asset("map", "mondstadt-map.png")} alt="蒙德城探索地图" onError={(event) => { event.currentTarget.hidden = true; }} />
        {chapterNineLocations.map((location, index) => {
          const done = explored.includes(location.id);
          return <button className={`map-hotspot ${done ? "explored" : ""}`} style={{ left: `${location.position.left}%`, top: `${location.position.top}%` }} key={location.id} onClick={() => setSelectedId(location.id)} aria-label={location.name}><img src={asset("icons", location.icon)} alt="" onError={(event) => { event.currentTarget.hidden = true; }} /><span>{done ? "✓" : index + 1}</span><small>{location.name}</small></button>;
        })}
        {selected && <div className="map-location-card"><button className="map-card-close" onClick={() => setSelectedId(null)}>×</button><b>{selected.name}</b><small>{explored.includes(selected.id) ? "这里的回响已经收集完毕" : "似乎有微弱的异界气息"}</small><button disabled={explored.includes(selected.id)} onClick={() => startLocation(selected)}>{explored.includes(selected.id) ? "已探索" : "探索"}</button></div>}
      </div>
      {allExplored && <button className="sticker-button return-wall" onClick={() => { setLineIndex(0); setPhase("ending"); }}>回城墙找菲林斯</button>}
    </div>}

    {phase === "location" && active && <>
      <div className="chapter-nine-visual location"><div className="location-image-placeholder">{active.name}<br /><small>locations/{active.scene}</small></div><img src={asset("locations", active.scene)} alt={active.name} onError={(event) => { event.currentTarget.hidden = true; }} />{portrait && <img className="chapter-nine-portrait" src={portrait} alt={currentLine.portrait?.alt} onError={(event) => { event.currentTarget.hidden = true; }} />}</div>
      <div className="chapter-nine-dialogue" key={`${active.id}-${lineIndex}`}><span className={`dialogue-speaker speaker-${currentLine.speaker}`}>{currentLine.speaker}</span><p>{currentLine.text}</p><button className="dialogue-next" onClick={advance}>继续探索</button></div>
    </>}

    {phase === "message" && active && <div className="otherworld-message"><div className="message-tape" /><div className="message-avatar-placeholder">头像 {explored.length + 1}</div><img className="message-avatar" src={asset("messages", active.message.avatar)} alt="祝福头像" onError={(event) => { event.currentTarget.hidden = true; }} /><span>✦ 收集成功 ✦</span><h3>【{active.message.title}】</h3><p>{active.message.body}</p><small>—— {active.message.signature}</small><button className="sticker-button" onClick={returnToMap}>返回地图</button></div>}

    {phase === "ending" && <>
      <div className="chapter-nine-visual ending"><div className="location-image-placeholder">蒙德城墙高处<br /><small>locations/chengqiang1.png</small></div><img src={asset("locations", "chengqiang1.png")} alt="蒙德城墙高处" onError={(event) => { event.currentTarget.hidden = true; }} />{portrait && <img className="chapter-nine-portrait" src={portrait} alt={currentLine.portrait?.alt} />}</div>
      <div className="chapter-nine-dialogue" key={`ending-${lineIndex}`}><span className={`dialogue-speaker speaker-${currentLine.speaker}`}>{currentLine.speaker}</span><p>{currentLine.text}</p><button className="dialogue-next" onClick={advance}>继续</button></div>
    </>}

    {phase === "complete" && <div className="chapter-nine-completion"><div className="checkin-complete">✓ 第九章完成</div><p>蒙德城中残留的异界回响，终于被一一拾起。</p><small>接下来，归途近在眼前。</small><button className="dialogue-next return-airport" onClick={onComplete}>返回旅程</button></div>}
  </section>;
}
