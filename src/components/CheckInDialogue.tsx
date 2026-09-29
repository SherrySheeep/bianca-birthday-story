import { useEffect, useState } from "react";
import { checkInDialogue, checkInStartNode } from "../data/checkInDialogue";

type Props = { onComplete: () => void };
const asset = (fileName: string) => `${import.meta.env.BASE_URL}airport-checkin/${fileName}`;

export function CheckInDialogue({ onComplete }: Props) {
  const [nodeId, setNodeId] = useState(checkInStartNode);
  const [scanFinished, setScanFinished] = useState(false);
  const node = checkInDialogue[nodeId];
  const portrait = node.portrait ?? 1;

  useEffect(() => {
    setScanFinished(false);
    if (!node.systemTag) return;

    const timer = window.setTimeout(() => setScanFinished(true), 1850);
    return () => window.clearTimeout(timer);
  }, [nodeId, node.systemTag]);

  return (
    <div className="checkin-overlay" role="dialog" aria-modal="true" aria-label="值机对话">
      <div className="checkin-scene">
        <div className="checkin-stage">
          <div className="checkin-airport-sign">SYD · CHECK-IN</div>
          <div className="checkin-counter-placeholder">值机台图片位置<br /><small>Zhijitai1.png</small></div>
          <div className="checkin-portrait-placeholder">菲林斯<br /><small>Feilinsi{portrait}.png</small></div>
          <img
            className="checkin-counter-image"
            src={asset("Zhijitai1.png")}
            alt="值机柜台"
            onLoad={(event) => event.currentTarget.parentElement?.classList.add("has-counter")}
          />
          <img
            key={portrait}
            className="checkin-portrait"
            src={asset(`Feilinsi${portrait}.png`)}
            alt={`菲林斯表情 ${portrait}`}
            onLoad={(event) => event.currentTarget.parentElement?.classList.add("has-portrait")}
            onError={(event) => {
              event.currentTarget.classList.add("missing");
              event.currentTarget.parentElement?.classList.remove("has-portrait");
            }}
          />
        </div>

        <div className="checkin-dialogue-card" key={nodeId}>
          {node.systemTag ? (
            <div className="traveler-scan" aria-label="系统将 TRAVELER 修正为 FREQUENT TRAVELLER">
              <span>TRAVELER</span><b>FREQUENT TRAVELLER</b>
            </div>
          ) : (
            <>
              <span className={`dialogue-speaker speaker-${node.speaker}`}>{node.speaker}</span>
              {node.completed && <div className="checkin-complete">✓ 值机完成</div>}
              <p>{node.text}</p>
            </>
          )}

          {node.options ? (
            <div className="dialogue-options">
              {node.options.map((option) => (
                <button key={option.label} onClick={() => setNodeId(option.next)}>{option.label}</button>
              ))}
            </div>
          ) : node.completed ? (
            <button className="dialogue-next return-airport" onClick={onComplete}>返回机场流程</button>
          ) : node.systemTag && !scanFinished ? null : (
            <button className="dialogue-next" onClick={() => node.next && setNodeId(node.next)}>继续</button>
          )}
        </div>
      </div>
    </div>
  );
}
