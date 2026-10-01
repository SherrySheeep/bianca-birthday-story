import { useCallback, useEffect, useRef, useState } from "react";
import { chapterSixAfter, chapterSixOpening, chapterSixPreExam, chapterSixRules, chapterSixSuccess, type ChapterSixLine } from "../data/chapterSixDialogue";
import { SectionHeader } from "./UI";

type Props = { onComplete: () => void; paused?: boolean };
type Stage = "opening" | "mission" | "preExam" | "rules" | "readyReply" | "game" | "retry" | "success" | "reward" | "after" | "completed";
const lanes = [25, 50, 75];
const asset = (name: string) => `${import.meta.env.BASE_URL}chapter-six/${name}`;
const amberAsset = (portrait: number) => `${import.meta.env.BASE_URL}chapter-five/Anbo${portrait}.png`;

export function ChapterSixStory({ onComplete, paused = false }: Props) {
  const [stage, setStage] = useState<Stage>("opening");
  const [lineIndex, setLineIndex] = useState(0);
  const [lane, setLane] = useState(1);
  const laneRef = useRef(1);
  const [round, setRound] = useState(0);
  const [ringLane, setRingLane] = useState(1);
  const [ringKey, setRingKey] = useState(0);
  const [hits, setHits] = useState(0);
  const hitsRef = useRef(0);
  const previousRingLane = useRef(1);
  const [perfect, setPerfect] = useState(false);
  const [amberLoaded, setAmberLoaded] = useState(false);
  const inputLocked = useRef(false);
  const inputTimer = useRef<number | undefined>(undefined);

  const lines: ChapterSixLine[] = stage === "opening" ? chapterSixOpening : stage === "preExam" ? chapterSixPreExam : stage === "rules" ? chapterSixRules : stage === "success" ? chapterSixSuccess : chapterSixAfter;
  const currentLine = lines[Math.min(lineIndex, lines.length - 1)];

  useEffect(() => () => window.clearTimeout(inputTimer.current), []);
  useEffect(() => setAmberLoaded(false), [currentLine?.portrait]);

  const move = useCallback((direction: -1 | 1) => {
    if (stage !== "game" || paused) return;
    setLane((current) => {
      const next = Math.max(0, Math.min(2, current + direction));
      laneRef.current = next;
      return next;
    });
  }, [stage, paused]);

  useEffect(() => {
    if (stage !== "game") return;
    const keyHandler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [stage, move]);

  useEffect(() => {
    if (stage !== "readyReply" || paused) return;
    const timer = window.setTimeout(() => startGame(), 700);
    return () => window.clearTimeout(timer);
  }, [stage, paused]);

  useEffect(() => {
    if (stage !== "mission" || paused) return;
    const timer = window.setTimeout(() => { setLineIndex(0); setStage("preExam"); }, 900);
    return () => window.clearTimeout(timer);
  }, [stage, paused]);

  useEffect(() => {
    if (stage !== "game" || paused) return;
    if (round >= 7) {
      const timer = window.setTimeout(() => {
        setLineIndex(0);
        setStage(hitsRef.current >= 5 ? "success" : "retry");
      }, 350);
      return () => window.clearTimeout(timer);
    }
    const choices = [0, 1, 2].filter((value) => Math.abs(value - previousRingLane.current) <= 1);
    const nextLane = choices[Math.floor(Math.random() * choices.length)] ?? 1;
    previousRingLane.current = nextLane;
    setRingLane(nextLane);
    setRingKey((value) => value + 1);
    setPerfect(false);
    const collision = window.setTimeout(() => {
      if (laneRef.current === nextLane) {
        hitsRef.current += 1;
        setHits(hitsRef.current);
        setPerfect(true);
      }
    }, 1650);
    const next = window.setTimeout(() => setRound((value) => value + 1), 2050);
    return () => { window.clearTimeout(collision); window.clearTimeout(next); };
  }, [stage, round, paused]);

  const startGame = () => {
    setLane(1); laneRef.current = 1;
    setRound(0); setHits(0); hitsRef.current = 0;
    previousRingLane.current = 1;
    setPerfect(false);
    setStage("game");
  };

  const advance = () => {
    if (paused || inputLocked.current) return;
    inputLocked.current = true;
    inputTimer.current = window.setTimeout(() => { inputLocked.current = false; }, 240);
    if (lineIndex < lines.length - 1) { setLineIndex((value) => value + 1); return; }
    setLineIndex(0);
    if (stage === "opening") setStage("mission");
    if (stage === "preExam") setStage("rules");
    if (stage === "rules") setStage("readyReply");
    if (stage === "success") setStage("reward");
    if (stage === "after") setStage("completed");
  };

  const dialogueStage = ["opening", "preExam", "rules", "success", "after"].includes(stage);
  const portrait = currentLine?.portrait ?? 3;

  return (
    <section className="scene chapter-six-story">
      <SectionHeader number="06" kicker="FLIGHT EXAM" title="蒙德城飞行考试">
        <p>只有一场考试。理论上，应该不会再从天上掉下来。</p>
      </SectionHeader>

      {stage !== "game" && stage !== "retry" && (
        <div className="chapter-six-visual">
          <div className="chapter-six-placeholder">飞行训练场<br /><small>feixing1.png</small></div>
          <img className="chapter-six-background" src={asset("feixing1.png")} alt="蒙德飞行考试训练场" onLoad={(event) => event.currentTarget.parentElement?.classList.add("has-chapter-six-bg")} onError={(event) => { event.currentTarget.hidden = true; }} />
          {dialogueStage && (
            <>
              {!amberLoaded && <div className="chapter-six-amber-placeholder">安柏<br /><small>Anbo{portrait}.png</small></div>}
              <img key={portrait} className="chapter-six-amber" src={amberAsset(portrait)} alt={`安柏表情 ${portrait}`} onLoad={() => setAmberLoaded(true)} onError={(event) => { event.currentTarget.hidden = true; setAmberLoaded(false); }} />
            </>
          )}
        </div>
      )}

      {dialogueStage && (
        <div className="chapter-six-dialogue" key={`${stage}-${lineIndex}`}>
          <span className={`dialogue-speaker speaker-${currentLine.speaker}`}>{currentLine.speaker}</span>
          <p className={stage === "preExam" && currentLine.text.includes("勇气") ? "courage-line" : ""}>{currentLine.text}</p>
          {stage === "rules" && lineIndex === 2 && <div className="control-hint">← 向左　　向右 →</div>}
          <button className="dialogue-next" onClick={advance}>{stage === "rules" && lineIndex === lines.length - 1 ? "开始考试" : "继续"}</button>
        </div>
      )}

      {stage === "mission" && <div className="chapter-six-notice"><b>任务：通过飞行执照考试</b></div>}
      {stage === "readyReply" && <div className="chapter-six-dialogue"><span className="dialogue-speaker speaker-Bianca">Bianca</span><p>……其实没有。</p></div>}

      {stage === "game" && (
        <div className="flight-game">
          <img className="flight-game-bg" src={asset("feixing2.png")} alt="飞行考试天空" onError={(event) => { event.currentTarget.hidden = true; }} />
          <div className="flight-game-hud"><b>飞行考试</b><span>通过：{hits} / 7</span></div>
          {round < 7 && <img key={ringKey} className="wind-ring" style={{ left: `${lanes[ringLane]}%` }} src={asset("fengquan1.png")} alt="风圈" onError={(event) => { event.currentTarget.hidden = true; }} />}
          <img className="flight-pilot" style={{ left: `${lanes[lane]}%` }} src={asset("pilot1.png")} alt="正在使用风之翼的 Bianca" onError={(event) => { event.currentTarget.hidden = true; }} />
          {perfect && <div className="perfect-pop">漂亮！</div>}
          <div className="flight-controls"><button onClick={() => move(-1)} aria-label="向左">←</button><button onClick={() => move(1)} aria-label="向右">→</button></div>
        </div>
      )}

      {stage === "retry" && <div className="chapter-six-result"><img src={amberAsset(3)} alt="友好的安柏" /><div><h3>差一点！再试一次吧！</h3><p>这次通过了 {hits} / 7 个风圈。</p><button className="dialogue-next" onClick={startGame}>重新挑战</button></div></div>}

      {stage === "reward" && <div className="flight-licence"><img src={asset("pilot1.png")} alt="Bianca 飞行徽章" /><span>✓ 飞行考试通过</span><h3>获得：蒙德飞行执照</h3><b>持有人：Bianca</b><p>B老师成功拿到了来到异世界后的第一张证件。</p><small>虽然她现在最想要的，是一张回悉尼的机票。</small><button className="dialogue-next" onClick={() => { setLineIndex(0); setStage("after"); }}>继续</button></div>}

      {stage === "completed" && <div className="chapter-six-completion"><div className="checkin-complete">✓ 第六章完成</div><p>B老师成功拿到了来到异世界后的第一张证件。</p><small>虽然她真正想要的是一张回悉尼的机票。</small><button className="dialogue-next return-airport" onClick={onComplete}>返回旅程</button></div>}
    </section>
  );
}
