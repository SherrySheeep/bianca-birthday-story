import { useMemo, useState } from "react";
import { BIANCA_BOSS_MAX_HP, UNSW_MAX_HP, universitySkills, unswBossSkills, type BossSkillId, type UniversitySkillId } from "../data/chapterEightBattleData";

type Props = { paused?: boolean; onVictory: () => void };
type Stage = "entrance" | "awakening" | "battle" | "phase2" | "defeat" | "bossDefeat";

const asset = (name: string) => `${import.meta.env.BASE_URL}chapter-eight/${name}`;
const bossAsset = (name: string) => asset(`bosses/${name}`);

const entranceLines = [
  ["系统", "WARNING\nA POWERFUL PRESENCE HAS APPEARED"],
  ["UNSW", "UNSW\nThe University of New South Wales"],
  ["Bianca", "……等等。"],
  ["Bianca", "怎么突然有一种……特别想逃课的感觉。"],
  ["安柏", "这是什么？！"],
  ["温迪", "好沉重的怨念……"],
  ["钟离", "此物的气息，远胜方才。"],
  ["Bianca", "这个我认识。\n……而且认识得有点太久了。"],
] as const;

const awakeningLines = [
  ["旁白", "就在 UNSW 出现的瞬间——\nBianca 突然感觉到，一股前所未有的力量从身体里涌了出来。"],
  ["Bianca", "……等等。"],
  ["Bianca", "这种感觉……"],
  ["Bianca", "是赶 due 前最后三个小时的力量。"],
  ["系统", "大学生技能已觉醒。"],
  ["Bianca", "XLOOKUP……至少这个我会。"],
  ["安柏", "Bianca，这次就交给你了！"],
] as const;

function randomVariant(id: BossSkillId) {
  const variants = unswBossSkills[id].dialogueVariants;
  return variants[Math.floor(Math.random() * variants.length)];
}

export function UnswBattle({ paused = false, onVictory }: Props) {
  const [stage, setStage] = useState<Stage>("entrance");
  const [storyIndex, setStoryIndex] = useState(0);
  const [bossHp, setBossHp] = useState(UNSW_MAX_HP);
  const [hp, setHp] = useState(BIANCA_BOSS_MAX_HP);
  const [energy, setEnergy] = useState(0);
  const [turn, setTurn] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [groupProject, setGroupProject] = useState(false);
  const [presentationPreparing, setPresentationPreparing] = useState(false);
  const [considerationCooldown, setConsiderationCooldown] = useState(0);
  const [phase2, setPhase2] = useState(false);
  const [rubricUsed, setRubricUsed] = useState(false);
  const [courseFeeUsed, setCourseFeeUsed] = useState(false);
  const [pendingBossSkill, setPendingBossSkill] = useState<BossSkillId | null>(null);
  const [precastLines, setPrecastLines] = useState<string[]>([]);
  const [status, setStatus] = useState("UNSW 正在等待你的选择。");
  const [bossDamage, setBossDamage] = useState<{ value: number; key: number } | null>(null);
  const [playerDamage, setPlayerDamage] = useState<{ value: number; key: number } | null>(null);
  const [orderShifted, setOrderShifted] = useState(false);
  const [ultimateAnnounced, setUltimateAnnounced] = useState(false);

  const storyLines = stage === "entrance" ? entranceLines : awakeningLines;
  const currentStory = storyLines[Math.min(storyIndex, storyLines.length - 1)];
  const bossMood2 = pendingBossSkill || stage === "phase2" || stage === "bossDefeat";
  const actionOrder = pendingBossSkill ? ["UNSW", "Bianca"] : ["Bianca", "UNSW"];
  const visibleSkills = useMemo(() => universitySkills, []);

  const advanceStory = () => {
    if (paused) return;
    if (storyIndex < storyLines.length - 1) { setStoryIndex((value) => value + 1); return; }
    setStoryIndex(0);
    if (stage === "entrance") setStage("awakening");
    else setStage("battle");
  };

  const chooseBossSkill = (nextTurn: number): BossSkillId => {
    if (presentationPreparing) return "presentation";
    if (!courseFeeUsed) return "courseFee";
    if (phase2 && nextTurn % 4 === 0) return "finalExam";
    if (!rubricUsed && nextTurn >= 4) return "rubric";
    const pool: BossSkillId[] = phase2
      ? ["assignment", "assignment", "quiz", "groupwork", "presentation"]
      : ["assignment", "quiz", "groupwork", "presentation"];
    return pool[nextTurn % pool.length];
  };

  const queueBossTurn = (nextTurn: number) => {
    const skill = chooseBossSkill(nextTurn);
    setPendingBossSkill(skill);
    setPrecastLines(randomVariant(skill));
  };

  const useSkill = (id: UniversitySkillId) => {
    if (paused || stage !== "battle" || pendingBossSkill) return;
    if (id === "graduation" && energy < 100) return;
    if (id === "consideration" && considerationCooldown > 0) return;
    const skill = universitySkills.find((item) => item.id === id)!;
    const multiplier = groupProject && id !== "groupChat" ? 0.7 : 1;
    const damage = Math.round(skill.damage * multiplier);
    const nextBossHp = Math.max(0, bossHp - damage);
    const nextTurn = turn + 1;
    let skipBossTurn = false;

    setBossHp(nextBossHp);
    if (damage) setBossDamage({ value: damage, key: Date.now() });
    setEnergy((value) => id === "graduation" ? 0 : Math.min(100, value + skill.energy));
    setConsiderationCooldown((value) => id === "consideration" ? 3 : Math.max(0, value - 1));
    setTurn(nextTurn);

    if (id === "deadline") {
      setHp((value) => Math.max(1, value - 10));
      setStatus("Deadline Rush：燃烧 10 HP，换来赶 due 的爆发力。");
    } else if (id === "extension") {
      setOrderShifted(true);
      skipBossTurn = true;
      if (presentationPreparing) {
        setPresentationPreparing(false);
        setStatus("PRESENTATION POSTPONED");
      } else setStatus("Extension Request：UNSW 的下一次行动被往后推了。");
    } else if (id === "groupChat") {
      setGroupProject(false);
      setStatus(groupProject ? "Group Chat 99+：小组作业 debuff 已清除。" : "群聊刷了 99 条，但暂时没有需要处理的小组作业。");
    } else if (id === "consideration") {
      setHp((value) => Math.min(BIANCA_BOSS_MAX_HP, value + 65));
      setPressure(0);
      setStatus("Special Consideration：恢复 HP，并清除了 Deadline Pressure。");
    } else if (id === "graduation") setStatus("毕业：这一天，终于来了。");
    else setStatus(`${skill.name} 命中 UNSW。`);

    if (nextBossHp <= 0) { setStage("bossDefeat"); return; }
    if (!phase2 && nextBossHp <= UNSW_MAX_HP / 2) { setPhase2(true); setStage("phase2"); return; }
    if (energy + skill.energy >= 100 && id !== "graduation" && !ultimateAnnounced) {
      setUltimateAnnounced(true);
      setStatus("ULTIMATE READY · 毕业");
    }
    if (skipBossTurn) {
      window.setTimeout(() => setOrderShifted(false), 500);
      return;
    }
    queueBossTurn(nextTurn);
  };

  const executeBossSkill = () => {
    if (!pendingBossSkill) return;
    const id = pendingBossSkill;
    let damage = unswBossSkills[id].damage;
    if (id === "presentation") {
      if (!presentationPreparing) { setPresentationPreparing(true); damage = 0; setStatus("PRESENTATION 正在蓄力：可用 Extension Request 延期。"); }
      else { damage = phase2 ? 72 : 60; setPresentationPreparing(false); setStatus("Presentation 正式开始。没有讲稿，也没有退路。"); }
    }
    if (id === "assignment") { setPressure((value) => value + 1); damage += pressure * 3; }
    if (id === "groupwork") { setGroupProject(true); setStatus("获得 Group Project：下一次攻击伤害降低。"); }
    if (id === "rubric") { setRubricUsed(true); setEnergy((value) => Math.max(0, value - 18)); }
    if (id === "courseFee") { setCourseFeeUsed(true); setStatus("COURSE FEE　-$1,248\nBianca：你打架为什么还能收钱啊？！"); }
    const nextHp = Math.max(0, hp - damage);
    if (damage) setPlayerDamage({ value: damage, key: Date.now() });
    setHp(nextHp);
    setPendingBossSkill(null);
    setPrecastLines([]);
    if (nextHp <= 0) setStage("defeat");
  };

  const resetBoss = () => {
    setStage("battle"); setBossHp(UNSW_MAX_HP); setHp(BIANCA_BOSS_MAX_HP); setEnergy(0); setTurn(0); setPressure(0);
    setGroupProject(false); setPresentationPreparing(false); setConsiderationCooldown(0); setPhase2(false); setRubricUsed(false);
    setCourseFeeUsed(false); setPendingBossSkill(null); setPrecastLines([]); setStatus("UNSW 正在等待你的选择。");
    setBossDamage(null); setPlayerDamage(null); setOrderShifted(false); setUltimateAnnounced(false);
  };

  return <div className={`battle-eight-card unsw-battle ${stage === "phase2" ? "week-ten" : ""}`}>
    <img className="battle-eight-bg" src={asset("BattleBg1.png")} alt="UNSW Boss 战场" />
    <div className={`battle-order ${orderShifted ? "is-delayed" : ""}`}><b>行动顺序</b>{actionOrder.map((name, index) => <div className={`order-avatar ${index === 0 ? "active" : ""}`} key={name}><img src={name === "Bianca" ? asset("BiancaIcon.png") : bossAsset("UNSW1.png")} alt={name} /><span>{name === "Bianca" ? "B" : "U"}</span></div>)}</div>
    <div className="unsw-boss"><div className="unsw-hp"><b>UNSW</b><small>The University of New South Wales</small><i><em style={{ width: `${bossHp / UNSW_MAX_HP * 100}%` }} /></i><span>HP {bossHp}/{UNSW_MAX_HP}</span></div><img src={bossMood2 ? bossAsset("UNSW2.png") : bossAsset("UNSW1.png")} alt="UNSW" onError={(event) => { event.currentTarget.hidden = true; }} />{bossDamage && <strong className="damage-pop damage-hp" key={bossDamage.key}>-{bossDamage.value}</strong>}</div>
    <div className="bianca-battle unsw-bianca"><img src={asset(pendingBossSkill ? "BiancaBattle2.png" : "BiancaBattle1.png")} alt="战斗中的 Bianca" />{playerDamage && <strong className="damage-pop player-damage" key={playerDamage.key}>-{playerDamage.value}</strong>}<div><b>Bianca</b><i><em style={{ width: `${hp / BIANCA_BOSS_MAX_HP * 100}%` }} /></i><small>HP {hp}/{BIANCA_BOSS_MAX_HP}　能量 {energy}/100</small></div></div>
    {stage === "battle" && <><div className="battle-status-toast unsw-status">{status}{groupProject ? "　｜Group Project" : ""}{pressure ? `　｜Pressure ×${pressure}` : ""}</div><div className="battle-skills university-skills">{visibleSkills.map((skill) => <button key={skill.id} className={skill.id === "graduation" ? "ultimate" : ""} disabled={(skill.id === "graduation" && energy < 100) || (skill.id === "consideration" && considerationCooldown > 0)} onClick={() => useSkill(skill.id)}>{skill.name}<small>{skill.id === "graduation" ? `${energy}/100` : skill.id === "consideration" && considerationCooldown ? `冷却 ${considerationCooldown}` : skill.description}</small></button>)}</div></>}

    {(stage === "entrance" || stage === "awakening") && <div className="battle-overlay unsw-story-overlay"><div><span className="dialogue-speaker">{currentStory[0]}</span><p>{currentStory[1]}</p><button className="dialogue-next" onClick={advanceStory}>继续</button></div></div>}
    {pendingBossSkill && <div className="battle-overlay boss-precast"><div><img src={bossAsset("UNSW2.png")} alt="放招的 UNSW" onError={(event) => { event.currentTarget.hidden = true; }} /><span className="dialogue-speaker">UNSW</span>{precastLines.map((line, index) => <p key={index}>{line}</p>)}<h3>{unswBossSkills[pendingBossSkill].name}</h3><button className="dialogue-next" onClick={executeBossSkill}>接招</button></div></div>}
    {stage === "phase2" && <div className="battle-overlay phase-two-overlay"><div><img src={bossAsset("UNSW2.png")} alt="大笑的 UNSW" onError={(event) => { event.currentTarget.hidden = true; }} /><h3>PHASE 2</h3><b>WEEK 10</b><p>UNSW：哈哈哈哈哈哈！</p><p>你以为快结束了？现在才 Week 10！</p><button className="dialogue-next" onClick={() => setStage("battle")}>继续战斗</button></div></div>}
    {stage === "defeat" && <div className="battle-overlay"><div><h3>挑战失败</h3><p>这次只需要重新挑战 UNSW，不会重播深渊法师教程。</p><button className="dialogue-next" onClick={resetBoss}>重新挑战 UNSW</button></div></div>}
    {stage === "bossDefeat" && <div className="battle-overlay graduation-overlay"><div><h3>GRADUATION COMPLETE</h3><p><b>UNSW：</b>这不可能——！</p><p><b>Bianca：</b>……毕业了？</p><button className="dialogue-next" onClick={onVictory}>Battle Complete</button></div></div>}
  </div>;
}
