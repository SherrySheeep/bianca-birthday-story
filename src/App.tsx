import { useCallback, useEffect, useState } from 'react';
import { ProgressBadge } from './components/UI';
import { Airport, ChinaFun, Cover, FinalCard, FlightBooking, Flying, Jokes, Memories, Messages, Packing, Room } from './sections/StorySections';

const TOTAL=10;
export default function App(){
  const [chapter,setChapter]=useState(()=>Math.min(Number(localStorage.getItem('bianca-progress')||0),TOTAL));
  useEffect(()=>localStorage.setItem('bianca-progress',String(chapter)),[chapter]);
  const advance=useCallback(()=>setChapter(c=>Math.min(c+1,TOTAL)),[]);
  const goBack=useCallback(()=>setChapter(c=>Math.max(c-1,0)),[]);
  return <main>
    {chapter>0&&<><button className="chapter-back" onClick={goBack}>回到过去</button><ProgressBadge current={chapter} total={TOTAL}/><button className="restart" onClick={()=>setChapter(0)}>从头再来</button></>}
    {chapter===0&&<Cover onDone={advance}/>} {chapter===1&&<Room onDone={advance}/>} {chapter===2&&<FlightBooking onDone={advance}/>} {chapter===3&&<Packing onDone={advance}/>} {chapter===4&&<Airport onDone={advance}/>} {chapter===5&&<Flying onDone={advance}/>} {chapter===6&&<ChinaFun onDone={advance}/>} {chapter===7&&<Memories onDone={advance}/>} {chapter===8&&<Jokes onDone={advance}/>} {chapter===9&&<Messages onDone={advance}/>} {chapter===10&&<FinalCard/>}
  </main>
}
