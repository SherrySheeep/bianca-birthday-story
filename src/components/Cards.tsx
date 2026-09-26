import { content } from '../data/content';

export function BoardingPassCard(){ const t=content.trip; return <article className="boarding-pass"><div className="pass-main"><span className="micro">Boarding Pass · ECONOMY</span><strong>{t.fromCode} <i>✈</i> {t.toCode}</strong><div className="pass-grid"><span>乘客<b>{t.passenger}</b></span><span>航班<b>{t.flight}</b></span><span>日期<b>{t.departure}</b></span></div></div><div className="pass-stub"><span>登机口</span><b>20</b><small>一路顺风</small></div></article> }

export function PolaroidCard({item,index}:{item:{label:string;title:string;caption:string;color:string};index:number}) { return <article className={`polaroid ${item.color}`} style={{transform:`rotate(${index%2 ? 2.5 : -2.5}deg)`}}><div className="photo-placeholder"><span>✦</span><b>照片待放入</b><small>PHOTO {item.label}</small></div><h3>{item.title}</h3><p>{item.caption}</p></article> }

export function MessageCard({name,message,index}:{name:string;message:string;index:number}) { return <article className={`message-card note-${index%3}`}><span className="mini-stamp">{index%2?'AIR MAIL':'WITH LOVE'}</span><p>“{message}”</p><footer>— {name}</footer></article> }
