import { useEffect, useRef, useState } from "react";

type Props = { onComplete: () => void; paused?: boolean };
type Stage = "boarding" | "transition" | "seated" | "completed";

const asset = (name: string) => `${import.meta.env.BASE_URL}airport-boarding/${name}`;
const boardingLines = ["终于到登机口了……", "今天这个机场，好像有点怪怪的。", "算了，先上飞机吧。"];
const seatedLines = ["终于登上飞机了。", "先休息会吧。"];

export function BoardingScene({ onComplete, paused = false }: Props) {
  const [stage, setStage] = useState<Stage>("boarding");
  const [lineIndex, setLineIndex] = useState(0);
  const inputLocked = useRef(false);
  const inputLockTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(inputLockTimer.current), []);

  useEffect(() => {
    if (stage !== "transition" || paused) return;
    const timer = window.setTimeout(() => {
      setLineIndex(0);
      setStage("seated");
    }, 550);
    return () => window.clearTimeout(timer);
  }, [stage, paused]);

  const currentLines = stage === "boarding" ? boardingLines : seatedLines;
  const isLastLine = lineIndex === currentLines.length - 1;

  const continueDialogue = () => {
    if (paused || inputLocked.current || stage === "transition" || stage === "completed") return;
    inputLocked.current = true;
    inputLockTimer.current = window.setTimeout(() => { inputLocked.current = false; }, 260);
    if (!isLastLine) {
      setLineIndex((current) => current + 1);
      return;
    }
    if (stage === "boarding") setStage("transition");
    if (stage === "seated") setStage("completed");
  };

  const imageName = stage === "boarding" ? "dengji1.png" : "dengji2.png";

  return (
    <div className="boarding-overlay" role="dialog" aria-modal="true" aria-label="登机互动">
      <div className={`boarding-scene stage-${stage}`}>
        <div className="boarding-visual">
          <div className="boarding-image-placeholder">登机场景图片<br /><small>{imageName}</small></div>
          {stage !== "transition" && (
            <img
              key={imageName}
              className="boarding-image"
              src={asset(imageName)}
              alt={stage === "boarding" ? "Bianca 正在登上飞机" : "Bianca 坐在飞机里望向窗外"}
              onLoad={(event) => event.currentTarget.parentElement?.classList.add("has-boarding-image")}
              onError={(event) => {
                event.currentTarget.hidden = true;
                event.currentTarget.parentElement?.classList.remove("has-boarding-image");
              }}
            />
          )}
          {stage === "transition" && <div className="boarding-white-fade" />}
        </div>

        {stage !== "transition" && stage !== "completed" && (
          <div className="boarding-dialogue-card" key={`${stage}-${lineIndex}`}>
            <span className="dialogue-speaker speaker-Bianca">Bianca</span>
            <p>{currentLines[lineIndex]}</p>
            <button className="dialogue-next" onClick={continueDialogue}>
              {stage === "boarding" && isLastLine ? "登机" : "继续"}
            </button>
          </div>
        )}

        {stage === "completed" && (
          <div className="boarding-dialogue-card boarding-completion">
            <div className="checkin-complete">✓ 登机完成</div>
            <p>旅程似乎终于回到了正轨。</p>
            <button className="dialogue-next return-airport" onClick={onComplete}>返回机场流程</button>
          </div>
        )}
      </div>
    </div>
  );
}
