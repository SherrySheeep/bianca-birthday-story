import { useCallback, useEffect, useState } from 'react';
import { ProgressBadge } from './components/UI';
import { ChapterSixStory } from './components/ChapterSixStory';
import { ChapterSevenStory } from './components/ChapterSevenStory';
import { ChapterEightStory } from './components/ChapterEightStory';
import { ChapterNineStory } from './components/ChapterNineStory';
import { ChapterTenStory } from './components/ChapterTenStory';
import { ChapterElevenGallery } from './components/ChapterElevenGallery';
import { LoadingScreen } from './components/LoadingScreen';
import { Airport, Cover, FinalCard, FlightBooking, Flying, Jokes, Memories, Messages, Packing, Room } from './sections/StorySections';

const TOTAL=15;
type ChapterEightDebugAction = { type: 'enterBattle' | 'skipTutorial' | 'skipMobs' | 'skipPhase1' | 'skipPhase2'; key: number } | null;
type ChapterSixDebugAction = { type: 'enterExam' | 'skipExam'; key: number } | null;
type ChapterNineDebugAction = { type: 'startExplore'; key: number } | null;
export default function App(){
  const [preloadComplete,setPreloadComplete]=useState(false);
  const [chapter,setChapter]=useState(0);
  const [debugMode,setDebugMode]=useState(()=>new URLSearchParams(window.location.search).get('debug')==='1'||new URLSearchParams(window.location.search).get('debugSecurity')==='1');
  const [paused,setPaused]=useState(false);
  const [chapterEightDebugAction,setChapterEightDebugAction]=useState<ChapterEightDebugAction>(null);
  const [chapterSixDebugAction,setChapterSixDebugAction]=useState<ChapterSixDebugAction>(null);
  const [chapterNineDebugAction,setChapterNineDebugAction]=useState<ChapterNineDebugAction>(null);
  useEffect(()=>{setChapterEightDebugAction(null);setChapterSixDebugAction(null);setChapterNineDebugAction(null);},[chapter]);
  useEffect(()=>{
    const url=new URL(window.location.href);
    if(debugMode) url.searchParams.set('debug','1'); else {url.searchParams.delete('debug');url.searchParams.delete('debugSecurity');}
    window.history.replaceState({},'',url);
    if(!debugMode)setPaused(false);
  },[debugMode]);
  const advance=useCallback(()=>setChapter(c=>Math.min(c+1,TOTAL)),[]);
  const goBack=useCallback(()=>setChapter(c=>Math.max(c-1,0)),[]);
  if(!preloadComplete)return <LoadingScreen onStart={()=>setPreloadComplete(true)}/>;
  return <main className={paused?'debug-paused':''}>
    <button
      className={`debug-toggle ${debugMode?'active':''}`}
      onClick={()=>setDebugMode(value=>!value)}
      aria-label={debugMode?'退出 debugger，返回正式模式':'进入 debugger 模式'}
      title={debugMode?'返回正式模式':'进入 debugger 模式'}
    >
      <img src={`${import.meta.env.BASE_URL}ui/debugger.png`} alt="" />
    </button>
    {debugMode&&<div className="debug-controls">{chapter===6&&<><button onClick={()=>setChapterSixDebugAction({type:'enterExam',key:Date.now()})}>直接进入飞行考试</button><button onClick={()=>setChapterSixDebugAction({type:'skipExam',key:Date.now()})}>跳过飞行考试</button></>}{chapter===8&&<button onClick={()=>setChapterEightDebugAction({type:'enterBattle',key:Date.now()})}>进入战斗</button>}{chapter===9&&<button onClick={()=>setChapterNineDebugAction({type:'startExplore',key:Date.now()})}>开始探索</button>}<button onClick={()=>setPaused(value=>!value)}>{paused?'继续':'暂停'}</button><button onClick={advance}>下一章</button></div>}
    {debugMode&&chapter===8&&<div className="chapter-eight-debug-jumps"><button onClick={()=>setChapterEightDebugAction({type:'skipTutorial',key:Date.now()})}>跳过教程</button><button onClick={()=>setChapterEightDebugAction({type:'skipMobs',key:Date.now()})}>跳过小怪</button><button onClick={()=>setChapterEightDebugAction({type:'skipPhase1',key:Date.now()})}>跳过 Phase 1</button><button onClick={()=>setChapterEightDebugAction({type:'skipPhase2',key:Date.now()})}>跳过 Phase 2</button></div>}
    {chapter>0&&<><button className="chapter-back" onClick={goBack}>回到过去</button><ProgressBadge current={chapter} total={TOTAL}/><button className="restart" onClick={()=>setChapter(0)}>从头再来</button></>}
    {chapter===0&&<Cover onDone={advance}/>} {chapter===1&&<Room onDone={advance}/>} {chapter===2&&<FlightBooking onDone={advance}/>} {chapter===3&&<Packing onDone={advance}/>} {chapter===4&&<Airport onDone={advance} debugMode={debugMode} paused={paused}/>} {chapter===5&&<Flying onDone={advance} paused={paused}/>} {chapter===6&&<ChapterSixStory onComplete={advance} paused={paused} debugAction={chapterSixDebugAction}/>} {chapter===7&&<ChapterSevenStory onComplete={advance} paused={paused}/>} {chapter===8&&<ChapterEightStory onComplete={advance} paused={paused} debugMode={debugMode} debugAction={chapterEightDebugAction}/>} {chapter===9&&<ChapterNineStory onComplete={advance} paused={paused} debugAction={chapterNineDebugAction}/>} {chapter===10&&<ChapterTenStory onComplete={advance} paused={paused}/>} {chapter===11&&<ChapterElevenGallery onComplete={advance}/>} {chapter===12&&<Memories onDone={advance}/>} {chapter===13&&<Jokes onDone={advance}/>} {chapter===14&&<Messages onDone={advance}/>} {chapter===15&&<FinalCard/>}
  </main>
}
