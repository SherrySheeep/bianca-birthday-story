import { useEffect, useMemo, useRef, useState } from "react";
import { chapterEightBattleIntro, chapterEightOpening, chapterEightPreRitual, chapterEightRitualAfter, chapterEightVictory, type ChapterEightLine } from "../data/chapterEightDialogue";
import { abyssTutorialSteps, type AbyssAction } from "../data/chapterEightBattleData";
import { ABYSS_MAGE_SKILLS, ABYSS_MAGE_STATS, BIANCA_SKILLS, BIANCA_STATS, DAMAGE_RULES, ELEMENT_CONFIG, ENERGY_CONFIG, chapterEightBattleConfig, supportCooldownLength, type ChapterEightSupport } from "../data/chapterEightBattleConfig";
import { BattleEffectLayer, BattleShout, FloatingCombatText, type CombatEffect, type CombatText } from "./ChapterEightBattleEffects";
import { CombatGuide } from "./CombatGuide";
import { SectionHeader } from "./UI";
import { UnswBattle } from "./UnswBattle";
import { abyssCombatGuideEntries } from "../data/chapterEightCombatGuide";
import { usePausableBattleWait } from "../hooks/usePausableBattleWait";

type Props = {
  onComplete: () => void;
  paused?: boolean;
  debugMode?: boolean;
  debugAction?: { type: "enterBattle" | "skipTutorial" | "skipMobs" | "skipPhase1" | "skipPhase2"; key: number } | null;
};
type Phase = "story" | "battleIntro" | "preRitual" | "ritual" | "ritualAfter" | "battle" | "battleWon" | "fakeVictory" | "unswBoss" | "defeat" | "victory" | "complete";
type EnemyId = "blue" | "red" | "purple";
type Support = ChapterEightSupport;
type Enemy = { id: EnemyId; name: string; hp: number; maxHp: number; shield: number; maxShield: number; image: string; burning: number; embarrassed: boolean };
type BattleOverlay = { title: string; lines: string[] } | null;

const asset = (name: string) => `${import.meta.env.BASE_URL}chapter-eight/${name}`;
const publicAsset = (name: string) => `${import.meta.env.BASE_URL}${name}`;
const initialEnemies = (): Enemy[] => [
  { id: "blue", name: "蓝色深渊法师", hp: ABYSS_MAGE_STATS.blue.maxHp, maxHp: ABYSS_MAGE_STATS.blue.maxHp, shield: ABYSS_MAGE_STATS.blue.maxShield, maxShield: ABYSS_MAGE_STATS.blue.maxShield, image: "Blue1.png", burning: 0, embarrassed: false },
  { id: "red", name: "红色深渊法师", hp: ABYSS_MAGE_STATS.red.maxHp, maxHp: ABYSS_MAGE_STATS.red.maxHp, shield: ABYSS_MAGE_STATS.red.maxShield, maxShield: ABYSS_MAGE_STATS.red.maxShield, image: "Red2.png", burning: 0, embarrassed: false },
  { id: "purple", name: "紫色深渊法师", hp: ABYSS_MAGE_STATS.purple.maxHp, maxHp: ABYSS_MAGE_STATS.purple.maxHp, shield: ABYSS_MAGE_STATS.purple.maxShield, maxShield: ABYSS_MAGE_STATS.purple.maxShield, image: "Purple1.png", burning: 0, embarrassed: false },
];

const jokes = [
  ["你知道为什么冰深渊法师不喜欢夏天吗？", "因为它怕自己融入集体。"],
  ["你知道深渊法师为什么不坐电梯吗？", "因为它们比较喜欢深渊。"],
  ["火深渊法师为什么从不迟到？", "因为它总是很着火。"],
  ["雷深渊法师最怕什么课程？", "绝缘材料学。"],
];

function damageEnemy(enemy: Enemy, hpDamage: number, shieldDamage: number): Enemy {
  if (enemy.shield > 0) {
    const shieldHit = Math.min(enemy.shield, shieldDamage);
    const overflowDamage = Math.max(0, shieldDamage - enemy.shield) * DAMAGE_RULES.shieldOverflowToHpRatio;
    return {
      ...enemy,
      shield: enemy.shield - shieldHit,
      hp: Math.max(0, enemy.hp - overflowDamage),
    };
  }

  return { ...enemy, hp: Math.max(0, enemy.hp - hpDamage) };
}

function StoryFrame({ line }: { line: ChapterEightLine }) {
  const sceneImage = line.scene === "observe" ? "shenyuanfashimen1.png" : line.scene === "close" ? "shenyuanfashimen3.png" : "BattleBg1.png";
  const isClose = line.scene === "close";
  const enemySpeaker = line.speaker.includes("深渊法师") ? line.speaker.slice(0, 2) : "";
  const mood = line.enemyMood ?? 1;
  return (
    <div className={`chapter-eight-visual scene-${line.scene}`}>
      <img className="chapter-eight-background" src={asset(sceneImage)} alt="蒙德城外的异常现场" />
      {isClose && <div className="abyss-story-composition">
        {(["Blue", "Red", "Purple"] as const).map((colour, index) => {
          const label = ["蓝色", "红色", "紫色"][index];
          const active = enemySpeaker === label;
          return <img key={colour} className={`abyss-story-mage story-${colour.toLowerCase()} ${active ? "speaking" : ""}`} src={asset(`${colour}${active ? mood : 1}.png`)} alt={`${label}深渊法师`} />;
        })}
        <img className="story-mystery-item" src={asset("MysteriousItem.png")} alt="发光的神秘物品" />
      </div>}
      {line.portrait && <img className="chapter-eight-portrait" src={line.portrait.includes("/") ? publicAsset(line.portrait) : asset(line.portrait)} alt={`${line.speaker}立绘`} />}
    </div>
  );
}

export function ChapterEightStory({ onComplete, paused = false, debugMode = false, debugAction = null }: Props) {
  const [phase, setPhase] = useState<Phase>("story");
  const [lineIndex, setLineIndex] = useState(0);
  const [hp, setHp] = useState<number>(BIANCA_STATS.maxHp);
  const [energy, setEnergy] = useState<number>(0);
  const [enemies, setEnemies] = useState<Enemy[]>(initialEnemies);
  const [target, setTarget] = useState<EnemyId>("red");
  const [support, setSupport] = useState<Support>("amber");
  const [round, setRound] = useState(0);
  const [skillCooldown, setSkillCooldown] = useState(0);
  const [battleLog, setBattleLog] = useState("选择目标与场外支援，然后发动技能。");
  const [overlay, setOverlay] = useState<BattleOverlay>(null);
  const [delayed, setDelayed] = useState(false);
  const [failures, setFailures] = useState(0);
  const [seenResonance, setSeenResonance] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [geoShield, setGeoShield] = useState<number>(BIANCA_STATS.startingShield);
  const [supportCooldowns, setSupportCooldowns] = useState<Record<Support, number>>({ amber: 0, venti: 0, zhongli: 0 });
  const [actionLocked, setActionLocked] = useState(false);
  const [actingSkill, setActingSkill] = useState<AbyssAction | null>(null);
  const [battleDialogue, setBattleDialogue] = useState<{ speaker: string; text: string; tag?: string } | null>(null);
  const [combatTexts, setCombatTexts] = useState<CombatText[]>([]);
  const [combatEffect, setCombatEffect] = useState<CombatEffect | null>(null);
  const [hitEnemies, setHitEnemies] = useState<EnemyId[]>([]);
  const [playerHit, setPlayerHit] = useState(false);
  const [breakEnemies, setBreakEnemies] = useState<EnemyId[]>([]);
  const [enemyDelays, setEnemyDelays] = useState<EnemyId[]>([]);
  const [supportUnlocked, setSupportUnlocked] = useState(false);
  const [isCombatGuideOpen, setIsCombatGuideOpen] = useState(false);
  const clickLock = useRef(false);
  const clickTimer = useRef<number | undefined>(undefined);

  const lines = phase === "story" ? chapterEightOpening : phase === "battleIntro" ? chapterEightBattleIntro : phase === "preRitual" ? chapterEightPreRitual : phase === "ritualAfter" ? chapterEightRitualAfter : chapterEightVictory;
  const currentLine = lines[Math.min(lineIndex, lines.length - 1)];
  const aliveEnemies = useMemo(() => enemies.filter((enemy) => enemy.hp > 0), [enemies]);
  const isBattlePaused = paused || isCombatGuideOpen;
  const wait = usePausableBattleWait(isBattlePaused);
  const actionOrder = useMemo(() => {
    const enemyEntries = [
      { id: "blue", label: "蓝", image: "SYBlue1.png" },
      { id: "red", label: "红", image: "SYRed1.png" },
      { id: "purple", label: "紫", image: "SYPurple1.png" },
    ].filter((entry) => enemies.some((enemy) => enemy.id === entry.id && enemy.hp > 0));
    const bianca = { id: "bianca", label: "B", image: "BiancaIcon.png" };
    const orderedEnemies = [...enemyEntries].sort((a, b) => Number(enemyDelays.includes(a.id as EnemyId)) - Number(enemyDelays.includes(b.id as EnemyId)));
    return delayed ? [orderedEnemies[0], bianca, ...orderedEnemies.slice(1)].filter(Boolean) : [bianca, ...orderedEnemies];
  }, [delayed, enemies, enemyDelays]);

  useEffect(() => () => window.clearTimeout(clickTimer.current), []);

  useEffect(() => {
    const selectedEnemy = enemies.find((enemy) => enemy.id === target);
    if (selectedEnemy && selectedEnemy.hp > 0) return;
    const leftmostLivingEnemy = enemies.find((enemy) => enemy.hp > 0);
    if (leftmostLivingEnemy) setTarget(leftmostLivingEnemy.id);
  }, [enemies, target]);

  useEffect(() => {
    if (!debugAction) return;
    setOverlay(null);
    setLineIndex(0);
    if (debugAction.type === "skipPhase2") {
      setPhase("victory");
      return;
    }
    if (debugAction.type === "skipMobs" || debugAction.type === "skipPhase1") {
      setPhase("unswBoss");
      return;
    }
    setHp(BIANCA_STATS.maxHp); setEnergy(0); setEnemies(initialEnemies()); setTarget("red"); setSupport("amber");
    setRound(0); setSkillCooldown(0); setBattleLog("开发者模式：已直接进入深渊法师教程战。");
    setDelayed(false); setTipVisible(false); setTutorialStep(0);
    setGeoShield(BIANCA_STATS.startingShield); setSupportCooldowns({ amber: 0, venti: 0, zhongli: 0 }); setActionLocked(false); setActingSkill(null);
    setBattleDialogue(null); setCombatTexts([]); setCombatEffect(null); setHitEnemies([]); setPlayerHit(false); setBreakEnemies([]); setEnemyDelays([]);
    const skipTutorial = debugAction.type === "skipTutorial";
    setTutorialStep(skipTutorial ? abyssTutorialSteps.length : 0);
    setSupportUnlocked(skipTutorial);
    setPhase("battle");
  }, [debugAction]);

  useEffect(() => {
    if (phase !== "fakeVictory") return;
    let cancelled = false;
    void wait(1400).then(() => { if (!cancelled) setPhase("unswBoss"); });
    return () => { cancelled = true; };
  }, [phase, wait]);

  const advanceStory = () => {
    if (isBattlePaused || clickLock.current) return;
    clickLock.current = true;
    clickTimer.current = window.setTimeout(() => { clickLock.current = false; }, 220);
    if (lineIndex < lines.length - 1) { setLineIndex((value) => value + 1); return; }
    setLineIndex(0);
    if (phase === "story") setPhase("battleIntro");
    if (phase === "battleIntro") setPhase("battle");
    if (phase === "preRitual") setPhase("ritual");
    if (phase === "ritualAfter") setPhase("battle");
    if (phase === "victory") setPhase("complete");
  };

  const resetBattle = () => {
    setHp(BIANCA_STATS.maxHp); setEnergy(0); setEnemies(initialEnemies()); setTarget("red"); setSupport("amber");
    setRound(0); setSkillCooldown(0); setBattleLog("选择目标与场外支援，然后发动技能。");
    setOverlay(null); setDelayed(false); setTipVisible(false); setTutorialStep(0); setPhase("battle");
    setGeoShield(BIANCA_STATS.startingShield); setSupportCooldowns({ amber: 0, venti: 0, zhongli: 0 }); setActionLocked(false); setActingSkill(null);
    setBattleDialogue(null); setCombatTexts([]); setCombatEffect(null); setHitEnemies([]); setPlayerHit(false); setBreakEnemies([]); setEnemyDelays([]);
    setSupportUnlocked(false);
  };

  const makeEnemyCombatTexts = (before: Enemy[], after: Enemy[], stagger = false): CombatText[] => {
    const key = Date.now();
    return after.flatMap((enemy, index) => {
      const previous = before.find((item) => item.id === enemy.id);
      if (!previous) return [];
      const delay = stagger ? index * chapterEightBattleConfig.timing.aoeStagger : 0;
      const shieldDelta = enemy.shield - previous.shield;
      const hpLoss = Math.max(0, Math.round(previous.hp - enemy.hp));
      return [
        ...(shieldDelta < 0 ? [{ id: `${key}-${enemy.id}-shield`, target: enemy.id, value: Math.round(-shieldDelta), kind: "shield" as const, delay }] : []),
        ...(shieldDelta > 0 ? [{ id: `${key}-${enemy.id}-gain`, target: enemy.id, value: Math.round(shieldDelta), kind: "shieldGain" as const, delay }] : []),
        ...(hpLoss ? [{ id: `${key}-${enemy.id}-hp`, target: enemy.id, value: hpLoss, kind: "hp" as const, delay }] : []),
      ];
    });
  };

  const playEnemyImpact = async (before: Enemy[], after: Enemy[], ids: EnemyId[], effect: CombatEffect["type"], stagger = false) => {
    const broken = after.filter((enemy) => enemy.shield === 0 && (before.find((item) => item.id === enemy.id)?.shield ?? 0) > 0).map((enemy) => enemy.id);
    setCombatEffect({ key: Date.now(), type: effect, target: ids.length === 1 ? ids[0] : "all" });
    setHitEnemies(ids); setBreakEnemies(broken); setCombatTexts(makeEnemyCombatTexts(before, after, stagger)); setEnemies(after);
    await wait(chapterEightBattleConfig.timing.hit + (stagger ? ids.length * chapterEightBattleConfig.timing.aoeStagger : 0));
    setHitEnemies([]); setBreakEnemies([]); setCombatTexts([]); setCombatEffect(null);
  };

  const runEnemyTurn = async (afterPlayer: Enemy[], nextRound: number, usedSupport?: Support, shieldAfterPlayer = geoShield) => {
    if (afterPlayer.every((enemy) => enemy.hp <= 0)) {
      setEnemies(afterPlayer); setPhase("fakeVictory"); setLineIndex(0); setActionLocked(false); setActingSkill(null); return;
    }

    let updated = afterPlayer.map((enemy) => enemy.burning > 0 && enemy.hp > 0
      ? { ...enemy, hp: Math.max(0, enemy.hp - chapterEightBattleConfig.burnDamage), burning: enemy.burning - 1, embarrassed: false }
      : { ...enemy, embarrassed: false });
    const burningIds = updated.filter((enemy, index) => enemy.hp < afterPlayer[index].hp).map((enemy) => enemy.id);
    if (burningIds.length) {
      setBattleDialogue({ speaker: "状态", text: "燃烧仍在持续。", tag: "燃烧" });
      await playEnemyImpact(afterPlayer, updated, burningIds, "fire", true);
    }
    if (updated.every((enemy) => enemy.hp <= 0)) {
      setPhase("fakeVictory"); setLineIndex(0); setActionLocked(false); setActingSkill(null); setBattleDialogue(null); return;
    }

    let incoming = 0;
    let selfShieldGain = 0;
    let paralysis = false;
    let enemyLine = { speaker: "深渊法师", text: "接招！", tag: "攻击" };
    const beforeEnemySkills = updated;
    updated.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      if (enemy.id === "blue" && enemy.shield < ABYSS_MAGE_SKILLS.blue.frostShield.shieldGain && nextRound % 2 === 0) {
        selfShieldGain = Math.min(enemy.maxShield - enemy.shield, ABYSS_MAGE_SKILLS.blue.frostShield.shieldGain);
        updated = updated.map((item) => item.id === "blue" ? { ...item, shield: Math.min(item.maxShield, item.shield + ABYSS_MAGE_SKILLS.blue.frostShield.shieldGain) } : item);
        enemyLine = { speaker: "蓝色深渊法师", text: "休想伤到我！", tag: "寒气护盾" };
      } else if (enemy.id === "red" && nextRound % 2 === 0) {
        incoming += ABYSS_MAGE_SKILLS.red.flameBurst.damage; enemyLine = { speaker: "红色深渊法师", text: "这下可躲不开了！", tag: "火焰爆发" };
      } else if (enemy.id === "purple" && nextRound % 2 === 1) {
        incoming += ABYSS_MAGE_SKILLS.purple.paralysisInterference.damage; paralysis = true; enemyLine = { speaker: "紫色深渊法师", text: "别想那么快出手！", tag: "麻痹干扰" };
      } else {
        incoming += enemy.id === "blue" ? ABYSS_MAGE_SKILLS.blue.iceShard.damage : enemy.id === "red" ? ABYSS_MAGE_SKILLS.red.fireball.damage : ABYSS_MAGE_SKILLS.purple.lightningStrike.damage;
      }
    });

    if (nextRound % 2 === 0) {
      const recipient = updated.find((enemy) => enemy.hp > 0);
      if (recipient) {
        updated = updated.map((enemy) => enemy.id === recipient.id ? { ...enemy, shield: Math.min(enemy.maxShield, enemy.shield + ABYSS_MAGE_SKILLS.resonance.shieldGain) } : enemy);
        if (!seenResonance) { setSeenResonance(true); enemyLine = { speaker: "Bianca", text: "它还会给自己加护盾？！", tag: "异界共鸣" }; }
      }
    }

    setBattleDialogue(enemyLine);
    setCombatTexts(makeEnemyCombatTexts(beforeEnemySkills, updated));
    setEnemies(updated);
    if (paralysis) setCombatEffect({ key: Date.now(), type: "paralysis", target: "bianca" });
    await wait(chapterEightBattleConfig.timing.dialogueLead);

    const reduction = failures >= 2 ? DAMAGE_RULES.retryAssistIncomingDamageMultiplier : 1;
    const rawDamage = Math.round(incoming * reduction);
    const shieldDamage = Math.min(shieldAfterPlayer, rawDamage);
    const hpDamage = Math.max(0, rawDamage - shieldDamage);
    const nextShield = shieldAfterPlayer - shieldDamage;
    const nextHp = Math.max(0, hp - hpDamage);
    const texts: CombatText[] = [
      ...(shieldDamage ? [{ id: `${Date.now()}-bianca-shield`, target: "bianca" as const, value: shieldDamage, kind: "shield" as const }] : []),
      ...(hpDamage ? [{ id: `${Date.now()}-bianca-hp`, target: "bianca" as const, value: hpDamage, kind: "hp" as const }] : []),
    ];
    setGeoShield(nextShield); setHp(nextHp); setCombatTexts(texts); setPlayerHit(rawDamage > 0); setEnergy((value) => Math.min(ENERGY_CONFIG.maxEnergy, value + ENERGY_CONFIG.enemyTurnGain));
    if (paralysis) {
      if (shieldAfterPlayer > 0 && ELEMENT_CONFIG.zhongli.blocksParalysisDelay) {
        setBattleDialogue({ speaker: "状态", text: "岩盾挡住了麻痹干扰。", tag: "麻痹抵抗" });
      } else {
        setDelayed(true);
      }
    }
    if (rawDamage > 0 && Math.random() < .55) {
      const reactions = ["嘶——！", "好痛！", "又来？！"];
      setBattleDialogue({ speaker: "Bianca", text: reactions[nextRound % reactions.length] });
    }
    const receivedText = shieldDamage > 0
      ? `Bianca 的护盾减少 ${shieldDamage} 点${hpDamage > 0 ? `，并受到 ${hpDamage} 点生命伤害` : ""}。`
      : hpDamage > 0 ? `Bianca 受到 ${hpDamage} 点生命伤害。` : "";
    const gainText = selfShieldGain > 0 ? `增加 ${selfShieldGain} 点护盾。` : "";
    setBattleLog(`${enemyLine.speaker}：${enemyLine.tag}。${receivedText}${gainText}`);
    await wait(chapterEightBattleConfig.timing.hit);
    setPlayerHit(false); setCombatTexts([]); setCombatEffect(null); setBattleDialogue(null);
    setSupportCooldowns((current) => ({
      amber: current.amber > 0 && usedSupport !== "amber" ? current.amber - 1 : current.amber,
      venti: current.venti > 0 && usedSupport !== "venti" ? current.venti - 1 : current.venti,
      zhongli: current.zhongli > 0 && usedSupport !== "zhongli" ? current.zhongli - 1 : current.zhongli,
    }));
    setActionLocked(false); setActingSkill(null);
    if (nextHp <= 0) { setFailures((value) => value + 1); setPhase("defeat"); }
  };

  const useAction = async (kind: AbyssAction) => {
    if (isBattlePaused || overlay || phase !== "battle" || actionLocked) return;
    const tutorial = abyssTutorialSteps[tutorialStep];
    if (tutorial && kind !== tutorial.expected) {
      setOverlay({ title: tutorial.guide, lines: [tutorial.wrong] });
      return;
    }
    if (kind === "skill" && skillCooldown > 0) return;
    if (kind === "ultimate" && energy < ENERGY_CONFIG.ultimateCost) return;

    setActionLocked(true); setActingSkill(kind); setDelayed(false); setEnemyDelays([]);
    const activeSupport = supportUnlocked && supportCooldowns[support] === 0 ? support : undefined;
    const livingIds = enemies.filter((enemy) => enemy.hp > 0).map((enemy) => enemy.id);

    if (kind === "normal") {
      const lines = ["先试试这个！", "接招！", "那就从最简单的开始！"];
      setBattleDialogue({ speaker: "Bianca", text: lines[round % lines.length], tag: "普通攻击" });
      setCombatEffect({ key: Date.now(), type: activeSupport === "amber" ? "fire" : activeSupport === "venti" ? "wind" : activeSupport === "zhongli" ? "geo" : "normal", target });
    } else if (kind === "skill") {
      const joke = jokes[round % jokes.length];
      setBattleDialogue({ speaker: "Bianca", text: joke[0], tag: "冷笑话" });
      await wait(chapterEightBattleConfig.timing.dialogueLine);
      setBattleDialogue({ speaker: "Bianca", text: joke[1], tag: "尴尬" });
      setEnemyDelays(livingIds);
    } else {
      setBattleDialogue({ speaker: "Bianca", text: "那个……要不还是算了吧？", tag: "软" });
      setCombatEffect({ key: Date.now(), type: "ultimate-soft", target: "all" });
    }
    await wait(chapterEightBattleConfig.timing.projectile);

    let next = enemies;
    let impactAlreadyPlayed = false;
    const isTutorial = !supportUnlocked;
    const damageMultiplier = isTutorial ? ELEMENT_CONFIG.tutorialDamageMultiplier : 1;
    if (kind === "normal") {
      next = enemies.map((enemy) => {
        if (enemy.id !== target || enemy.hp <= 0) return enemy;
        const shieldDamage = BIANCA_SKILLS.basicAttack.shieldDamage * damageMultiplier * (activeSupport === "amber" && enemy.id === "blue" ? ELEMENT_CONFIG.amber.fireVsIceShieldMultiplier : 1);
        return { ...damageEnemy(enemy, BIANCA_SKILLS.basicAttack.damage * damageMultiplier, shieldDamage), burning: activeSupport === "amber" ? ELEMENT_CONFIG.burn.duration : enemy.burning };
      });
      setEnergy((value) => Math.min(ENERGY_CONFIG.maxEnergy, value + ENERGY_CONFIG.basicAttackGain));
    } else if (kind === "skill") {
      next = enemies.map((enemy) => enemy.hp > 0 ? {
        ...damageEnemy(enemy, BIANCA_SKILLS.coldJoke.damage * damageMultiplier, BIANCA_SKILLS.coldJoke.shieldDamage * damageMultiplier * (activeSupport === "amber" && enemy.id === "blue" ? ELEMENT_CONFIG.amber.fireVsIceShieldMultiplier : 1)),
        embarrassed: true,
      } : enemy);
      setEnergy((value) => Math.min(ENERGY_CONFIG.maxEnergy, value + (isTutorial ? ENERGY_CONFIG.maxEnergy : ENERGY_CONFIG.coldJokeGain))); setSkillCooldown(BIANCA_SKILLS.coldJoke.cooldown);
    } else {
      const applyUltimateStage = (before: Enemy[], hpDamage: number, shieldDamage: number) => before.map((enemy) => {
        if (enemy.hp <= 0) return enemy;
        const fireMultiplier = activeSupport === "amber" && enemy.id === "blue" ? ELEMENT_CONFIG.amber.fireVsIceShieldMultiplier : 1;
        return damageEnemy(enemy, hpDamage * damageMultiplier, shieldDamage * damageMultiplier * fireMultiplier);
      });

      const afterSoftOne = applyUltimateStage(enemies, BIANCA_SKILLS.softHardSoft.softHit1Damage, BIANCA_SKILLS.softHardSoft.softHit1ShieldDamage);
      await playEnemyImpact(enemies, afterSoftOne, livingIds, "ultimate-soft", true);

      setBattleDialogue({ speaker: "Bianca", text: "不行。", tag: "硬" });
      setCombatEffect({ key: Date.now(), type: "ultimate-hard", target: "all" });
      await wait(chapterEightBattleConfig.timing.projectile);
      const afterHard = applyUltimateStage(afterSoftOne, BIANCA_SKILLS.softHardSoft.hardHitDamage, BIANCA_SKILLS.softHardSoft.hardHitShieldDamage);
      await playEnemyImpact(afterSoftOne, afterHard, livingIds, "ultimate-hard", true);

      setBattleDialogue({ speaker: "Bianca", text: "谢谢理解。", tag: "软" });
      setCombatEffect({ key: Date.now(), type: "ultimate-soft", target: "all" });
      await wait(chapterEightBattleConfig.timing.projectile);
      next = applyUltimateStage(afterHard, BIANCA_SKILLS.softHardSoft.softHit2Damage, BIANCA_SKILLS.softHardSoft.softHit2ShieldDamage);
      await playEnemyImpact(afterHard, next, livingIds, "ultimate-soft", true);
      impactAlreadyPlayed = true;
      setEnergy(0);
    }

    if (activeSupport === "amber") {
      next = next.map((enemy) => (kind !== "normal" || enemy.id === target) && enemy.hp > 0
        ? { ...enemy, burning: chapterEightBattleConfig.burnDuration }
        : enemy);
    }

    if (activeSupport === "venti") {
      const selectedSourceIndex = enemies.findIndex((enemy) => enemy.id === target && enemy.burning > 0 && enemy.hp > 0);
      const sourceIndex = selectedSourceIndex >= 0 ? selectedSourceIndex : enemies.findIndex((enemy) => enemy.burning > 0 && enemy.hp > 0);
      const adjacentIndexes = sourceIndex === 0 ? [1] : sourceIndex === 2 ? [1] : sourceIndex === 1 ? [0, 2] : [];
      const validAdjacentIndexes = adjacentIndexes.filter((index) => enemies[index]?.hp > 0 && enemies[index].burning === 0);
      const spreadIndex = validAdjacentIndexes.length > 0
        ? validAdjacentIndexes[Math.floor(Math.random() * validAdjacentIndexes.length)]
        : undefined;
      next = next.map((enemy, index) => index === spreadIndex
        ? { ...enemy, burning: ELEMENT_CONFIG.burn.duration, hp: Math.max(0, enemy.hp - ELEMENT_CONFIG.venti.spreadDamage) }
        : enemy);
      setEnemyDelays((ids) => Array.from(new Set([...ids, target])));
      if (spreadIndex !== undefined) setBattleDialogue({ speaker: "状态", text: `风把火星卷向了相邻的${next[spreadIndex].name}。`, tag: "扩散" });
    }
    if (activeSupport === "zhongli") {
      setGeoShield((value) => value + chapterEightBattleConfig.geoShieldAmount);
    }
    if (activeSupport) setSupportCooldowns((current) => ({ ...current, [activeSupport]: supportCooldownLength[activeSupport] }));

    if (!impactAlreadyPlayed) {
      await playEnemyImpact(enemies, next, kind === "normal" ? [target] : livingIds, kind === "normal" ? (activeSupport === "amber" ? "fire" : activeSupport === "venti" ? "wind" : "normal") : "cold", kind !== "normal");
    }

    if (activeSupport === "zhongli") {
      setCombatEffect({ key: Date.now(), type: "geo", target: "bianca" });
      setCombatTexts([{ id: `${Date.now()}-geo`, target: "bianca", value: chapterEightBattleConfig.geoShieldAmount, kind: "shieldGain" }]);
      await wait(chapterEightBattleConfig.timing.hit);
      setCombatTexts([]); setCombatEffect(null);
    }

    setBattleDialogue(null); setCombatEffect(null); setActingSkill(null);

    if (tutorial) {
      setTutorialStep((value) => value + 1);
      if (tutorialStep === 2) { setPhase("preRitual"); setLineIndex(0); setActionLocked(false); return; }
    }

    const nextRound = round + 1;
    setRound(nextRound); setSkillCooldown((value) => kind === "skill" ? value : Math.max(0, value - 1));
    const shieldAfterPlayer = activeSupport === "zhongli" ? geoShield + ELEMENT_CONFIG.zhongli.shieldAmount : geoShield;
    await runEnemyTurn(next, nextRound, activeSupport, shieldAfterPlayer);
  };

  const isStoryPhase = ["story", "victory"].includes(phase);

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

    {(["battleIntro", "preRitual", "ritual", "ritualAfter", "battle", "battleWon", "fakeVictory", "defeat"] as Phase[]).includes(phase) && <div className={`battle-eight-card ${isCombatGuideOpen ? "combat-guide-paused" : ""}`}>
      <img className="battle-eight-bg" src={asset("BattleBg1.png")} alt="回合制战斗场地" />
      <div className={`battle-order ${delayed || enemyDelays.length ? "is-delayed" : ""}`}><b>行动顺序</b>{actionOrder.map((entry, index) => <div className={`order-avatar ${index === 0 ? "active" : ""} ${enemyDelays.includes(entry.id as EnemyId) ? "enemy-delayed" : ""}`} key={entry.id}><img src={asset(entry.image)} alt={entry.label} onError={(event) => { event.currentTarget.hidden = true; }} /><span>{entry.label}</span></div>)}</div>
      <div className="battle-enemies">{enemies.map((enemy) => <button key={enemy.id} className={`battle-enemy enemy-${enemy.id} ${target === enemy.id ? "selected" : ""} ${enemy.hp <= 0 ? "defeated" : ""} ${hitEnemies.includes(enemy.id) ? "is-hit" : ""} ${breakEnemies.includes(enemy.id) ? "shield-break" : ""} ${enemy.burning ? "is-burning" : ""} ${enemy.embarrassed ? "is-embarrassed" : ""}`} onClick={() => setTarget(enemy.id)} disabled={enemy.hp <= 0 || actionLocked}><div className="enemy-bars"><b>{enemy.name}</b><i><em style={{ width: `${enemy.hp / enemy.maxHp * 100}%` }} /></i><i className="shield"><em style={{ width: `${enemy.shield / enemy.maxShield * 100}%` }} /></i></div><img src={asset(enemy.image)} alt={enemy.name} />{enemy.embarrassed && <span className="embarrassed-mark">……</span>}{enemy.burning > 0 && <span className="burn-particles"><i /><i /><i /></span>}{breakEnemies.includes(enemy.id) && <span className="break-label">破盾！</span>}</button>)}</div>
      {debugMode && phase === "battle" && <div className="abyss-debug-grid">{enemies.map((enemy) => <div key={enemy.id}><button onClick={() => setEnemies((current) => current.map((item) => item.id === enemy.id ? { ...item, hp: Math.max(0, item.hp - 10) } : item))}>血量 -10</button><button onClick={() => setEnemies((current) => current.map((item) => item.id === enemy.id ? { ...item, shield: Math.max(0, item.shield - 10) } : item))}>护盾 -10</button></div>)}</div>}
      <div className="battle-mystery" title="神秘物品">?</div>
      <div className={`bianca-battle ${playerHit ? "is-hit" : ""} ${geoShield > 0 ? "has-geo-shield" : ""}`}><img src={asset(actingSkill ? "BiancaBattle2.png" : "BiancaBattle1.png")} alt="战斗中的 Bianca" /><div><b>Bianca</b><i><em style={{ width: `${hp / BIANCA_STATS.maxHp * 100}%` }} /></i>{geoShield > 0 && <i className="bianca-shield"><em style={{ width: `${Math.min(100, geoShield / ELEMENT_CONFIG.zhongli.shieldAmount * 100)}%` }} /></i>}<small>HP {hp}/{BIANCA_STATS.maxHp}　护盾 {geoShield}　能量 {energy}/{ENERGY_CONFIG.maxEnergy}</small></div></div>
      {(supportUnlocked || phase === "ritualAfter") && <div className={`support-panel ${phase === "ritualAfter" ? "is-unlocking" : ""}`}><b>场外支援</b>{(["amber", "venti", "zhongli"] as Support[]).map((item) => { const unlockedNow = phase !== "ritualAfter" || (item === "amber" ? lineIndex >= 1 : item === "venti" ? lineIndex >= 2 : lineIndex >= 4); return <button key={item} className={`${support === item ? "active" : ""} ${supportCooldowns[item] ? "cooling" : ""} ${unlockedNow ? "support-lit" : "support-dormant"}`} onClick={() => setSupport(item)} disabled={!supportUnlocked || supportCooldowns[item] > 0 || actionLocked}>{item === "amber" ? "安柏·火" : item === "venti" ? "温迪·风" : "钟离·岩"}<small>{supportCooldowns[item] ? supportCooldowns[item] : "Ready"}</small></button>; })}</div>}
      {phase === "battle" && !battleDialogue && <div className="battle-status-toast tutorial-toast">{abyssTutorialSteps[tutorialStep] ? <><b>{abyssTutorialSteps[tutorialStep].guide}：</b>{abyssTutorialSteps[tutorialStep].lines.join(" ")}</> : battleLog}</div>}
      <div className="battle-skills"><button className={phase === "battle" && abyssTutorialSteps[tutorialStep]?.expected === "normal" ? "tutorial-highlight" : ""} onClick={() => useAction("normal")} disabled={phase !== "battle" || actionLocked}>普通攻击<small>单体</small></button><button className={phase === "battle" && abyssTutorialSteps[tutorialStep]?.expected === "skill" ? "tutorial-highlight" : ""} onClick={() => useAction("skill")} disabled={phase !== "battle" || actionLocked || skillCooldown > 0}>冷笑话<small>{skillCooldown ? "冷却中" : "群体"}</small></button><button className={`ultimate ${energy >= ENERGY_CONFIG.ultimateCost ? "is-ready" : ""} ${phase === "battle" && abyssTutorialSteps[tutorialStep]?.expected === "ultimate" ? "tutorial-highlight" : ""}`} onClick={() => useAction("ultimate")} disabled={phase !== "battle" || actionLocked || energy < ENERGY_CONFIG.ultimateCost}>软硬软拒绝<small>{energy}/{ENERGY_CONFIG.maxEnergy}</small></button></div>
      <BattleEffectLayer effect={combatEffect} />
      <FloatingCombatText items={combatTexts} />
      {battleDialogue && <BattleShout {...battleDialogue} />}
      <CombatGuide entries={abyssCombatGuideEntries} open={isCombatGuideOpen} onOpenChange={setIsCombatGuideOpen} currentStats={{ bianca: `HP ${hp}/${BIANCA_STATS.maxHp} · 护盾 ${geoShield}`, ...Object.fromEntries(enemies.map((enemy) => [enemy.id, `HP ${enemy.hp}/${enemy.maxHp} · 护盾 ${enemy.shield}/${enemy.maxShield}`])) }} />
      {(phase === "battleIntro" || phase === "preRitual" || phase === "ritualAfter") && <div className={`battle-dialogue-overlay ${currentLine.speaker === "作者大大" ? "author-note" : ""}`}><div><span className={`dialogue-speaker speaker-${currentLine.speaker}`}>{currentLine.speaker}</span><p>{currentLine.text}</p><button className="dialogue-next" onClick={advanceStory}>继续</button></div></div>}
      {phase === "ritual" && <div className="battle-dialogue-overlay author-note"><div><span className="dialogue-speaker">作者大大</span><p>现实中的 Bianca，请认真念出：</p><blockquote>“以疯狂星期四的名义，<br />请赐予我打败深渊法师的力量！”</blockquote><button className="dialogue-next" onClick={() => { setSupportUnlocked(true); setLineIndex(0); setPhase("ritualAfter"); }}>我念完了</button></div></div>}
      {overlay && phase === "battle" && <div className="battle-overlay"><div><h3>{overlay.title}</h3>{overlay.lines.map((text, index) => <p key={index}>{text}</p>)}<button className="dialogue-next" onClick={() => setOverlay(null)}>继续战斗</button></div></div>}
      {phase === "battleWon" && <div className="battle-overlay"><div><h3>战斗胜利</h3><p>三只深渊法师的护盾终于全部熄灭了。</p><button className="dialogue-next" onClick={() => { setOverlay(null); setLineIndex(0); setPhase("victory"); }}>查看神秘物品</button></div></div>}
      {phase === "fakeVictory" && <div className="battle-overlay fake-victory"><div><h3>Battle Complete</h3><p>深渊法师已被击败。</p><p><b>Bianca：</b>终于……</p><p><b>安柏：</b>做得很好！</p><p><b>温迪：</b>看来结束了呢～</p></div></div>}
      {phase === "defeat" && <div className="battle-overlay"><div><h3>战斗失败</h3><p><b>Bianca：</b>……三打一是不是有点过分了？</p><p className="author-copy"><b>作者大大：</b>要不再来一次？</p>{tipVisible && <p className="battle-tip">小提示：先用对应支援击破护盾；能量满后立刻使用终结技。</p>}<div className="defeat-actions"><button className="dialogue-next" onClick={resetBattle}>重新挑战</button><button onClick={() => setTipVisible(true)}>查看小提示</button></div></div></div>}
    </div>}

    {phase === "unswBoss" && <UnswBattle key={debugAction?.type === "skipPhase1" ? debugAction.key : "unsw-battle"} paused={paused} debugMode={debugMode} startAtPhase2={debugAction?.type === "skipPhase1"} onVictory={() => { setLineIndex(0); setPhase("victory"); }} />}

    {phase === "complete" && <div className="chapter-eight-completion"><div className="checkin-complete">✓ 第八章完成</div><div className="mystery-item-icon">???</div><p>B老师终于找到了那个不属于提瓦特的东西。</p><small>至于它到底是什么……似乎还不到揭晓的时候。</small><button className="dialogue-next return-airport" onClick={onComplete}>返回旅程</button></div>}
  </section>;
}
