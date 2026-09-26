import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function StickerButton({children, className='', ...props}: ButtonHTMLAttributes<HTMLButtonElement> & {children:ReactNode}) {
  return <button className={`sticker-button ${className}`} {...props}>{children}</button>;
}

export function SectionHeader({number, kicker, title, children}:{number:string;kicker:string;title:string;children?:ReactNode}) {
  return <header className="section-header"><span className="chapter-number">{number}</span><div><p>{kicker}</p><h2>{title}</h2>{children}</div></header>;
}

export function ProgressBadge({current,total}:{current:number;total:number}) {
  return <div className="progress-badge" aria-label={`故事进度 ${current}/${total}`}><span>旅程进度</span><b>{String(current).padStart(2,'0')} / {String(total).padStart(2,'0')}</b><i style={{width:`${current/total*100}%`}} /></div>;
}

export function PopupNote({children, onClose}:{children:ReactNode;onClose:()=>void}) {
  return <div className="popup-backdrop" onClick={onClose}><div className="popup-note" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}><span className="tape"/><div className="popup-star">✦</div>{children}<StickerButton onClick={onClose}>收到啦</StickerButton></div></div>;
}

export function ContinueButton({onClick,label='继续往下 ↓'}:{onClick:()=>void;label?:string}) {
  return <StickerButton className="continue" onClick={onClick}>{label}</StickerButton>;
}
