import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { BIANCA_BOSS_MAX_HP, UNSW_MAX_HP, universitySkills, unswBossSkills, type BossSkillId, type UniversitySkillId } from "../data/chapterEightBattleData";
import { BATTLE_TIMING, ENERGY_CONFIG, UNSW_BATTLE_COPY, UNSW_RETRY_ASSIST, UNSW_SKILLS, UNSW_STATS, UNIVERSITY_SKILLS } from "../data/chapterEightBattleConfig";
import { BattleEffectLayer, BattleShout, FloatingCombatText, type CombatEffect, type CombatText } from "./ChapterEightBattleEffects";
import { CombatGuide } from "./CombatGuide";
import { unswCombatGuideEntries } from "../data/chapterEightCombatGuide";
import { usePausableBattleWait } from "../hooks/usePausableBattleWait";

type Props = { paused?: boolean; debugMode?: boolean; startAtPhase2?: boolean; onVictory: () => void };
type Stage = "entrance" | "awakening" | "battle" | "phase2" | "graduationReady" | "defeat" | "bossDefeat";

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
  ["Bianca", "git push……至少这个我会。"],
  ["安柏", "Bianca，这次就交给你了！"],
] as const;

const defeatLines = [
  ["Bianca", "可恶！！我不甘心！"],
  ["Bianca", "我要重来！！"],
  ["作者大大", "或者，你也可以请教请教我~"],
  ["作者大大", "毕竟让 Bianca 输的事我做不到~"],
  ["Bianca", "啊啊啊 UNSW 我跟你拼了！！"],
] as const;

function randomVariant(id: BossSkillId) {
  const variants = unswBossSkills[id].dialogueVariants;
  return variants[Math.floor(Math.random() * variants.length)];
}

export function UnswBattle({ paused = false, debugMode = false, startAtPhase2 = false, onVictory }: Props) {
  const [stage, setStage] = useState<Stage>(startAtPhase2 ? "phase2" : "entrance");
  const [storyIndex, setStoryIndex] = useState(0);
  const [bossHp, setBossHp] = useState<number>(startAtPhase2 ? Math.ceil(UNSW_MAX_HP / 2) : UNSW_MAX_HP);
  const [hp, setHp] = useState<number>(BIANCA_BOSS_MAX_HP);
  const [energy, setEnergy] = useState<number>(0);
  const [turn, setTurn] = useState(0);
  const [pressureStacks, setPressureStacks] = useState<number[]>([]);
  const pressureStacksRef = useRef<number[]>([]);
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
  const [phaseDialogueIndex, setPhaseDialogueIndex] = useState(0);
  const [graduationDialogueIndex, setGraduationDialogueIndex] = useState(0);
  const [defeatDialogueIndex, setDefeatDialogueIndex] = useState(0);
  const [retryAssist, setRetryAssist] = useState(false);
  const [isCombatGuideOpen, setIsCombatGuideOpen] = useState(false);
  const isBattlePaused = paused || isCombatGuideOpen;
  const wait = usePausableBattleWait(isBattlePaused);

  const storyLines = stage === "entrance" ? entranceLines : awakeningLines;
  const currentStory = storyLines[Math.min(storyIndex, storyLines.length - 1)];
  const bossMood2 = pendingBossSkill || stage === "phase2" || stage === "bossDefeat";
  const actionOrder = pendingBossSkill ? ["UNSW", "Bianca"] : ["Bianca", "UNSW"];
  const visibleSkills = useMemo(() => universitySkills, []);
  const combatGuideEntries = useMemo(() => {
    if (!retryAssist && !phase2) return unswCombatGuideEntries;
    return unswCombatGuideEntries.map((entry) => entry.id !== "bianca-unsw" ? entry : ({
      ...entry,
      skills: entry.skills.map((skill) => ({
        ...skill,
        stats: skill.stats?.map((stat) => {
          if (skill.name === "git push" && stat.label === "Energy Gain" && phase2) return { ...stat, value: UNIVERSITY_SKILLS.xlookup.phase2EnergyGain };
          if (stat.label === "Damage" && retryAssist) return { ...stat, value: Math.round(Number(stat.value) * UNSW_RETRY_ASSIST.playerDamageMultiplier) };
          return stat;
        }),
      })),
    }));
  }, [phase2, retryAssist]);
  const graduationCanKill = bossHp <= UNIVERSITY_SKILLS.graduation.damage;

  useEffect(() => {
    if (stage !== "battle" || !phase2 || ultimateAnnounced || actionLocked || pendingBossSkill) return;
    if (energy >= UNIVERSITY_SKILLS.graduation.energyCost && graduationCanKill) {
      setUltimateAnnounced(true);
      setGraduationDialogueIndex(0);
      setStage("graduationReady");
    }
  }, [actionLocked, energy, graduationCanKill, pendingBossSkill, phase2, stage, ultimateAnnounced]);

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
    if (id === "graduation") {
      if (!phase2 || energy < UNIVERSITY_SKILLS.graduation.energyCost) return;
      if (!graduationCanKill || !ultimateAnnounced) {
        setActionLocked(true);
        setBattleDialogue({ speaker: "UNSW", text: UNSW_BATTLE_COPY.graduationLockedTaunt, tag: "嘲讽" });
        await wait(BATTLE_TIMING.dialogueLine);
        setBattleDialogue(null);
        setActionLocked(false);
        return;
      }
    }
    const energyCost = id === "graduation" ? UNIVERSITY_SKILLS.graduation.energyCost : UNIVERSITY_SKILLS[id].energyCost;
    if (energy < energyCost) return;
    if (id === "extension" && extensionCooldown > 0) return;
    if (id === "consideration" && considerationCooldown > 0) return;
    const skill = universitySkills.find((item) => item.id === id)!;
    const multiplier = groupProject && id !== "groupChat" ? UNSW_SKILLS.groupwork.playerDamageMultiplier : 1;
    const rawDamage = Math.round(skill.damage * multiplier * (retryAssist ? UNSW_RETRY_ASSIST.playerDamageMultiplier : 1));
    const survivalTaunt = id !== "graduation" && rawDamage >= bossHp;
    const damage = survivalTaunt ? 0 : rawDamage;
    const nextBossHp = id === "graduation" ? 0 : Math.max(1, bossHp - damage);
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
    }
    setBossHit(true);
    if (survivalTaunt) {
      const taunts = UNSW_BATTLE_COPY.survivalTaunts;
      setBattleDialogue({ speaker: "UNSW", text: taunts[Math.floor(Math.random() * taunts.length)], tag: "嘲讽" });
      await wait(BATTLE_TIMING.dialogueLine);
      if (ultimateAnnounced) {
        setBattleDialogue({ speaker: "Bianca", text: UNSW_BATTLE_COPY.biancaReply, tag: "回应" });
        await wait(BATTLE_TIMING.dialogueLine);
      }
    }
    const energyGain = phase2 && id === "xlookup" ? UNIVERSITY_SKILLS.xlookup.phase2EnergyGain : skill.energy;
    setEnergy((value) => id === "graduation" ? 0 : Math.min(ENERGY_CONFIG.maxEnergy, Math.max(0, value - energyCost) + energyGain));
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
      pressureStacksRef.current = [];
      setPressureStacks([]);
      setStatus(`Bianca：Special Consideration 恢复 ${UNIVERSITY_SKILLS.consideration.heal} HP，并清除了 Deadline Pressure。`);
    } else if (id === "graduation") setStatus("Bianca：毕业命中 UNSW。这一天，终于来了。");
    else setStatus(`Bianca：${skill.name} 命中 UNSW。`);

    await wait(BATTLE_TIMING.hit);
    setActingSkill(false); setBossHit(false); setCombatTexts([]); setCombatEffect(null); setBattleDialogue(null);
    if (nextBossHp <= 0) { setActionLocked(false); setStage("bossDefeat"); return; }
    if (!phase2 && nextBossHp <= UNSW_MAX_HP * UNSW_STATS.phase2Threshold) { setActionLocked(false); setPhase2(true); setPhaseDialogueIndex(0); setStage("phase2"); return; }
    if (skipBossTurn) {
      window.setTimeout(() => setOrderShifted(false), 500);
      setActionLocked(false);
      return;
    }
    await queueBossTurn(nextTurn);
  };

  async function executeBossSkill(id: BossSkillId) {
    let damage = unswBossSkills[id].damage;
    let displayedSkillName = unswBossSkills[id].name;
    let statusText = `UNSW：${unswBossSkills[id].name} 对 Bianca 造成 ${damage} 点伤害。`;
    if (id === "presentation") {
      if (!presentationPreparing) { setPresentationPreparing(true); damage = 0; statusText = "UNSW：PRESENTATION 正在蓄力；可用 Extension Request 延期。"; }
      else { damage = phase2 ? UNSW_SKILLS.presentation.phase2Damage : UNSW_SKILLS.presentation.damage; setPresentationPreparing(false); statusText = `UNSW：Presentation 正式开始，对 Bianca 造成 ${damage} 点伤害。没有讲稿，也没有退路。`; }
    }
    const addsPressure = id === "assignment" || id === "groupwork" || id === "rubric" || id === "finalExam" || (id === "presentation" && !presentationPreparing);
    const currentPressureStacks = pressureStacksRef.current;
    // 一回合是一来一回：旧 Pressure 在本次 UNSW 行动结算一次，新施加的层数从下一轮才开始计时和扣血。
    const agedPressureStacks = currentPressureStacks.map((turns) => turns - 1).filter((turns) => turns > 0);
    const pressureAdded = addsPressure && agedPressureStacks.length < UNSW_SKILLS.pressure.maxStacks;
    const nextPressureStacks = pressureAdded
      ? [UNSW_SKILLS.pressure.durationTurns, ...agedPressureStacks]
      : agedPressureStacks;
    const pressureResult = "增加 1 层 Deadline Pressure";
    if (id === "assignment") statusText = `UNSW：${unswBossSkills[id].name} 对 Bianca 造成 ${damage} 点伤害，并${pressureResult}。`;
    if (id === "groupwork") { setGroupProject(true); statusText = `UNSW：给 Bianca 施加 Group Project，${pressureResult}，并造成 ${damage} 点伤害；Bianca 下一次攻击伤害降低。`; }
    if (id === "rubric") { setRubricUsed(true); setEnergy((value) => Math.max(0, value - UNSW_SKILLS.rubric.energyLoss)); statusText = `UNSW：${unswBossSkills[id].name} 造成 ${damage} 点伤害、${pressureResult}，并扣除 Bianca ${UNSW_SKILLS.rubric.energyLoss} 点能量。`; }
    if (id === "courseFee") {
      const { minCharge, maxCharge, damageRate } = UNSW_SKILLS.courseFee;
      const charge = Math.floor(Math.random() * (maxCharge - minCharge + 1)) + minCharge;
      damage = Math.ceil(charge * damageRate);
      displayedSkillName = `COURSE FEE　-$${charge.toLocaleString("en-AU")}`;
      setCourseFeeUsed(true);
      statusText = `UNSW：${displayedSkillName}，并造成 ${damage} 点伤害。\nBianca：你打架为什么还能收钱啊？！`;
    }
    if (id === "finalExam") statusText = `UNSW：${unswBossSkills[id].name} 对 Bianca 造成 ${damage} 点伤害，并${pressureResult}。期末周正式开始。`;
    if (id === "presentation" && !presentationPreparing) statusText = `${statusText}\n同时${pressureResult}。`;
    setStatus(statusText);
    setSkillNamePop(displayedSkillName);
    setCombatEffect({ key: Date.now(), type: id === "finalExam" ? "ultimate-hard" : "normal", target: "bianca" });
    await wait(BATTLE_TIMING.projectile);
    let nextHp = Math.max(0, hp - damage);
    if (damage) {
      setCombatTexts([{ id: `${Date.now()}-unsw-player`, target: "bianca", value: damage, kind: "hp" }]);
      setPlayerHitFx(true);
    }
    setHp(nextHp);
    await wait(BATTLE_TIMING.hit);
    if (nextHp > 0 && currentPressureStacks.length > 0) {
      const pressureDamage = currentPressureStacks.length * UNSW_SKILLS.pressure.damagePerStack;
      nextHp = Math.max(0, nextHp - pressureDamage);
      setStatus((current) => `${current}\nDeadline Pressure 造成 ${pressureDamage} 点持续伤害。`);
      setCombatTexts([{ id: `${Date.now()}-pressure-player`, target: "bianca", value: pressureDamage, kind: "hp" }]);
      setPlayerHitFx(false);
      await wait(40);
      setPlayerHitFx(true);
      setHp(nextHp);
      await wait(BATTLE_TIMING.hit);
    }
    pressureStacksRef.current = nextPressureStacks;
    setPressureStacks(nextPressureStacks);
    setPendingBossSkill(null); setBattleDialogue(null); setSkillNamePop(null); setCombatTexts([]); setCombatEffect(null); setPlayerHitFx(false); setActionLocked(false);
    if (nextHp <= 0) { setDefeatDialogueIndex(0); setStage("defeat"); }
  }

  const resetBoss = () => {
    pressureStacksRef.current = [];
    setRetryAssist(true);
    setStage("battle"); setBossHp(UNSW_RETRY_ASSIST.bossStartingHp); setHp(BIANCA_BOSS_MAX_HP); setEnergy(UNSW_RETRY_ASSIST.playerStartingEnergy); setTurn(0); setPressureStacks([]);
    setGroupProject(false); setPresentationPreparing(false); setExtensionCooldown(0); setConsiderationCooldown(0); setPhase2(true); setRubricUsed(false);
    setCourseFeeUsed(false); setPendingBossSkill(null); setStatus("UNSW 正在等待你的选择。");
    setOrderShifted(false); setUltimateAnnounced(false); setActionLocked(false); setActingSkill(false); setBossHit(false);
    setPlayerHitFx(false); setCombatTexts([]); setCombatEffect(null); setBattleDialogue(null); setSkillNamePop(null);
    setPhaseDialogueIndex(0); setGraduationDialogueIndex(0);
  };

  const advancePhaseDialogue = () => {
    if (phaseDialogueIndex < UNSW_BATTLE_COPY.phase2Intro.length - 1) setPhaseDialogueIndex((value) => value + 1);
    else { setPhaseDialogueIndex(0); setStage("battle"); }
  };

  const advanceGraduationDialogue = () => {
    if (graduationDialogueIndex < UNSW_BATTLE_COPY.graduationReady.length - 1) setGraduationDialogueIndex((value) => value + 1);
    else { setGraduationDialogueIndex(0); setStatus("ULTIMATE READY · 毕业"); setStage("battle"); }
  };

  const advanceDefeatDialogue = () => {
    if (defeatDialogueIndex < defeatLines.length - 1) setDefeatDialogueIndex((value) => value + 1);
    else resetBoss();
  };

  return <div className={`battle-eight-card unsw-battle ${stage === "phase2" ? "week-ten" : ""} ${isCombatGuideOpen ? "combat-guide-paused" : ""}`} style={{ "--unsw-phase-speed": `${0.8 / UNSW_STATS.phase2SpeedMultiplier}s` } as CSSProperties}>
    <img className="battle-eight-bg" src={asset("BattleBg1.png")} alt="UNSW Boss 战场" />
    <div className={`battle-order ${orderShifted ? "is-delayed" : ""}`}><b>行动顺序</b>{actionOrder.map((name, index) => <div className={`order-avatar ${index === 0 ? "active" : ""}`} key={name}><img src={name === "Bianca" ? asset("BiancaIcon.png") : bossAsset("UNSWIcon1.png")} alt={name} /><span>{name === "Bianca" ? "B" : "U"}</span></div>)}</div>
    <div className={`unsw-boss ${bossHit ? "is-hit" : ""}`}><img src={bossMood2 ? bossAsset("UNSW2.png") : bossAsset("UNSW1.png")} alt="UNSW" onError={(event) => { event.currentTarget.hidden = true; }} /></div>
    {debugMode && stage === "battle" && <button className="unsw-debug-damage" onClick={() => setBossHp((value) => Math.max(0, value - 50))}>血量 -50</button>}
    {debugMode && stage === "battle" && <button className="unsw-debug-heal" onClick={() => setHp((value) => Math.min(BIANCA_BOSS_MAX_HP, value + 20))}>血量 +20</button>}
    <div className="unsw-hp"><i><em style={{ width: `${bossHp / UNSW_MAX_HP * 100}%` }} /></i><span>HP {bossHp}/{UNSW_MAX_HP}</span></div>
    <div className="unsw-nameplate"><b>UNSW</b><small>The University of New South Wales</small></div>
    <div className={`bianca-battle unsw-bianca ${playerHitFx ? "is-hit" : ""}`}><img src={asset(actingSkill ? "BiancaBattle2.png" : "BiancaBattle1.png")} alt="战斗中的 Bianca" />{pressureStacks.length > 0 && <div className="unsw-pressure-indicator" title={`Deadline Pressure：${pressureStacks.length} 层`}>{pressureStacks.map((_, index) => <img key={index} src={asset("PressureIcon1.png")} alt="Deadline Pressure" />)}</div>}<div><b>Bianca</b><i><em style={{ width: `${hp / BIANCA_BOSS_MAX_HP * 100}%` }} /></i><small>HP {hp}/{BIANCA_BOSS_MAX_HP}　能量 {energy}/{ENERGY_CONFIG.maxEnergy}</small></div></div>
    <BattleEffectLayer effect={combatEffect} />
    <FloatingCombatText items={combatTexts} />
    {battleDialogue && <BattleShout speaker={battleDialogue.speaker} text={battleDialogue.text} tag={battleDialogue.tag} />}
    {skillNamePop && <strong className="unsw-skill-pop">{skillNamePop}</strong>}
    <CombatGuide entries={combatGuideEntries} open={isCombatGuideOpen} onOpenChange={setIsCombatGuideOpen} currentStats={{ "bianca-unsw": `HP ${hp}/${BIANCA_BOSS_MAX_HP} · 能量 ${energy}/${ENERGY_CONFIG.maxEnergy}`, unsw: `HP ${bossHp}/${UNSW_MAX_HP}` }} />
    {stage === "battle" && <><div className="battle-status-toast unsw-status">{status}</div><div className="battle-skills university-skills">{visibleSkills.map((skill) => {
      const cost = skill.id === "graduation" ? UNIVERSITY_SKILLS.graduation.energyCost : UNIVERSITY_SKILLS[skill.id].energyCost;
      const graduationHardLocked = skill.id === "graduation" && (!phase2 || energy < cost);
      return <button key={skill.id} className={`${skill.id === "graduation" ? "ultimate" : ""} ${skill.id === "graduation" && (!graduationCanKill || !ultimateAnnounced) ? "is-locked" : ""}`} disabled={actionLocked || graduationHardLocked || energy < cost || (skill.id === "extension" && extensionCooldown > 0) || (skill.id === "consideration" && considerationCooldown > 0)} onClick={() => useSkill(skill.id)}>{skill.name}<small>{skill.id === "graduation" ? `${energy}/${cost}` : skill.id === "extension" && extensionCooldown ? `冷却 ${extensionCooldown}` : skill.id === "consideration" && considerationCooldown ? `冷却 ${considerationCooldown}` : <>{skill.description}{cost > 0 && <><br />能量 -{cost}</>}</>}</small></button>;
    })}</div></>}

    {(stage === "entrance" || stage === "awakening") && <div className="battle-dialogue-overlay unsw-story-overlay"><div><span className={`dialogue-speaker speaker-${currentStory[0]}`}>{currentStory[0]}</span><p>{currentStory[1]}</p><button className="dialogue-next" onClick={advanceStory}>继续</button></div></div>}
    {stage === "phase2" && <div className="battle-dialogue-overlay unsw-story-overlay"><div><span className={`dialogue-speaker speaker-${UNSW_BATTLE_COPY.phase2Intro[phaseDialogueIndex].speaker}`}>{UNSW_BATTLE_COPY.phase2Intro[phaseDialogueIndex].speaker}</span><p>{UNSW_BATTLE_COPY.phase2Intro[phaseDialogueIndex].text}</p><button className="dialogue-next" onClick={advancePhaseDialogue}>继续</button></div></div>}
    {stage === "graduationReady" && <div className="battle-dialogue-overlay unsw-story-overlay"><div><span className="dialogue-speaker speaker-Bianca">Bianca</span><p>{UNSW_BATTLE_COPY.graduationReady[graduationDialogueIndex].text}</p><button className="dialogue-next" onClick={advanceGraduationDialogue}>继续</button></div></div>}
    {stage === "defeat" && <div className="battle-dialogue-overlay unsw-story-overlay"><div><span className={`dialogue-speaker speaker-${defeatLines[defeatDialogueIndex][0]}`}>{defeatLines[defeatDialogueIndex][0]}</span><p>{defeatLines[defeatDialogueIndex][1]}</p><button className="dialogue-next" onClick={advanceDefeatDialogue}>{defeatDialogueIndex === defeatLines.length - 1 ? "重新挑战" : "继续"}</button></div></div>}
    {stage === "bossDefeat" && <div className="battle-overlay graduation-overlay"><div><h3>GRADUATION COMPLETE</h3><p><b>UNSW：</b>这不可能——！</p><p><b>Bianca：</b>……毕业了？</p><button className="dialogue-next" onClick={onVictory}>Battle Complete</button></div></div>}
  </div>;
}
