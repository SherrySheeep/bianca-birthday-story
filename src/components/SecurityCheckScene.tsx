import { useEffect, useState } from "react";
import { securityDialogue } from "../data/securityDialogue";

type Props = { onComplete: () => void };
type Phase = "ready" | "moving" | "monologue" | "ask" | "dialogue";

const asset = (name: string) => `${import.meta.env.BASE_URL}airport-security/${name}`;
const monologue = ["……？", "我箱子呢？", "刚才是不是……闪了一下？", "不是。\n我的箱子怎么直接没了？？？"];

export function SecurityCheckScene({ onComplete }: Props) {
  const debugMode = new URLSearchParams(window.location.search).get("debugSecurity") === "1";
  const [phase, setPhase] = useState<Phase>("ready");
  const [moveFrame, setMoveFrame] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const [monologueIndex, setMonologueIndex] = useState(0);
  const [nodeId, setNodeId] = useState("start");
  const node = securityDialogue[nodeId];

  useEffect(() => {
    if (phase !== "moving" || debugMode) return;
    const timers = [
      window.setTimeout(() => setMoveFrame(2), 550),
      window.setTimeout(() => setMoveFrame(3), 1100),
      window.setTimeout(() => setFlashing(true), 1650),
      window.setTimeout(() => {
        setFlashing(false);
        setMoveFrame(0);
        setPhase("monologue");
      }, 1970),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [phase, debugMode]);

  useEffect(() => {
    if (phase !== "monologue") return;
    if (monologueIndex >= monologue.length - 1) {
      const timer = window.setTimeout(() => setPhase("ask"), 850);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setMonologueIndex((value) => value + 1), 850);
    return () => window.clearTimeout(timer);
  }, [phase, monologueIndex]);

  const portraitFile = node?.portrait === 3 ? "AnjianFeilinsi3.png" : `AnjianFeilinsi${node?.portrait ?? 1}.png`;

  return (
    <div className="security-overlay" role="dialog" aria-modal="true" aria-label="机场安检">
      <div className="security-scene">
        <div className="security-stage">
          {debugMode && (
            <div className="security-debug-panel">
              <b>行李位置调试</b>
              <button onClick={() => { setPhase("ready"); setMoveFrame(0); setFlashing(false); }}>竖箱</button>
              {[1, 2, 3].map((frame) => (
                <button key={frame} onClick={() => { setPhase("moving"); setMoveFrame(frame); setFlashing(false); }}>第 {frame} 帧</button>
              ))}
              <button onClick={() => { setPhase("moving"); setMoveFrame(3); setFlashing(true); }}>闪光</button>
            </div>
          )}
          <div className="security-task">
            <b>{phase === "ready" ? "把行李放上传送带" : "行李安检中"}</b>
            {phase === "ready" && <span>点击你的行李箱进行安检。</span>}
          </div>

          <div className="security-machine-placeholder">安检仪<br /><small>{flashing ? "Anjianyi2.png" : "Anjianyi1.png"}</small></div>
          <img
            className="security-machine"
            src={asset(flashing ? "Anjianyi2.png" : "Anjianyi1.png")}
            alt="安检传送带和扫描仪"
            onLoad={(event) => event.currentTarget.parentElement?.classList.add("has-security-machine")}
            onError={(event) => {
              event.currentTarget.hidden = true;
              event.currentTarget.parentElement?.classList.remove("has-security-machine");
            }}
          />

          {phase === "ready" && (
            <button className="upright-luggage" onClick={() => { setMoveFrame(1); setPhase("moving"); }} aria-label="把行李放上传送带">
              <span>点击行李箱</span>
              <img src={asset("Luggage1.png")} alt="竖着的橙色行李箱" onError={(event) => { event.currentTarget.hidden = true; }} />
            </button>
          )}
          {phase === "moving" && moveFrame > 0 && (
            <img className={`moving-luggage frame-${moveFrame}`} src={asset("Luggage2.png")} alt="传送带上的橙色行李箱" onError={(event) => { event.currentTarget.hidden = true; }} />
          )}

          {phase === "dialogue" && (
            <>
              <div className="security-staff-placeholder">安检菲林斯<br /><small>{portraitFile}</small></div>
              <img
                key={portraitFile}
                className="security-staff"
                src={asset(portraitFile)}
                alt="戴墨镜的菲林斯"
                onLoad={(event) => event.currentTarget.parentElement?.classList.add("has-security-staff")}
                onError={(event) => {
                  event.currentTarget.hidden = true;
                  event.currentTarget.parentElement?.classList.remove("has-security-staff");
                }}
              />
            </>
          )}
        </div>

        {(phase === "monologue" || phase === "ask") && (
          <div className="security-dialogue-card">
            <span className="dialogue-speaker speaker-Bianca">Bianca</span>
            <p>{monologue[monologueIndex]}</p>
            {phase === "ask" && <button className="dialogue-next" onClick={() => setPhase("dialogue")}>问问工作人员</button>}
          </div>
        )}

        {phase === "dialogue" && (
          <div className="security-dialogue-card" key={nodeId}>
            <span className={`dialogue-speaker speaker-${node.speaker}`}>{node.speaker}</span>
            {node.completed && <div className="checkin-complete">✓ 安检完成</div>}
            <p>{node.text}</p>
            {node.options ? (
              <div className="dialogue-options">
                {node.options.map((option) => <button key={option.label} onClick={() => setNodeId(option.next)}>{option.label}</button>)}
              </div>
            ) : node.completed ? (
              <button className="dialogue-next return-airport" onClick={onComplete}>返回机场流程</button>
            ) : (
              <button className="dialogue-next" onClick={() => node.next && setNodeId(node.next)}>继续</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
