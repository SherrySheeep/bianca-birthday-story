export type CombatText = {
  id: string;
  target: "bianca" | "blue" | "red" | "purple";
  value: number;
  kind: "hp" | "shield" | "shieldGain";
  delay?: number;
};

export type CombatEffect = {
  key: number;
  type: "normal" | "fire" | "wind" | "geo" | "cold" | "ultimate-soft" | "ultimate-hard" | "paralysis" | "break";
  target?: "bianca" | "blue" | "red" | "purple" | "all";
};

export function FloatingCombatText({ items }: { items: CombatText[] }) {
  return <>{items.map((item) => (
    <strong
      className={`combat-float combat-float-${item.kind} combat-float-${item.target}`}
      style={{ animationDelay: `${item.delay ?? 0}ms` }}
      key={item.id}
    >
      {item.kind === "shieldGain" ? "+" : "-"}{item.value}
    </strong>
  ))}</>;
}

export function BattleEffectLayer({ effect }: { effect: CombatEffect | null }) {
  if (!effect) return null;
  return (
    <div className={`chapter-eight-fx fx-${effect.type} fx-target-${effect.target ?? "all"}`} key={effect.key} aria-hidden="true">
      <i /><i /><i /><i /><i /><i />
    </div>
  );
}

export function BattleShout({ speaker, text, tag }: { speaker: string; text: string; tag?: string }) {
  return (
    <div className="battle-shout" role="status" aria-live="polite">
      <b>{speaker}</b>
      {tag && <em>【{tag}】</em>}
      <p>{text}</p>
    </div>
  );
}
