import { useEffect, useState } from "react";
import type { CombatGuideEntry } from "../data/chapterEightCombatGuide";

type Props = {
  entries: CombatGuideEntry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStats?: Record<string, string>;
};

const guideIcon = `${import.meta.env.BASE_URL}chapter-eight/combat-guide/GuideIcon.png`;

export function CombatGuide({ entries, open, onOpenChange, currentStats = {} }: Props) {
  const [selectedId, setSelectedId] = useState(entries[0]?.id ?? "");
  const selected = entries.find((entry) => entry.id === selectedId) ?? entries[0];

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onOpenChange]);

  return <>
    <button className="combat-guide-trigger" type="button" onClick={() => onOpenChange(true)} title="查看战斗信息" aria-label="打开战斗手册">
      <img src={guideIcon} alt="" onError={(event) => { event.currentTarget.hidden = true; }} />
      <span>战斗手册</span>
    </button>
    {open && selected && <div className="combat-guide-backdrop" role="presentation">
      <section className="combat-guide-book" role="dialog" aria-modal="true" aria-label="战斗手册">
        <header><div><small>COMBAT GUIDE</small><h2>战斗手册</h2></div><button type="button" onClick={() => onOpenChange(false)} aria-label="关闭战斗手册">×</button></header>
        <div className="combat-guide-layout">
          <nav className="combat-guide-tabs" aria-label="选择角色">
            {entries.map((entry) => <button type="button" key={entry.id} className={entry.id === selected.id ? "active" : ""} onClick={() => setSelectedId(entry.id)} title={entry.name} aria-label={entry.name}>
              <img src={entry.icon} alt={entry.name} onError={(event) => { event.currentTarget.hidden = true; }} />
              <span>{entry.name}</span>
            </button>)}
          </nav>
          <article className="combat-guide-page">
            <div className="combat-guide-title"><div><h3>{selected.name}</h3>{selected.subtitle && <p>{selected.subtitle}</p>}</div>{currentStats[selected.id] && <strong>{currentStats[selected.id]}</strong>}</div>
            <div className="combat-guide-table"><div className="combat-guide-table-head"><b>技能</b><b>用途</b></div>{selected.skills.map((skill) => <div className="combat-guide-row" key={skill.name}><h4>{skill.name}</h4><div><p>{skill.description}</p>{skill.stats && <dl>{skill.stats.map((stat) => <div className={stat.tone ? `combat-guide-stat-${stat.tone}` : ""} key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>}</div></div>)}</div>
            {selected.note && <aside className="combat-guide-note">✦ {selected.note}</aside>}
          </article>
        </div>
      </section>
    </div>}
  </>;
}
