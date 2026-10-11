export const chapterEightBattleConfig = {
  timing: {
    dialogueLead: 260,
    projectile: 280,
    hit: 430,
    aoeStagger: 90,
    actionRecover: 340,
    dialogueLine: 680,
  },
  burnDuration: 2,
  burnDamage: 8,
  amberCooldown: 2,
  ventiCooldown: 2,
  zhongliCooldown: 3,
  geoShieldAmount: 80,
  geoShieldParalysisCost: 12,
  fireVsIceShieldMultiplier: 2,
  swirlDamage: 7,
  coldJokeDelayAmount: 1,
  ventiDelayAmount: 1,
} as const;

export type ChapterEightSupport = "amber" | "venti" | "zhongli";

export const supportCooldownLength: Record<ChapterEightSupport, number> = {
  amber: chapterEightBattleConfig.amberCooldown,
  venti: chapterEightBattleConfig.ventiCooldown,
  zhongli: chapterEightBattleConfig.zhongliCooldown,
};
