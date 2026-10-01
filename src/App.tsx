import { useCallback, useEffect, useState } from 'react';
import { ProgressBadge } from './components/UI';
import { ChapterSixStory } from './components/ChapterSixStory';
import { ChapterSevenStory } from './components/ChapterSevenStory';
import { Airport, ChinaFun, Cover, FinalCard, FlightBooking, Flying, Jokes, Memories, Messages, Packing, Room } from './sections/StorySections';

const TOTAL=12;
export default function App(){
  const [chapter,setChapter]=useState(()=>Math.min(Number(localStorage.getItem('bianca-progress')||0),TOTAL));
  const [debugMode,setDebugMode]=useState(()=>new URLSearchParams(window.location.search).get('debug')==='1'||new URLSearchParams(window.location.search).get('debugSecurity')==='1');
  const [paused,setPaused]=useState(false);
  useEffect(()=>localStorage.setItem('bianca-progress',String(chapter)),[chapter]);
  useEffect(()=>{
    const url=new URL(window.location.href);
    if(debugMode) url.searchParams.set('debug','1'); else {url.searchParams.delete('debug');url.searchParams.delete('debugSecurity');}
    window.history.replaceState({},'',url);
    if(!debugMode)setPaused(false);
  },[debugMode]);
  const advance=useCallback(()=>setChapter(c=>Math.min(c+1,TOTAL)),[]);
  const goBack=useCallback(()=>setChapter(c=>Math.max(c-1,0)),[]);
  return <main className={paused?'debug-paused':''}>
    <button
      className={`debug-toggle ${debugMode?'active':''}`}
      onClick={()=>setDebugMode(value=>!value)}
      aria-label={debugMode?'退出 debugger，返回正式模式':'进入 debugger 模式'}
      title={debugMode?'返回正式模式':'进入 debugger 模式'}
    >
      <img src={`${import.meta.env.BASE_URL}ui/debugger.png`} alt="" />
    </button>
    {debugMode&&<div className="debug-controls"><button onClick={()=>setPaused(value=>!value)}>{paused?'继续':'暂停'}</button><button onClick={advance}>下一章</button></div>}
    {chapter>0&&<><button className="chapter-back" onClick={goBack}>回到过去</button><ProgressBadge current={chapter} total={TOTAL}/><button className="restart" onClick={()=>setChapter(0)}>从头再来</button></>}
    {chapter===0&&<Cover onDone={advance}/>} {chapter===1&&<Room onDone={advance}/>} {chapter===2&&<FlightBooking onDone={advance}/>} {chapter===3&&<Packing onDone={advance}/>} {chapter===4&&<Airport onDone={advance} debugMode={debugMode} paused={paused}/>} {chapter===5&&<Flying onDone={advance} paused={paused}/>} {chapter===6&&<ChapterSixStory onComplete={advance} paused={paused}/>} {chapter===7&&<ChapterSevenStory onComplete={advance} paused={paused}/>} {chapter===8&&<ChinaFun onDone={advance}/>} {chapter===9&&<Memories onDone={advance}/>} {chapter===10&&<Jokes onDone={advance}/>} {chapter===11&&<Messages onDone={advance}/>} {chapter===12&&<FinalCard/>}
  </main>
}
