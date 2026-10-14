import { useMemo, useState, type CSSProperties } from "react";
import { BIANCA_BOSS_MAX_HP, UNSW_MAX_HP, universitySkills, unswBossSkills, type BossSkillId, type UniversitySkillId } from "../data/chapterEightBattleData";
import { BATTLE_TIMING, ENERGY_CONFIG, UNSW_SKILLS, UNSW_STATS, UNIVERSITY_SKILLS } from "../data/chapterEightBattleConfig";
import { BattleEffectLayer, BattleShout, FloatingCombatText, type CombatEffect, type CombatText } from "./ChapterEightBattleEffects";
import { CombatGuide } from "./CombatGuide";
import { unswCombatGuideEntries } from "../data/chapterEightCombatGuide";
import { usePausableBattleWait } from "../hooks/usePausableBattleWait";

type Props = { paused?: boolean; debugMode?: boolean; startAtPhase2?: boolean; onVictory: () => void };
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

export function UnswBattle({ paused = false, debugMode = false, startAtPhase2 = false, onVictory }: Props) {
  const [stage, setStage] = useState<Stage>(startAtPhase2 ? "phase2" : "entrance");
  const [storyIndex, setStoryIndex] = useState(0);
  const [bossHp, setBossHp] = useState<number>(UNSW_MAX_HP);
  const [hp, setHp] = useState<number>(BIANCA_BOSS_MAX_HP);
  const [energy, setEnergy] = useState<number>(0);
  const [turn, setTurn] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [groupProject, setGroupProject] = useState(false);
  const [presentationPreparing, setPresentationPreparing] = useState(false);
  const [extensionCooldown, setExtensionCooldown] = useState(0);
  const [considerationCooldown, setConsiderationCooldown] = useState(0);
  const [phase2, setPhase2] = useState(startAtPhase2);
  const [rubricUsed, setRubricUsed] = useState(false);
  const [courseFeeUsed, setCourseFeeUsed] = useState(false);
  const [pendingBossSkill, setPendingBossSkill] = useState<BossSkillId | null>(null);
  const [status, setStatus] = useState("UNSW 正在等待你的选择。");
  const [orderShifted, setOrderShifted] = useState(false);
  const [ultimateAnnounced, setUltimateAnnounced] = useState(false);
  const [actionLocked, setActionLocked] = useState(false);
  const [actingSkill, setActingSkill] = useState(false);
  const [bossHit, setBossHit] = useState(false);
  const [playerHitFx, setPlayerHitFx] = useState(false);
  const [combatTexts, setCombatTexts] = useState<CombatText[]>([]);
  const [combatEffect, setCombatEffect] = useState<CombatEffect | null>(null);
  const [battleDialogue, setBattleDialogue] = useState<{ speaker: string; text: string; tag?: string } | null>(null);
  const [skillNamePop, setSkillNamePop] = useState<string | null>(null);
  const [isCombatGuideOpen, setIsCombatGuideOpen] = useState(false);
  const isBattlePaused = paused || isCombatGuideOpen;
  const wait = usePausableBattleWait(isBattlePaused);

  const storyLines = stage === "entrance" ? entranceLines : awakeningLines;
  const currentStory = storyLines[Math.min(storyIndex, storyLines.length - 1)];
  const bossMood2 = pendingBossSkill || stage === "phase2" || stage === "bossDefeat";
  const actionOrder = pendingBossSkill ? ["UNSW", "Bianca"] : ["Bianca", "UNSW"];
  const visibleSkills = useMemo(() => universitySkills, []);

  const advanceStory = () => {
    if (isBattlePaused) return;
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

  const queueBossTurn = async (nextTurn: number) => {
    const skill = chooseBossSkill(nextTurn);
    setPendingBossSkill(skill);
    const dialogue = randomVariant(skill);
    for (const text of dialogue) {
      setBattleDialogue({ speaker: "UNSW", text, tag: unswBossSkills[skill].name });
      await wait(BATTLE_TIMING.dialogueLine);
    }
    await executeBossSkill(skill);
  };

  const useSkill = async (id: UniversitySkillId) => {
    if (isBattlePaused || stage !== "battle" || pendingBossSkill || actionLocked) return;
    if (id === "graduation" && energy < UNIVERSITY_SKILLS.graduation.energyCost) return;
    if (id === "extension" && extensionCooldown > 0) return;
    if (id === "consideration" && considerationCooldown > 0) return;
    const skill = universitySkills.find((item) => item.id === id)!;
    const multiplier = groupProject && id !== "groupChat" ? UNSW_SKILLS.groupwork.playerDamageMultiplier : 1;
    const damage = Math.round(skill.damage * multiplier);
    const nextBossHp = Math.max(0, bossHp - damage);
    const nextTurn = turn + 1;
    let skipBossTurn = false;

    setActionLocked(true);
    setActingSkill(true);
    setBattleDialogue({ speaker: "Bianca", text: skill.name, tag: id === "graduation" ? "终结技" : "大学生技能" });
    setCombatEffect({ key: Date.now(), type: id === "graduation" ? "ultimate-hard" : "normal", target: "all" });
    await wait(BATTLE_TIMING.projectile);

    setBossHp(nextBossHp);
    if (damage) {
      setCombatTexts([{ id: `${Date.now()}-bianca-unsw`, target: "red", value: damage, kind: "hp" }]);
      setBossHit(true);
    }
    setEnergy((value) => id === "graduation" ? 0 : Math.min(ENERGY_CONFIG.maxEnergy, value + skill.energy));
    setExtensionCooldown((value) => id === "extension" ? UNIVERSITY_SKILLS.extension.cooldown : Math.max(0, value - 1));
    setConsiderationCooldown((value) => id === "consideration" ? UNIVERSITY_SKILLS.consideration.cooldown : Math.max(0, value - 1));
    setTurn(nextTurn);

    if (id === "deadline") {
      setHp((value) => Math.max(1, value - UNIVERSITY_SKILLS.deadline.selfDamage));
      setStatus(`Bianca：Deadline Rush 命中 UNSW；自己燃烧 ${UNIVERSITY_SKILLS.deadline.selfDamage} HP，换来赶 due 的爆发力。`);
    } else if (id === "extension") {
      setOrderShifted(true);
      skipBossTurn = true;
      if (presentationPreparing) {
        setPresentationPreparing(false);
        setStatus("Bianca：PRESENTATION POSTPONED");
      } else setStatus("Bianca：Extension Request 将 UNSW 的下一次行动往后推了。");
    } else if (id === "groupChat") {
      setGroupProject(false);
      setStatus(groupProject ? "Bianca：Group Chat 99+ 清除了小组作业 debuff。" : "Bianca：群聊刷了 99 条，但暂时没有需要处理的小组作业。");
    } else if (id === "consideration") {
      setHp((value) => Math.min(BIANCA_BOSS_MAX_HP, value + UNIVERSITY_SKILLS.consideration.heal));
      setPressure(0);
      setStatus(`Bianca：Special Consideration 恢复 ${UNIVERSITY_SKILLS.consideration.heal} HP，并清除了 Deadline Pressure。`);
    } else if (id === "graduation") setStatus("Bianca：毕业命中 UNSW。这一天，终于来了。");
    else setStatus(`Bianca：${skill.name} 命中 UNSW。`);

    await wait(BATTLE_TIMING.hit);
    setActingSkill(false); setBossHit(false); setCombatTexts([]); setCombatEffect(null); setBattleDialogue(null);
    if (nextBossHp <= 0) { setActionLocked(false); setStage("bossDefeat"); return; }
    if (!phase2 && nextBossHp <= UNSW_MAX_HP * UNSW_STATS.phase2Threshold) { setActionLocked(false); setPhase2(true); setStage("phase2"); return; }
    if (energy + skill.energy >= ENERGY_CONFIG.maxEnergy && id !== "graduation" && !ultimateAnnounced) {
      setUltimateAnnounced(true);
      setStatus("ULTIMATE READY · 毕业");
    }
    if (skipBossTurn) {
      window.setTimeout(() => setOrderShifted(false), 500);
      setActionLocked(false);
      return;
    }
    await queueBossTurn(nextTurn);
  };

  async function executeBossSkill(id: BossSkillId) {
    let damage = unswBossSkills[id].damage;
    let statusText = `UNSW：${unswBossSkills[id].name} 对 Bianca 造成 ${damage} 点伤害。`;
    if (id === "presentation") {
      if (!presentationPreparing) { setPresentationPreparing(true); damage = 0; statusText = "UNSW：PRESENTATION 正在蓄力；可用 Extension Request 延期。"; }
      else { damage = phase2 ? UNSW_SKILLS.presentation.phase2Damage : UNSW_SKILLS.presentation.damage; setPresentationPreparing(false); statusText = `UNSW：Presentation 正式开始，对 Bianca 造成 ${damage} 点伤害。没有讲稿，也没有退路。`; }
    }
    if (id === "assignment") { setPressure((value) => value + 1); damage += pressure * UNSW_SKILLS.assignment.pressureBonusPerStack; statusText = `UNSW：${unswBossSkills[id].name} 对 Bianca 造成 ${damage} 点伤害，并增加 1 层 Deadline Pressure。`; }
    if (id === "groupwork") { setGroupProject(true); statusText = `UNSW：给 Bianca 施加 Group Project，并造成 ${damage} 点伤害；Bianca 下一次攻击伤害降低。`; }
    if (id === "rubric") { setRubricUsed(true); setEnergy((value) => Math.max(0, value - UNSW_SKILLS.rubric.energyLoss)); statusText = `UNSW：${unswBossSkills[id].name} 造成 ${damage} 点伤害，并扣除 Bianca ${UNSW_SKILLS.rubric.energyLoss} 点能量。`; }
    if (id === "courseFee") { setCourseFeeUsed(true); statusText = `UNSW：COURSE FEE　-$1,248，并造成 ${damage} 点伤害。\nBianca：你打架为什么还能收钱啊？！`; }
    if (id === "finalExam") statusText = `UNSW：${unswBossSkills[id].name} 对 Bianca 造成 ${damage} 点伤害。期末周正式开始。`;
    setStatus(statusText);
    setSkillNamePop(unswBossSkills[id].name);
    setCombatEffect({ key: Date.now(), type: id === "finalExam" ? "ultimate-hard" : "normal", target: "bianca" });
    await wait(BATTLE_TIMING.projectile);
    const nextHp = Math.max(0, hp - damage);
    if (damage) {
      setCombatTexts([{ id: `${Date.now()}-unsw-player`, target: "bianca", value: damage, kind: "hp" }]);
      setPlayerHitFx(true);
    }
    setHp(nextHp);
    await wait(BATTLE_TIMING.hit);
    setPendingBossSkill(null); setBattleDialogue(null); setSkillNamePop(null); setCombatTexts([]); setCombatEffect(null); setPlayerHitFx(false); setActionLocked(false);
    if (nextHp <= 0) setStage("defeat");
  }

  const resetBoss = () => {
    setStage("battle"); setBossHp(UNSW_MAX_HP); setHp(BIANCA_BOSS_MAX_HP); setEnergy(0); setTurn(0); setPressure(0);
    setGroupProject(false); setPresentationPreparing(false); setExtensionCooldown(0); setConsiderationCooldown(0); setPhase2(false); setRubricUsed(false);
    setCourseFeeUsed(false); setPendingBossSkill(null); setStatus("UNSW 正在等待你的选择。");
    setOrderShifted(false); setUltimateAnnounced(false); setActionLocked(false); setActingSkill(false); setBossHit(false);
    setPlayerHitFx(false); setCombatTexts([]); setCombatEffect(null); setBattleDialogue(null); setSkillNamePop(null);
  };

  return <div className={`battle-eight-card unsw-battle ${stage === "phase2" ? "week-ten" : ""} ${isCombatGuideOpen ? "combat-guide-paused" : ""}`} style={{ "--unsw-phase-speed": `${0.8 / UNSW_STATS.phase2SpeedMultiplier}s` } as CSSProperties}>
    <img className="battle-eight-bg" src={asset("BattleBg1.png")} alt="UNSW Boss 战场" />
    <div className={`battle-order ${orderShifted ? "is-delayed" : ""}`}><b>行动顺序</b>{actionOrder.map((name, index) => <div className={`order-avatar ${index === 0 ? "active" : ""}`} key={name}><img src={name === "Bianca" ? asset("BiancaIcon.png") : bossAsset("UNSWIcon1.png")} alt={name} /><span>{name === "Bianca" ? "B" : "U"}</span></div>)}</div>
    <div className={`unsw-boss ${bossHit ? "is-hit" : ""}`}><img src={bossMood2 ? bossAsset("UNSW2.png") : bossAsset("UNSW1.png")} alt="UNSW" onError={(event) => { event.currentTarget.hidden = true; }} /></div>
    {debugMode && stage === "battle" && <button className="unsw-debug-damage" onClick={() => setBossHp((value) => Math.max(0, value - 50))}>血量 -50</button>}
    <div className="unsw-hp"><i><em style={{ width: `${bossHp / UNSW_MAX_HP * 100}%` }} /></i><span>HP {bossHp}/{UNSW_MAX_HP}</span></div>
    <div className="unsw-nameplate"><b>UNSW</b><small>The University of New South Wales</small></div>
    <div className={`bianca-battle unsw-bianca ${playerHitFx ? "is-hit" : ""}`}><img src={asset(actingSkill ? "BiancaBattle2.png" : "BiancaBattle1.png")} alt="战斗中的 Bianca" /><div><b>Bianca</b><i><em style={{ width: `${hp / BIANCA_BOSS_MAX_HP * 100}%` }} /></i><small>HP {hp}/{BIANCA_BOSS_MAX_HP}　能量 {energy}/{ENERGY_CONFIG.maxEnergy}</small></div></div>
    <BattleEffectLayer effect={combatEffect} />
    <FloatingCombatText items={combatTexts} />
    {battleDialogue && <BattleShout speaker={battleDialogue.speaker} text={battleDialogue.text} tag={battleDialogue.tag} />}
    {skillNamePop && <strong className="unsw-skill-pop">{skillNamePop}</strong>}
    <CombatGuide entries={unswCombatGuideEntries} open={isCombatGuideOpen} onOpenChange={setIsCombatGuideOpen} currentStats={{ "bianca-unsw": `HP ${hp}/${BIANCA_BOSS_MAX_HP} · 能量 ${energy}/${ENERGY_CONFIG.maxEnergy}`, unsw: `HP ${bossHp}/${UNSW_MAX_HP}` }} />
    {stage === "battle" && <><div className="battle-status-toast unsw-status">{status}{pressure ? `　｜Pressure ×${pressure}` : ""}</div><div className="battle-skills university-skills">{visibleSkills.map((skill) => <button key={skill.id} className={skill.id === "graduation" ? "ultimate" : ""} disabled={actionLocked || (skill.id === "graduation" && energy < UNIVERSITY_SKILLS.graduation.energyCost) || (skill.id === "extension" && extensionCooldown > 0) || (skill.id === "consideration" && considerationCooldown > 0)} onClick={() => useSkill(skill.id)}>{skill.name}<small>{skill.id === "graduation" ? `${energy}/${ENERGY_CONFIG.maxEnergy}` : skill.id === "extension" && extensionCooldown ? `冷却 ${extensionCooldown}` : skill.id === "consideration" && considerationCooldown ? `冷却 ${considerationCooldown}` : skill.description}</small></button>)}</div></>}

    {(stage === "entrance" || stage === "awakening") && <div className="battle-dialogue-overlay unsw-story-overlay"><div><span className={`dialogue-speaker speaker-${currentStory[0]}`}>{currentStory[0]}</span><p>{currentStory[1]}</p><button className="dialogue-next" onClick={advanceStory}>继续</button></div></div>}
    {stage === "phase2" && <div className="battle-overlay phase-two-overlay"><div><img src={bossAsset("UNSW2.png")} alt="大笑的 UNSW" onError={(event) => { event.currentTarget.hidden = true; }} /><h3>PHASE 2</h3><b>WEEK 10</b><p>UNSW：哈哈哈哈哈哈！</p><p>你以为快结束了？现在才 Week 10！</p><button className="dialogue-next" onClick={() => setStage("battle")}>继续战斗</button></div></div>}
    {stage === "defeat" && <div className="battle-overlay"><div><h3>挑战失败</h3><p>这次只需要重新挑战 UNSW，不会重播深渊法师教程。</p><button className="dialogue-next" onClick={resetBoss}>重新挑战 UNSW</button></div></div>}
    {stage === "bossDefeat" && <div className="battle-overlay graduation-overlay"><div><h3>GRADUATION COMPLETE</h3><p><b>UNSW：</b>这不可能——！</p><p><b>Bianca：</b>……毕业了？</p><button className="dialogue-next" onClick={onVictory}>Battle Complete</button></div></div>}
  </div>;
}
