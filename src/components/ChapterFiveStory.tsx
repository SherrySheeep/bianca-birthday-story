import { useEffect, useRef, useState } from "react";
import { chapterFiveDialogue } from "../data/chapterFiveDialogue";
import { SectionHeader } from "./UI";

type Props = { onComplete: () => void; paused?: boolean };
type Stage = "intro" | "flight" | "anomaly" | "flash" | "air" | "falling" | "crash" | "amberIntro" | "amber" | "dragging" | "completed";

const asset = (name: string) => `${import.meta.env.BASE_URL}chapter-five/${name}`;
const introLines = ["应该很快就到了吧。", "希望这次别再出什么怪事了。"];
const anomalyLines = ["……？", "等一下，这云是不是有点太多了——", "不是吧？？？"];
const airLines = ["……啊？", "我怎么在飞？？？", "等等！我不会这个啊啊啊！！！"];
const crashLines = ["……我还活着吗？", "这到底是哪儿啊？！"];

export function ChapterFiveStory({ onComplete, paused = false }: Props) {
  const [stage, setStage] = useState<Stage>("intro");
  const [lineIndex, setLineIndex] = useState(0);
  const [nodeId, setNodeId] = useState("amberOpening");
  const inputLocked = useRef(false);
  const inputTimer = useRef<number | undefined>(undefined);
  const node = chapterFiveDialogue[nodeId];

  useEffect(() => () => window.clearTimeout(inputTimer.current), []);
  useEffect(() => {
    if (paused) return;
    const delay = stage === "flight" ? 2400 : stage === "flash" ? 1000 : stage === "falling" ? 850 : stage === "amberIntro" ? 450 : stage === "dragging" ? 750 : 0;
    if (!delay) return;
    const timer = window.setTimeout(() => {
      if (stage === "flight") { setLineIndex(0); setStage("anomaly"); }
      if (stage === "flash") { setLineIndex(0); setStage("air"); }
      if (stage === "falling") { setLineIndex(0); setStage("crash"); }
      if (stage === "amberIntro") setStage("amber");
      if (stage === "dragging") setStage("completed");
    }, delay);
    return () => window.clearTimeout(timer);
  }, [stage, paused]);

  const lockInput = () => {
    if (paused || inputLocked.current) return false;
    inputLocked.current = true;
    inputTimer.current = window.setTimeout(() => { inputLocked.current = false; }, 260);
    return true;
  };

  const advanceLines = (lines: string[]) => {
    if (!lockInput()) return;
    if (lineIndex < lines.length - 1) setLineIndex((value) => value + 1);
    else if (stage === "intro") setStage("flight");
    else if (stage === "anomaly") setStage("flash");
    else if (stage === "air") setStage("falling");
    else if (stage === "crash") setStage("amberIntro");
  };

  const advanceAmber = () => {
    if (!lockInput()) return;
    if (node.finalNarration) setStage("dragging");
    else if (node.next) setNodeId(node.next);
  };

  const sceneImage = stage === "air" || stage === "falling" ? "chengjiao1.png" : "chengjiao2.png";
  const showMondstadt = ["air", "falling", "crash", "amberIntro", "amber", "dragging", "completed"].includes(stage);

  return (
    <section className={`scene flight-scene chapter-five-story stage-${stage}`}>
      <SectionHeader number="05" kicker="NOW BOARDING" title="下一站：中国（？）">
        <p>{showMondstadt ? "航线似乎发生了一点……非常规偏移。" : "请系好安全带，快乐即将起飞。"}</p>
      </SectionHeader>

      {!showMondstadt && (
        <div className={`chapter-five-route ${stage === "flight" || stage === "anomaly" || stage === "flash" ? "route-active" : ""}`}>
          <div className="travel-map-placeholder">旅行地图<br /><small>TravelMap1.png</small></div>
          <img
            className="travel-map-background"
            src={asset("TravelMap1.png")}
            alt="悉尼到青海的手账旅行地图"
            onLoad={(event) => event.currentTarget.parentElement?.classList.add("has-travel-map")}
            onError={(event) => {
              event.currentTarget.hidden = true;
              event.currentTarget.parentElement?.classList.remove("has-travel-map");
            }}
          />
          <svg className="chapter-five-route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 82 78 Q 67 56 45 35" pathLength="100" />
          </svg>
          <img className="chapter-five-plane" src={asset("Plane1.png")} alt="飞往青海的小飞机" onError={(event) => { event.currentTarget.hidden = true; }} />
          {(stage === "anomaly" || stage === "flash") && (
            <div className="dimensional-clouds">
              {[1, 2, 3, 4, 5].map((number) => <img key={number} src={asset(`Cloud${number}.png`)} alt="" onError={(event) => { event.currentTarget.hidden = true; }} />)}
            </div>
          )}
          {(stage === "anomaly" || stage === "flash") && <div className="dimension-glow" />}
          {stage === "flash" && <div className="dimension-flash" />}
        </div>
      )}

      {showMondstadt && (
        <div className={`mondstadt-visual ${stage === "falling" ? "is-falling" : ""} ${stage === "dragging" ? "is-dragging" : ""}`}>
          <div className="mondstadt-placeholder">第五章场景图片<br /><small>{sceneImage}</small></div>
          <img
            key={sceneImage}
            className="mondstadt-background"
            src={asset(sceneImage)}
            alt={sceneImage === "chengjiao1.png" ? "从风之翼俯瞰蒙德城" : "蒙德城郊的草地"}
            onLoad={(event) => event.currentTarget.parentElement?.classList.add("has-mondstadt-image")}
            onError={(event) => {
              event.currentTarget.hidden = true;
              event.currentTarget.parentElement?.classList.remove("has-mondstadt-image");
            }}
          />
          {(stage === "amber" || stage === "dragging") && (
            <>
              <div className="amber-placeholder">安柏<br /><small>Anbo{node.portrait ?? 1}.png</small></div>
              <img
                key={node.portrait}
                className="amber-portrait"
                src={asset(`Anbo${node.portrait ?? 1}.png`)}
                alt={`安柏表情 ${node.portrait ?? 1}`}
                onLoad={(event) => event.currentTarget.parentElement?.classList.add("has-amber-image")}
                onError={(event) => {
                  event.currentTarget.hidden = true;
                  event.currentTarget.parentElement?.classList.remove("has-amber-image");
                }}
              />
            </>
          )}
          {stage === "falling" && <div className="wind-streaks" />}
        </div>
      )}

      {stage === "intro" && <Dialogue speaker="Bianca" text={introLines[lineIndex]} button={lineIndex === introLines.length - 1 ? "继续" : "继续"} onClick={() => advanceLines(introLines)} />}
      {stage === "flight" && <div className="chapter-five-status">航行中……</div>}
      {stage === "anomaly" && <Dialogue speaker="Bianca" text={anomalyLines[lineIndex]} onClick={() => advanceLines(anomalyLines)} />}
      {stage === "flash" && <div className="chapter-five-status">航线信号中断</div>}
      {stage === "air" && <Dialogue speaker="Bianca" text={airLines[lineIndex]} onClick={() => advanceLines(airLines)} />}
      {stage === "falling" && <div className="chapter-five-status danger">失去平衡——！</div>}
      {stage === "crash" && <Dialogue speaker="Bianca" text={crashLines[lineIndex]} onClick={() => advanceLines(crashLines)} />}
      {stage === "amber" && (
        <div className="chapter-five-dialogue" key={nodeId}>
          <span className={`dialogue-speaker speaker-${node.speaker}`}>{node.speaker}</span>
          <p>{node.text}</p>
          {node.options ? <div className="dialogue-options">{node.options.map((option) => <button key={option.label} onClick={() => { if (lockInput()) setNodeId(option.next); }}>{option.label}</button>)}</div> : <button className="dialogue-next" onClick={advanceAmber}>继续</button>}
        </div>
      )}
      {stage === "dragging" && <div className="chapter-five-status">正在被安柏拖走……</div>}
      {stage === "completed" && (
        <div className="chapter-five-dialogue chapter-five-completion">
          <div className="checkin-complete">✓ 第五章完成</div>
          <p>B老师就这样，在完全没搞清楚状况的情况下，被莫名其妙地拉去考飞行执照了捏。</p>
          <button className="dialogue-next return-airport" onClick={onComplete}>返回旅程</button>
        </div>
      )}
    </section>
  );
}

function Dialogue({ speaker, text, button = "继续", onClick }: { speaker: string; text: string; button?: string; onClick: () => void }) {
  return <div className="chapter-five-dialogue"><span className="dialogue-speaker speaker-Bianca">{speaker}</span><p>{text}</p><button className="dialogue-next" onClick={onClick}>{button}</button></div>;
}
