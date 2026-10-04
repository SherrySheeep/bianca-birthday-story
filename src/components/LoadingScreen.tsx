import { useEffect, useState } from "react";
import { loadingMessages } from "../data/loadingMessages";
import { initialImageQueue, preloadAssets, startBackgroundImagePreload } from "../lib/imagePreloader";

type Props = { onStart: () => void };

export function LoadingScreen({ onStart }: Props) {
  const [loaded, setLoaded] = useState(0);
  const [messageIndex, setMessageIndex] = useState(() => Math.floor(Math.random() * loadingMessages.length));
  const total = initialImageQueue.length;
  const ready = total === 0 || loaded >= total;
  const progress = total === 0 ? 100 : Math.round((loaded / total) * 100);

  useEffect(() => {
    let active = true;
    preloadAssets(initialImageQueue, (completed) => {
      if (active) setLoaded(completed);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (ready) return;
    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 1750);
    return () => window.clearInterval(timer);
  }, [ready]);

  useEffect(() => {
    if (ready) startBackgroundImagePreload();
  }, [ready]);

  return <main className="loading-screen">
    <div className="loading-paper" aria-live="polite">
      <i className="loading-tape" aria-hidden />
      <div className="loading-doodles" aria-hidden><span>✦</span><span>☁</span><span>♡</span><span>✿</span></div>
      <p className="loading-kicker">BIANCA'S TRAVEL JOURNAL</p>
      <h1>{ready ? "准备完成。大概。" : "旅程准备中……"}</h1>
      <strong className="loading-percent">{progress}%</strong>
      <div className="loading-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="loading-message">{ready ? "行李看起来都在。应该吧。" : loadingMessages[messageIndex]}</p>
      <small>{loaded} / {total} 张图片</small>
      {ready && <button className="sticker-button loading-start" onClick={onStart}>开始旅程</button>}
    </div>
  </main>;
}
