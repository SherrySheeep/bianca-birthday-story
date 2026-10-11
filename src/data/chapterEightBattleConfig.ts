// Chapter 8 的战斗平衡统一放在这里。修改后重新 build / 部署即可。
export const BIANCA_STATS = {
  // 深渊法师战最大 HP、初始护盾，以及 UNSW Boss 战最大 HP。
  maxHp: 180,
  startingShield: 0,
  unswMaxHp: 230,
} as const;

export const BIANCA_SKILLS = {
  basicAttack: { damage: 20, shieldDamage: 18 },
  coldJoke: {
    damage: 22,
    shieldDamage: 19,
    actionDelay: 1,
    cooldown: 1,
  },
  softHardSoft: {
    // 三段伤害可分别修改。
    softHit1Damage: 20,
    hardHitDamage: 25,
    softHit2Damage: 20,
    shieldDamage: 18,
    actionDelay: 1,
  },
} as const;

export const ABYSS_MAGE_STATS = {
  blue: { maxHp: 100, maxShield: 70 },
  red: { maxHp: 120, maxShield: 55 },
  purple: { maxHp: 105, maxShield: 60 },
} as const;

export const ABYSS_MAGE_SKILLS = {
  blue: {
    iceShard: { damage: 8 },
    frostShield: { shieldGain: 18 },
  },
  red: {
    fireball: { damage: 11 },
    flameBurst: { damage: 16 },
  },
  purple: {
    lightningStrike: { damage: 7 },
    paralysisInterference: { damage: 7, actionDelaySlots: 1 },
  },
  resonance: { shieldGain: 10 },
} as const;

export const ELEMENT_CONFIG = {
  // 仪式前伤害倍率：0.10 = 正常伤害的 10%。
  tutorialDamageMultiplier: 0.50,
  burn: { duration: 2, damagePerTick: 8 },
  amber: { cooldown: 2, fireVsIceShieldMultiplier: 2 },
  venti: { cooldown: 2, actionDelayAmount: 1, spreadDamage: 7 },
  zhongli: {
    cooldown: 3,
    shieldAmount: 80,
    paralysisShieldCost: 12,
    blocksParalysisDelay: true,
  },
  break: { actionDelayAmount: 1 },
} as const;

export const ENERGY_CONFIG = {
  maxEnergy: 100,
  basicAttackGain: 25,
  coldJokeGain: 30,
  enemyTurnGain: 12,
  ultimateCost: 100,
} as const;

export const DAMAGE_RULES = {
  // 护盾伤害溢出后转化为 HP 伤害的比例；1 = 剩余伤害全部穿透到 HP。
  shieldOverflowToHpRatio: 1,
  // 连续失败两次后的隐形减伤保护。
  retryAssistIncomingDamageMultiplier: 0.82,
} as const;

export const UNSW_STATS = {
  maxHp: 620,
  phase2Threshold: 0.5,
  phase2SpeedMultiplier: 1.18,
} as const;

export const UNSW_SKILLS = {
  assignment: { damage: 28, pressureBonusPerStack: 3 },
  groupwork: { damage: 15, playerDamageMultiplier: 0.7 },
  presentation: { damage: 60, phase2Damage: 72 },
  quiz: { damage: 19 },
  rubric: { damage: 12, energyLoss: 18 },
  finalExam: { damage: 55 },
  courseFee: { damage: 0 },
} as const;

export const UNIVERSITY_SKILLS = {
  xlookup: { damage: 68, energyGain: 22 },
  deadline: { damage: 112, energyGain: 30, selfDamage: 10 },
  extension: { damage: 25, energyGain: 18 },
  groupChat: { damage: 35, energyGain: 20 },
  consideration: { damage: 0, energyGain: 10, heal: 65, cooldown: 3 },
  graduation: { damage: 230, energyCost: 100 },
} as const;

export const BATTLE_TIMING = {
  dialogueLead: 800,
  projectile: 400,
  hit: 650,
  aoeStagger: 100,
  actionRecover: 380,
  // 每句自动 battle dialogue 的停留时间；想加长台词主要改这里。
  dialogueLine: 1600,
} as const;

export type ChapterEightSupport = "amber" | "venti" | "zhongli";

export const supportCooldownLength: Record<ChapterEightSupport, number> = {
  amber: ELEMENT_CONFIG.amber.cooldown,
  venti: ELEMENT_CONFIG.venti.cooldown,
  zhongli: ELEMENT_CONFIG.zhongli.cooldown,
};

// 兼容现有视觉层读取；平衡数值优先从上面的分组配置修改。
export const chapterEightBattleConfig = {
  timing: BATTLE_TIMING,
  burnDuration: ELEMENT_CONFIG.burn.duration,
  burnDamage: ELEMENT_CONFIG.burn.damagePerTick,
  amberCooldown: ELEMENT_CONFIG.amber.cooldown,
  ventiCooldown: ELEMENT_CONFIG.venti.cooldown,
  zhongliCooldown: ELEMENT_CONFIG.zhongli.cooldown,
  geoShieldAmount: ELEMENT_CONFIG.zhongli.shieldAmount,
  geoShieldParalysisCost: ELEMENT_CONFIG.zhongli.paralysisShieldCost,
  fireVsIceShieldMultiplier: ELEMENT_CONFIG.amber.fireVsIceShieldMultiplier,
  swirlDamage: ELEMENT_CONFIG.venti.spreadDamage,
  coldJokeDelayAmount: BIANCA_SKILLS.coldJoke.actionDelay,
  ventiDelayAmount: ELEMENT_CONFIG.venti.actionDelayAmount,
} as const;
