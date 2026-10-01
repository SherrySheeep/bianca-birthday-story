import { useEffect, useRef, useState } from "react";
import { chapterSevenDialogue, type ChapterSevenLine, type ChapterSevenScene } from "../data/chapterSevenDialogue";
import { SectionHeader } from "./UI";

type Props = { onComplete: () => void; paused?: boolean };

const chapterAsset = (name: string) => `${import.meta.env.BASE_URL}chapter-seven/${name}`;
const amberAsset = (portrait: number) => `${import.meta.env.BASE_URL}chapter-five/Anbo${portrait}.png`;

const sceneAssets: Record<ChapterSevenScene, { image: string; alt: string }> = {
  gate: { image: "Mengde1.png", alt: "蒙德城门" },
  walk: { image: "Mengde2.png", alt: "漫步蒙德城" },
  tavernOutside: { image: "Mengde3.png", alt: "天使的馈赠酒馆外" },
  tavernInside: { image: "Jiuguan1.png", alt: "天使的馈赠酒馆内" },
};

function portraitSource(line: ChapterSevenLine) {
  if (line.character === "amberFriendly") return amberAsset(line.portrait ?? 3);
  if (line.character === "amberUrgent") return chapterAsset("Anbo.png");
  if (line.character === "venti") return chapterAsset(`Wendi${line.portrait ?? 1}.png`);
  if (line.character === "zhongli") return chapterAsset(`Zhongli${line.portrait ?? 1}.png`);
  return null;
}

export function ChapterSevenStory({ onComplete, paused = false }: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [portraitLoaded, setPortraitLoaded] = useState(false);
  const clickLocked = useRef(false);
  const clickTimer = useRef<number | undefined>(undefined);
  const currentLine = chapterSevenDialogue[Math.min(lineIndex, chapterSevenDialogue.length - 1)];
  const scene = sceneAssets[currentLine.scene];
  const portrait = portraitSource(currentLine);

  useEffect(() => () => window.clearTimeout(clickTimer.current), []);
  useEffect(() => setBackgroundLoaded(false), [scene.image]);
  useEffect(() => setPortraitLoaded(false), [portrait]);

  const advance = () => {
    if (paused || clickLocked.current) return;
    clickLocked.current = true;
    clickTimer.current = window.setTimeout(() => { clickLocked.current = false; }, 220);
    if (lineIndex < chapterSevenDialogue.length - 1) {
      setLineIndex((value) => value + 1);
    } else {
      setCompleted(true);
    }
  };

  return (
    <section className="scene chapter-seven-story">
      <SectionHeader number="07" kicker="ANGEL'S SHARE" title="酒馆里的赌约">
        <p>本来只是想随便逛逛，结果又听见了不得了的事。</p>
      </SectionHeader>

      {!completed && (
        <>
          <div className={`chapter-seven-visual ${backgroundLoaded ? "has-chapter-seven-bg" : ""}`} key={scene.image}>
            <div className="chapter-seven-placeholder">场景图片<br /><small>{scene.image}</small></div>
            <img
              className="chapter-seven-background"
              src={chapterAsset(scene.image)}
              alt={scene.alt}
              onLoad={() => setBackgroundLoaded(true)}
              onError={(event) => { event.currentTarget.hidden = true; }}
            />
            {portrait && (
              <>
                {!portraitLoaded && <div className="chapter-seven-portrait-placeholder">{currentLine.speaker}<br /><small>角色贴纸</small></div>}
                <img
                  key={portrait}
                  className={`chapter-seven-portrait portrait-${currentLine.character}`}
                  src={portrait}
                  alt={`${currentLine.speaker}立绘`}
                  onLoad={() => setPortraitLoaded(true)}
                  onError={(event) => { event.currentTarget.hidden = true; setPortraitLoaded(false); }}
                />
              </>
            )}
          </div>

          <div className="chapter-seven-dialogue" key={lineIndex}>
            <span className={`dialogue-speaker speaker-${currentLine.speaker}`}>{currentLine.speaker}</span>
            <p>{currentLine.text}</p>
            <button className="dialogue-next" onClick={advance}>继续</button>
          </div>
        </>
      )}

      {completed && (
        <div className="chapter-seven-completion">
          <div className="checkin-complete">✓ 第七章完成</div>
          <p>看来，那件“不属于这个世界的东西”已经开始留下痕迹。</p>
          <small>B老师只是想在蒙德逛一会儿，结果喝口水的功夫，又出事了。</small>
          <button className="dialogue-next return-airport" onClick={onComplete}>返回旅程</button>
        </div>
      )}
    </section>
  );
}
