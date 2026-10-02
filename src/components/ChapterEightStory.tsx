import { useEffect, useMemo, useRef, useState } from "react";
import { chapterEightBattleIntro, chapterEightOpening, chapterEightRitualAfter, chapterEightVictory, type ChapterEightLine } from "../data/chapterEightDialogue";
import { SectionHeader } from "./UI";

type Props = { onComplete: () => void; paused?: boolean };
type Phase = "story" | "battleIntro" | "ritual" | "ritualAfter" | "battle" | "battleWon" | "defeat" | "victory" | "complete";
type EnemyId = "blue" | "red" | "purple";
type Support = "amber" | "venti" | "zhongli";
type Enemy = { id: EnemyId; name: string; hp: number; maxHp: number; shield: number; maxShield: number; image: string };
type BattleOverlay = { title: string; lines: string[] } | null;

const asset = (name: string) => `${import.meta.env.BASE_URL}chapter-eight/${name}`;
const publicAsset = (name: string) => `${import.meta.env.BASE_URL}${name}`;
const initialEnemies = (): Enemy[] => [
  { id: "blue", name: "蓝色深渊法师", hp: 100, maxHp: 100, shield: 70, maxShield: 70, image: "Blue1.png" },
  { id: "red", name: "红色深渊法师", hp: 120, maxHp: 120, shield: 55, maxShield: 55, image: "Red2.png" },
  { id: "purple", name: "紫色深渊法师", hp: 105, maxHp: 105, shield: 60, maxShield: 60, image: "Purple1.png" },
];

const jokes = [
  ["你知道为什么冰深渊法师不喜欢夏天吗？", "因为它怕自己融入集体。"],
  ["你知道深渊法师为什么不坐电梯吗？", "因为它们比较喜欢深渊。"],
  ["火深渊法师为什么从不迟到？", "因为它总是很着火。"],
  ["雷深渊法师最怕什么课程？", "绝缘材料学。"],
];

function damageEnemy(enemy: Enemy, hpDamage: number, shieldDamage: number): Enemy {
  const shieldHit = Math.min(enemy.shield, shieldDamage);
  const spill = Math.max(0, shieldDamage - enemy.shield) * 0.45;
  return { ...enemy, shield: enemy.shield - shieldHit, hp: Math.max(0, enemy.hp - hpDamage - spill) };
}

function StoryFrame({ line }: { line: ChapterEightLine }) {
  const sceneImage = line.scene === "observe" ? "shenyuanfashimen1.png" : line.scene === "close" ? "shenyuanfashimen2.png" : "BattleBg1.png";
  const isClose = line.scene === "close";
  const enemySpeaker = line.speaker.includes("深渊法师") ? line.speaker.slice(0, 2) : "";
  const mood = line.enemyMood ?? 1;
  return (
    <div className={`chapter-eight-visual scene-${line.scene}`}>
      <img className="chapter-eight-background" src={asset(sceneImage)} alt="蒙德城外的异常现场" />
      {isClose && <div className="abyss-story-row">
        {(["Blue", "Red", "Purple"] as const).map((colour, index) => {
          const label = ["蓝色", "红色", "紫色"][index];
          const active = enemySpeaker === label;
          return <img key={colour} className={`abyss-story-mage ${active ? "speaking" : ""}`} src={asset(`${colour}${active ? mood : 1}.png`)} alt={`${label}深渊法师`} />;
        })}
        <div className="mystery-glow" aria-label="发光的神秘物品">?</div>
      </div>}
      {line.portrait && <img className="chapter-eight-portrait" src={line.portrait.includes("/") ? publicAsset(line.portrait) : asset(line.portrait)} alt={`${line.speaker}立绘`} />}
    </div>
  );
}

export function ChapterEightStory({ onComplete, paused = false }: Props) {
  const [phase, setPhase] = useState<Phase>("story");
  const [lineIndex, setLineIndex] = useState(0);
  const [hp, setHp] = useState(180);
  const [energy, setEnergy] = useState(0);
  const [enemies, setEnemies] = useState<Enemy[]>(initialEnemies);
  const [target, setTarget] = useState<EnemyId>("red");
  const [support, setSupport] = useState<Support>("amber");
  const [round, setRound] = useState(0);
  const [skillCooldown, setSkillCooldown] = useState(0);
  const [battleLog, setBattleLog] = useState("选择目标与场外支援，然后发动技能。");
  const [overlay, setOverlay] = useState<BattleOverlay>(null);
  const [delayed, setDelayed] = useState(false);
  const [failures, setFailures] = useState(0);
  const [seenNormal, setSeenNormal] = useState(false);
  const [seenSkill, setSeenSkill] = useState(false);
  const [seenUltimate, setSeenUltimate] = useState(false);
  const [seenResonance, setSeenResonance] = useState(false);
  const clickLock = useRef(false);
  const clickTimer = useRef<number | undefined>(undefined);

  const lines = phase === "story" ? chapterEightOpening : phase === "battleIntro" ? chapterEightBattleIntro : phase === "ritualAfter" ? chapterEightRitualAfter : chapterEightVictory;
  const currentLine = lines[Math.min(lineIndex, lines.length - 1)];
  const aliveEnemies = useMemo(() => enemies.filter((enemy) => enemy.hp > 0), [enemies]);

  useEffect(() => () => window.clearTimeout(clickTimer.current), []);

  const advanceStory = () => {
    if (paused || clickLock.current) return;
    clickLock.current = true;
    clickTimer.current = window.setTimeout(() => { clickLock.current = false; }, 220);
    if (lineIndex < lines.length - 1) { setLineIndex((value) => value + 1); return; }
    setLineIndex(0);
    if (phase === "story") setPhase("battleIntro");
    if (phase === "battleIntro") setPhase("ritual");
    if (phase === "ritualAfter") setPhase("battle");
    if (phase === "victory") setPhase("complete");
  };

  const resetBattle = () => {
    setHp(180); setEnergy(0); setEnemies(initialEnemies()); setTarget("red"); setSupport("amber");
    setRound(0); setSkillCooldown(0); setBattleLog("选择目标与场外支援，然后发动技能。");
    setOverlay(null); setDelayed(false); setPhase("battle");
  };

  const runEnemyTurn = (afterPlayer: Enemy[], nextRound: number) => {
    if (afterPlayer.every((enemy) => enemy.hp <= 0)) {
      setEnemies(afterPlayer); setOverlay({ title: "战斗胜利", lines: ["三只深渊法师的护盾终于全部熄灭了。"] }); setPhase("battleWon"); setLineIndex(0); return;
    }
    let updated = afterPlayer;
    let incoming = 0;
    const messages: string[] = [];
    updated.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      if (enemy.id === "blue" && enemy.shield < 18 && nextRound % 2 === 0) {
        updated = updated.map((item) => item.id === "blue" ? { ...item, shield: Math.min(item.maxShield, item.shield + 18) } : item);
        messages.push("蓝色深渊法师使用【寒气护盾】");
      } else if (enemy.id === "red" && nextRound % 2 === 0) {
        incoming += 16; messages.push("红色深渊法师使用【火焰爆发】");
      } else if (enemy.id === "purple" && nextRound % 2 === 1) {
        incoming += 7; setDelayed(true); messages.push("紫色深渊法师使用【麻痹干扰】，Bianca 后退一个行动位置");
      } else {
        incoming += enemy.id === "blue" ? 8 : enemy.id === "red" ? 11 : 7;
        messages.push(`${enemy.name}发动了攻击`);
      }
    });
    if (nextRound % 2 === 0) {
      const recipient = updated.find((enemy) => enemy.hp > 0);
      if (recipient) {
        updated = updated.map((enemy) => enemy.id === recipient.id ? { ...enemy, shield: Math.min(enemy.maxShield, enemy.shield + 10) } : enemy);
        messages.push(`【异界共鸣】为${recipient.name}恢复了 10 点护盾`);
        if (!seenResonance) {
          setSeenResonance(true);
          setOverlay({ title: "异界共鸣", lines: ["Bianca：它还会给它们加 buff？！", "菲林斯：是的。", "Bianca：你不要回答得这么平静啊！"] });
        }
      }
    }
    const reduction = failures >= 2 ? 0.82 : 1;
    const finalDamage = Math.round(incoming * reduction);
    const nextHp = Math.max(0, hp - finalDamage);
    setEnemies(updated); setHp(nextHp); setEnergy((value) => Math.min(100, value + 12));
    setBattleLog(`${messages.join("；")}。Bianca 受到 ${finalDamage} 点伤害。`);
    if (nextHp <= 0) { setFailures((value) => value + 1); setPhase("defeat"); }
  };

  const useAction = (kind: "normal" | "skill" | "ultimate") => {
    if (paused || overlay || phase !== "battle") return;
    if (kind === "skill" && skillCooldown > 0) return;
    if (kind === "ultimate" && energy < 100) return;
    let next = enemies;
    if (kind === "normal") {
      next = enemies.map((enemy) => {
        if (enemy.id !== target || enemy.hp <= 0) return enemy;
        const bonus = support === "amber" && enemy.id === "blue" ? 42 : support === "zhongli" && enemy.id === "purple" ? 36 : support === "zhongli" ? 18 : 0;
        return damageEnemy(enemy, 30, 58 + bonus);
      });
      setEnergy((value) => Math.min(100, value + 25));
      setBattleLog(`Bianca 对${enemies.find((enemy) => enemy.id === target)?.name}使用【普通攻击】，${support === "amber" ? "火焰" : support === "venti" ? "风" : "岩"}之指导生效。`);
      if (!seenNormal) { setSeenNormal(true); setOverlay({ title: "普通攻击", lines: ["Bianca：这次总不会再有什么奇怪的吧……", "Bianca：……终于。", "作者大大：不用谢。", "Bianca：没人谢你。"] }); }
    }
    if (kind === "skill") {
      next = enemies.map((enemy) => enemy.hp > 0 ? damageEnemy(enemy, 20, 30) : enemy);
      setEnergy((value) => Math.min(100, value + 30)); setSkillCooldown(1);
      const joke = jokes[round % jokes.length];
      setBattleLog("【精神受到重创】所有敌人的行动被轻微拖慢。");
      setOverlay({ title: "战技 · 冷笑话", lines: [...joke, "系统：【精神受到重创。】", ...(!seenSkill ? ["作者大大：冷笑话，当然很冷。", "Bianca：你闭嘴。"] : [])] });
      setSeenSkill(true);
    }
    if (kind === "ultimate") {
      next = enemies.map((enemy) => enemy.hp > 0 ? damageEnemy(enemy, 90, 78) : enemy);
      setEnergy(0);
      setOverlay({ title: "终结技 · 软硬软拒绝", lines: ["软｜Bianca：那个……要不还是算了吧？", "硬｜Bianca：不行。", "软｜Bianca：谢谢理解。", ...(!seenUltimate ? ["作者大大：拒绝得很有力量。", "Bianca：这根本不是一回事吧！"] : [])] });
      setSeenUltimate(true); setBattleLog("风、岩与火的力量同时爆发，敌方全体受到重创。");
    }
    const nextRound = round + 1;
    setRound(nextRound); setSkillCooldown((value) => kind === "skill" ? value : Math.max(0, value - 1));
    setDelayed(false);
    runEnemyTurn(next, nextRound);
  };

  const isStoryPhase = ["story", "battleIntro", "ritualAfter", "victory"].includes(phase);

  return <section className="scene chapter-eight-story">
    <SectionHeader number="08" kicker="OTHERWORLDLY RESONANCE" title="深渊法师异常事件">
      <p>找到那件不属于提瓦特的东西——在它被三只深渊法师吃掉之前。</p>
    </SectionHeader>

    {isStoryPhase && <>
      <StoryFrame line={currentLine} />
      <div className={`chapter-eight-dialogue ${currentLine.speaker === "作者大大" ? "author-note" : ""}`} key={`${phase}-${lineIndex}`}>
        <span className={`dialogue-speaker speaker-${currentLine.speaker}`}>{currentLine.speaker}</span>
        {currentLine.systemTitle && <b className="system-title">【{currentLine.systemTitle}】</b>}
        <p>{currentLine.text}</p>
        <button className="dialogue-next" onClick={advanceStory}>继续</button>
      </div>
    </>}

    {phase === "ritual" && <div className="ritual-stage">
      <div className="ritual-modal"><span>✦</span><h3>神秘力量觉醒仪式</h3><ol><li>双手合十</li><li>闭眼三秒</li><li>认真念出：</li></ol><blockquote>“以作者大大的名义，请赐予我打败深渊法师的力量。”</blockquote><p><b>Bianca：</b>我拒绝。</p><p className="author-copy"><b>作者大大：</b>不念不能继续。</p><button className="sticker-button" onClick={() => { setLineIndex(0); setPhase("ritualAfter"); }}>仪式完成</button></div>
    </div>}

    {(phase === "battle" || phase === "battleWon" || phase === "defeat") && <div className="battle-eight-card">
      <img className="battle-eight-bg" src={asset("BattleBg1.png")} alt="回合制战斗场地" />
      <div className="battle-order"><b>行动顺序</b>{delayed ? <><span>蓝</span><span className="active">B</span><span>红</span><span>紫</span></> : <><span className="active">B</span><span>蓝</span><span>红</span><span>紫</span></>}</div>
      <div className="battle-enemies">{enemies.map((enemy) => <button key={enemy.id} className={`battle-enemy enemy-${enemy.id} ${target === enemy.id ? "selected" : ""} ${enemy.hp <= 0 ? "defeated" : ""}`} onClick={() => setTarget(enemy.id)} disabled={enemy.hp <= 0}><div className="enemy-bars"><b>{enemy.name}</b><i><em style={{ width: `${enemy.hp / enemy.maxHp * 100}%` }} /></i><i className="shield"><em style={{ width: `${enemy.shield / enemy.maxShield * 100}%` }} /></i></div><img src={asset(enemy.image)} alt={enemy.name} /></button>)}</div>
      <div className="battle-mystery" title="神秘物品">?</div>
      <div className="bianca-battle"><img src={asset(overlay ? "BiancaBattle2.png" : "BiancaBattle1.png")} alt="战斗中的 Bianca" /><div><b>Bianca</b><i><em style={{ width: `${hp / 180 * 100}%` }} /></i><small>HP {hp}/180　能量 {energy}/100</small></div></div>
      <div className="support-panel"><b>场外支援</b>{(["amber", "venti", "zhongli"] as Support[]).map((item) => <button key={item} className={support === item ? "active" : ""} onClick={() => setSupport(item)}>{item === "amber" ? "安柏·火" : item === "venti" ? "温迪·风" : "钟离·岩"}</button>)}</div>
      <div className="battle-log">{battleLog}</div>
      <div className="battle-skills"><button onClick={() => useAction("normal")}>普通攻击<small>单体</small></button><button onClick={() => useAction("skill")} disabled={skillCooldown > 0}>冷笑话<small>{skillCooldown ? "冷却中" : "群体"}</small></button><button className="ultimate" onClick={() => useAction("ultimate")} disabled={energy < 100}>软硬软拒绝<small>{energy}/100</small></button></div>
      {overlay && phase === "battle" && <div className="battle-overlay"><div><h3>{overlay.title}</h3>{overlay.lines.map((text, index) => <p key={index}>{text}</p>)}<button className="dialogue-next" onClick={() => setOverlay(null)}>继续战斗</button></div></div>}
      {phase === "battleWon" && <div className="battle-overlay"><div><h3>战斗胜利</h3><p>三只深渊法师的护盾终于全部熄灭了。</p><button className="dialogue-next" onClick={() => { setOverlay(null); setLineIndex(0); setPhase("victory"); }}>查看神秘物品</button></div></div>}
      {phase === "defeat" && <div className="battle-overlay"><div><h3>战斗失败</h3><p><b>Bianca：</b>……三打一是不是有点过分了？</p><p className="author-copy"><b>作者大大：</b>要不再来一次？</p><div className="defeat-actions"><button className="dialogue-next" onClick={resetBattle}>重新挑战</button><button onClick={() => setBattleLog("小提示：先用对应支援击破护盾；能量满后立刻使用终结技。")}>查看小提示</button></div></div></div>}
    </div>}

    {phase === "complete" && <div className="chapter-eight-completion"><div className="checkin-complete">✓ 第八章完成</div><div className="mystery-item-icon">???</div><p>B老师终于找到了那个不属于提瓦特的东西。</p><small>至于它到底是什么……似乎还不到揭晓的时候。</small><button className="dialogue-next return-airport" onClick={onComplete}>返回旅程</button></div>}
  </section>;
}
