import { useEffect, useRef, useState } from "react";
import { birthdayCakeScene, chapterTenCakeReveal, chapterTenFriends, chapterTenHeldItem, chapterTenKtvWake, chapterTenTable, chapterTenWall, chapterTenWaypointActive, chapterTenWaypointIdle, type ChapterTenLine } from "../data/chapterTenDialogue";
import { SectionHeader } from "./UI";

type Props = { onComplete: () => void; paused?: boolean };
type Phase = "wall" | "waypointIdle" | "waypointActive" | "transition" | "ktvWake" | "friends" | "mysteriousItemHeld" | "mysteriousItemTable" | "ritual" | "countdown" | "openEyes" | "cakeReveal" | "chapterComplete";

const root = `${import.meta.env.BASE_URL}chapter-ten/`;
const sceneAsset = (name: string) => `${root}scenes/${name}`;
const characterAsset = (name: string) => `${root}characters/${name}`;

function portraitSource(portrait?: ChapterTenLine["portrait"]) {
  if (portrait === "flins1") return `${import.meta.env.BASE_URL}chapter-eight/FLS1.png`;
  if (portrait === "flins2") return `${import.meta.env.BASE_URL}chapter-eight/FLS2.png`;
  if (portrait === "cindy") return characterAsset("Cindy1.png");
  if (portrait === "sherry") return characterAsset("Sherry1.png");
  return null;
}

export function ChapterTenStory({ onComplete, paused = false }: Props) {
  const [phase, setPhase] = useState<Phase>("wall");
  const [lineIndex, setLineIndex] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const lock = useRef(false);
  const lockTimer = useRef<number | undefined>(undefined);

  const lines = phase === "wall" ? chapterTenWall
    : phase === "waypointIdle" ? chapterTenWaypointIdle
    : phase === "waypointActive" ? chapterTenWaypointActive
    : phase === "ktvWake" ? chapterTenKtvWake
    : phase === "friends" ? chapterTenFriends
    : phase === "mysteriousItemHeld" ? chapterTenHeldItem
    : phase === "mysteriousItemTable" ? chapterTenTable
    : chapterTenCakeReveal;
  const currentLine = lines[Math.min(lineIndex, lines.length - 1)];
  const portrait = portraitSource(currentLine?.portrait);

  useEffect(() => () => window.clearTimeout(lockTimer.current), []);

  useEffect(() => {
    if (phase !== "transition" || paused) return;
    const timer = window.setTimeout(() => { setLineIndex(0); setPhase("ktvWake"); }, 1200);
    return () => window.clearTimeout(timer);
  }, [phase, paused]);

  useEffect(() => {
    if (phase !== "countdown" || paused) return;
    const timer = window.setTimeout(() => {
      if (countdown > 1) setCountdown((value) => value - 1);
      else setPhase("openEyes");
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [phase, countdown, paused]);

  const advance = () => {
    if (paused || lock.current) return;
    lock.current = true;
    lockTimer.current = window.setTimeout(() => { lock.current = false; }, 220);
    if (lineIndex < lines.length - 1) { setLineIndex((value) => value + 1); return; }
    setLineIndex(0);
    if (phase === "wall") setPhase("waypointIdle");
    if (phase === "waypointIdle") setPhase("waypointActive");
    if (phase === "waypointActive") setPhase("transition");
    if (phase === "ktvWake") setPhase("friends");
    if (phase === "friends") setPhase("mysteriousItemHeld");
    if (phase === "mysteriousItemHeld") setPhase("mysteriousItemTable");
    if (phase === "mysteriousItemTable") setPhase("ritual");
    if (phase === "cakeReveal") setPhase("chapterComplete");
  };

  const sceneName = phase === "wall" ? "chengqiang1.png"
    : phase === "waypointIdle" ? "maodian1.png"
    : phase === "waypointActive" ? "maodian2.png"
    : phase === "ktvWake" || phase === "friends" ? "KTV1.png"
    : phase === "mysteriousItemHeld" ? "KTV2.png"
    : phase === "mysteriousItemTable" ? "KTV3.png"
    : birthdayCakeScene;
  const dialoguePhase = ["wall", "waypointIdle", "waypointActive", "ktvWake", "friends", "mysteriousItemHeld", "mysteriousItemTable", "cakeReveal"].includes(phase);

  return <section className="scene chapter-ten-story">
    <SectionHeader number="10" kicker="THE WAY HOME" title="回到现实">
      <p>带好那个东西，别松手。归途这次真的就在眼前。</p>
    </SectionHeader>

    {dialoguePhase && <>
      <div className={`chapter-ten-visual phase-${phase}`}>
        <div className="chapter-ten-placeholder">场景图片<br /><small>{sceneName}</small></div>
        <img className="chapter-ten-background" src={sceneAsset(sceneName)} alt="归途场景" onError={(event) => { event.currentTarget.hidden = true; }} />
        {portrait && <img className="chapter-ten-portrait" src={portrait} alt={`${currentLine.speaker}立绘`} onError={(event) => { event.currentTarget.hidden = true; }} />}
      </div>
      <div className="chapter-ten-dialogue" key={`${phase}-${lineIndex}`}><span className={`dialogue-speaker speaker-${currentLine.speaker}`}>{currentLine.speaker}</span><p>{currentLine.text}</p><button className="dialogue-next" onClick={advance}>{phase === "waypointActive" && lineIndex === lines.length - 1 ? "启动锚点" : "继续"}</button></div>
    </>}

    {phase === "transition" && <div className="reality-transition"><div className="waypoint-orbit">✦</div><b>正在连接……</b></div>}

    {phase === "ritual" && <div className="final-ritual-card"><span>✦ 最后的异界共鸣 ✦</span><h3>请做好准备</h3><ol><li>请将神秘物品放在面前。</li><li>闭上眼睛。</li><li>安静地等待三秒。</li></ol><div className="ritual-chat"><p><b>Bianca：</b>……真的要这样吗？</p><p><b>神秘提示：</b>是的。</p><p><b>Bianca：</b>好吧。</p></div><button className="sticker-button" onClick={() => { setCountdown(3); setPhase("countdown"); }}>闭上眼睛</button></div>}

    {phase === "countdown" && <div className="eyes-closed"><small>请保持闭眼</small><strong key={countdown}>{countdown}</strong></div>}

    {phase === "openEyes" && <div className="open-eyes-card"><span>✦</span><h3>现在，可以睁开眼睛了。</h3><button className="sticker-button" onClick={() => { setLineIndex(0); setPhase("cakeReveal"); }}>睁开眼睛</button></div>}

    {phase === "chapterComplete" && <div className="chapter-ten-completion"><div className="checkin-complete">✓ Chapter 10 Complete</div><p>神秘物品安全抵达现实世界。</p><small>至于接下来——先许愿，先切蛋糕。</small><button className="dialogue-next return-airport" onClick={onComplete}>Ending</button></div>}
  </section>;
}

export function EndingPlaceholder() {
  return <section className="scene ending-placeholder"><div className="chapter-ten-completion"><span className="final-kicker">ENDING · COMING SOON</span><h2>故事的最后一页，正在准备中。</h2><p>先回到生日聚会吧。</p></div></section>;
}
