import { useEffect, useState } from "react";
import {
  BatteryCharging,
  Check,
  ChevronRight,
  Gift,
  Laptop,
  Map,
  Plane,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Ticket,
  X,
} from "lucide-react";
import { content } from "../data/content";
import {
  BoardingPassCard,
  MessageCard,
  PolaroidCard,
} from "../components/Cards";
import {
  ContinueButton,
  PopupNote,
  SectionHeader,
  StickerButton,
} from "../components/UI";
import { CheckInDialogue } from "../components/CheckInDialogue";
import { SecurityCheckScene } from "../components/SecurityCheckScene";
import { BoardingScene } from "../components/BoardingScene";
import { ChapterFiveStory } from "../components/ChapterFiveStory";

type Done = () => void;
export function Cover({ onDone }: { onDone: Done }) {
  return (
    <section className="scene cover">
      <div className="cover-copy">
        <span className="stamp">20 OCT · SPECIAL TRIP</span>
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
        <StickerButton onClick={onDone}>
          点这里开始 <ChevronRight size={19} />
        </StickerButton>
      </div>
      <div className="hero-art">
        <span className="scribble">
          一路都是
          <br />
          好风景
        </span>
        <img
          src={`${import.meta.env.BASE_URL}bianca-chibi-v2.png`}
          alt="戴眼镜、拉着行李箱准备出发的Q版 Bianca"
        />
        <span className="hero-sticker">
          B老师
          <br />
          出发啦！
        </span>
      </div>
      <span className="doodle d1">✦</span>
      <span className="doodle d2">♡</span>
    </section>
  );
}

const musicalTitles = [
  "The Phantom of the Opera",
  "Elisabeth",
  "Mozart, l’opéra rock",
  "Hamilton",
  "Mozart!",
  "Rudolf – Affaire Mayerling",
  "The Greatest Showman",
  "Don Juan",
  "SIX",
];
const agents = [
  ["Sage", "休息一下吧，我会守住这里。"],
  ["Jett", "看好了，我比飞机还快！"],
  ["Reyna", "他们的自信，我收下了。"],
  ["Killjoy", "别碰我的小机器人。"],
  ["Omen", "我在阴影里……也在等外卖。"],
  ["Phoenix", "看我把气氛点燃！"],
];

export function Room({ onDone }: { onDone: Done }) {
  const [note, setNote] = useState("");
  const [panel, setPanel] = useState<"map" | "laptop" | "book" | null>(null);
  const [drawer, setDrawer] = useState(0);
  const [lampOn, setLampOn] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [mood, setMood] = useState(false);
  const [computerView, setComputerView] = useState<
    "home" | "musicals" | "valorant" | "unsw"
  >("home");
  const [downloads, setDownloads] = useState<string[]>([]);
  const [memoryFull, setMemoryFull] = useState(false);
  const [agentLine, setAgentLine] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [route, setRoute] = useState(false);
  const [routeWrong, setRouteWrong] = useState(false);
  const found = () =>
    setNote("护照找到啦 ✓\n新西兰护照在手，B老师可以继续国际化了。");
  const planRoute = () => {
    const correct = from === "澳大利亚 · 悉尼" && to === "中国 · 青海";
    setRouteWrong(!correct);
    setRoute(false);
    if (correct) requestAnimationFrame(() => setRoute(true));
  };
  const toggleMusical = (title: string) =>
    setDownloads((current) => {
      if (current.includes(title)) {
        setMemoryFull(false);
        return current.filter((x) => x !== title);
      }
      if (current.length >= 5) {
        setMemoryFull(true);
        return current;
      }
      setMemoryFull(false);
      return [...current, title];
    });
  const boostMood = () => {
    setMood(false);
    requestAnimationFrame(() => setMood(true));
    setTimeout(() => setMood(false), 1100);
  };
  return (
    <section className={`scene paper-scene room ${lampOn ? "lamp-lit" : ""}`}>
      <SectionHeader
        number="01"
        kicker="ROOM CHECK"
        title="任务：找到B老师的护照"
      >
        <p>听说它就在房间里。房间里的贴纸都能点，顺便看看 B老师又在忙什么。</p>
      </SectionHeader>
      <div className="room-view">
        <div className="desk-zone clean-desk">
          <span className="clean-sprite clean-desk-base" />
          <button
            className={`desk-item desk-lamp ${lampOn ? "on" : ""}`}
            aria-label={lampOn ? "关灯" : "开灯"}
            onClick={() => setLampOn((x) => !x)}
          >
            <span className="clean-sprite" />
          </button>
          <button
            className="desk-item desk-books"
            aria-label="查看三本书"
            onClick={() => {
              setBookOpen(false);
              setPanel("book");
            }}
          >
            <span className="clean-sprite" />
          </button>
          <button
            className="desk-item desk-laptop-front"
            aria-label="打开电脑"
            onClick={() => {
              setComputerView("home");
              setPanel("laptop");
            }}
          >
            <span className="clean-sprite" />
          </button>
          <button
            className="desk-item desk-coffee"
            aria-label="喝咖啡"
            onClick={() =>
              setNote("咖啡时间 ☕\n一杯提神醒脑，两杯永不疲劳，三杯长生不老。")
            }
          >
            <span className="clean-sprite" />
          </button>
          <button
            className="desk-item desk-plant"
            aria-label="摸摸绿植"
            onClick={boostMood}
          >
            <span className="clean-sprite" />
          </button>
          {mood && <span className="mood-plus">心情 +1</span>}
          <button
            className="drawer-hit drawer-one"
            aria-label="打开第一个抽屉"
            onClick={() => setDrawer(1)}
          />
          <button
            className="drawer-hit drawer-two"
            aria-label="打开第二个抽屉"
            onClick={() => setDrawer(2)}
          />
          <button
            className="drawer-hit drawer-three"
            aria-label="打开最底下的抽屉"
            onClick={() => setDrawer(3)}
          />
        </div>
        <button
          className="room-object wall-map"
          aria-label="打开地图"
          onClick={() => setPanel("map")}
        >
          <img
            src={`${import.meta.env.BASE_URL}room-items/Worldmap1.png`}
            alt="世界地图贴纸"
            onError={(event) => { event.currentTarget.hidden = true; }}
          />
        </button>
        <button
          className="room-object image-sticker suitcase"
          aria-label="查看行李箱"
          onClick={() => setNote(content.roomWrong.suitcase)}
        >
          <span className="sprite suitcase-sprite" />
        </button>
        <button
          className="room-window opera-sticker"
          aria-label="悉尼歌剧院风景"
          onClick={() => setNote("悉尼歌剧院打卡完成。下一站去哪儿？")}
        >
          <span className="sprite opera-sprite" />
        </button>
      </div>
      {panel === "book" && (
        <div className="popup-backdrop" onClick={() => setPanel(null)}>
          <button
            className={`red-book ${bookOpen ? "open" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setBookOpen(true);
            }}
            aria-label={bookOpen ? "已翻开的小红书" : "翻开红色书"}
          >
            {bookOpen ? (
              <>
                <span className="book-page">
                  <b>小红书</b>
                  <small>你的生活兴趣社区</small>
                </span>
                <span className="book-page doodle-page">
                  ♡　✦
                  <br />
                  发现生活灵感
                </span>
              </>
            ) : (
              <>
                <b>小红书</b>
                <small>点击翻开</small>
              </>
            )}
          </button>
        </div>
      )}
      {panel === "laptop" && (
        <div className="popup-backdrop" onClick={() => setPanel(null)}>
          <div
            className="laptop-modal expanded"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="laptop-top">
              <i />
              <i />
              <i />
              <button
                className="computer-back"
                onClick={() => setComputerView("home")}
              >
                {computerView === "home" ? "" : "← 返回"}
              </button>
              <b>BIANCA 的电脑</b>
              <button onClick={() => setPanel(null)}>×</button>
            </div>
            {computerView === "home" && (
              <div className="desktop-folders">
                {[
                  ["🎭", "音乐剧", "musicals"],
                  ["🎯", "Valorant", "valorant"],
                  ["🎓", "UNSW", "unsw"],
                ].map((x) => (
                  <button
                    key={x[1]}
                    onClick={() => setComputerView(x[2] as typeof computerView)}
                  >
                    <span>{x[0]}</span>
                    <b>{x[1]}</b>
                  </button>
                ))}
              </div>
            )}
            {computerView === "musicals" && (
              <div className="computer-content">
                <h3>选择要下载的音乐剧</h3>
                <p>最多带走五部，硬盘也需要喘口气。</p>
                <div className="musical-list">
                  {musicalTitles.map((x) => (
                    <label key={x}>
                      <input
                        type="checkbox"
                        checked={downloads.includes(x)}
                        onChange={() => toggleMusical(x)}
                      />
                      <span>{x}</span>
                    </label>
                  ))}
                </div>
                {memoryFull && (
                  <div className="memory-alert">啊哦，内存爆炸啦！</div>
                )}
              </div>
            )}
            {computerView === "valorant" && (
              <div className="computer-content">
                <h3>今天选谁出场？</h3>
                <div className="agent-grid">
                  {agents.map((x, i) => (
                    <button
                      key={x[0]}
                      onClick={() => setAgentLine(`${x[0]}：${x[1]}`)}
                    >
                      <span className={`agent-sprite agent-${i}`} />
                      <b>{x[0]}</b>
                    </button>
                  ))}
                </div>
                {agentLine && <div className="agent-quote">{agentLine}</div>}
              </div>
            )}
            {computerView === "unsw" && (
              <div className="computer-content unsw-view">
              <img
                src={`${import.meta.env.BASE_URL}unsw-meme-chibi.png`}
                alt="抓着栏杆的慌张Q版小熊"
              />
                <h3>关掉！关掉！快把它关掉！</h3>
              </div>
            )}
            <div className="dock">◉　♫　✉　⌁</div>
          </div>
        </div>
      )}
      {panel === "map" && (
        <div className="popup-backdrop" onClick={() => setPanel(null)}>
          <div
            className="route-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="map-close" onClick={() => setPanel(null)}>
              ×
            </button>
            <span className="tape" />
            <h3>下一站去哪里？</h3>
            <p>选好两地，看看 B老师这次怎么飞。</p>
            <div className="route-selects">
              <label>
                出发地
                <select
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setRoute(false);
                    setRouteWrong(false);
                  }}
                >
                  <option value="">请选择</option>
                  <option>澳大利亚 · 悉尼</option>
                  <option>新西兰 · 奥克兰</option>
                </select>
              </label>
              <label>
                目的地
                <select
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    setRoute(false);
                    setRouteWrong(false);
                  }}
                >
                  <option value="">请选择</option>
                  <option>中国 · 青海</option>
                  <option>中国 · 上海</option>
                </select>
              </label>
            </div>
            <div className="geo-map">
              <span className="map-label syd-label">悉尼</span>
              <span className="map-label qh-label">青海</span>
              {route && (
                <>
                  <div className="dashed-route" />
                  <Plane className="route-plane go" />
                </>
              )}
            </div>
            <StickerButton disabled={!from || !to} onClick={planRoute}>
              就决定是这条路线了！
            </StickerButton>
            {routeWrong && <div className="route-wrong">Hmm...再想想？</div>}
            {route && <div className="route-success">路线研究完毕！ ✈</div>}
          </div>
        </div>
      )}
      {drawer > 0 && (
        <div className="popup-backdrop" onClick={() => setDrawer(0)}>
          <div
            className="drawer-popup"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="tape" />
            {drawer === 1 && (
              <>
                <h3>第一个抽屉：快乐收藏夹</h3>
                <div className="drawer-collectibles">
                  <span className="desk-sheet prx-photo" />
                  <span className="desk-sheet hamilton-poster" />
                </div>
                <p>PRX 全员合照和《Hamilton》海报，都好好收藏着。</p>
              </>
            )}
            {drawer === 2 && (
              <>
                <h3>第二个抽屉：秘密教材</h3>
                <span className="desk-sheet flower-book" />
                <p>《小花花养成指南》：第一章，记得浇水；第二章，别浇太多。</p>
              </>
            )}
            {drawer === 3 && (
              <>
                <h3>最底下的抽屉</h3>
                <button className="found-passport" onClick={found}>
                  <span>NEW ZEALAND</span>
                  <b>
                    PASSPORT
                    <br />
                    Uruwhenua
                  </b>
                  <i>♘</i>
                </button>
                <p>原来藏在这里！点击护照把它收好。</p>
              </>
            )}
            <StickerButton onClick={() => setDrawer(0)}>关上抽屉</StickerButton>
          </div>
        </div>
      )}
      {note && (
        <PopupNote
          onClose={() => {
            if (note.startsWith("护照")) onDone();
            setNote("");
          }}
        >
          <h3>{note.split("\n")[0]}</h3>
          <p>{note.split("\n")[1] || "再找找看？"}</p>
        </PopupNote>
      )}
    </section>
  );
}

export function FlightBookingLegacy({ onDone }: { onDone: Done }) {
  const [selected, setSelected] = useState("");
  const [booked, setBooked] = useState(false);
  const choose = (type: string) =>
    type === "商务舱"
      ? setSelected("想得美。生日预算不允许。")
      : type === "超经舱"
        ? setSelected("很心动，但我们要把钱留给奶茶。")
        : setSelected("经济舱已锁定，省下的钱拿去快乐。");
  return (
    <section className="scene blue-scene">
      <SectionHeader number="02" kicker="TICKET DESK" title="先把机票订好">
        <p>目的地已经决定，唯一悬念是：预算能撑到哪个舱位？</p>
      </SectionHeader>
      <div className="route-card">
        <div>
          <small>出发地</small>
          <b>{content.trip.from}</b>
          <span>{content.trip.fromCode}</span>
        </div>
        <Plane />
        <div>
          <small>目的地</small>
          <b>{content.trip.to}</b>
          <span>{content.trip.toCode}</span>
        </div>
      </div>
      <div className="date-row">
        <span>
          去程 <b>{content.trip.departure}</b>
        </span>
        <span>
          回程 <b>{content.trip.returnDate}</b>
        </span>
      </div>
      <div className="ticket-options">
        {["经济舱", "超经舱", "商务舱"].map((x, i) => (
          <button
            key={x}
            className={selected && i === 0 ? "active" : ""}
            onClick={() => choose(x)}
          >
            <span>{["💺", "✨", "🥂"][i]}</span>
            <b>{x}</b>
            <small>
              {["生日特价 · $520", "舒服一点 · $888", "梦想价格 · $8888"][i]}
            </small>
          </button>
        ))}
      </div>
      {selected && <div className="inline-note">{selected}</div>}
      {!booked ? (
        <StickerButton
          disabled={!selected.startsWith("经济舱")}
          onClick={() => setBooked(true)}
        >
          确认订票
        </StickerButton>
      ) : (
        <>
          <BoardingPassCard />
          <ContinueButton onClick={onDone} />
        </>
      )}
    </section>
  );
}

export function PackingLegacy({ onDone }: { onDone: Done }) {
  const [packed, setPacked] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const add = (x: string) => setPacked((p) => (p.includes(x) ? p : [...p, x]));
  const icons = [Ticket, Ticket, Smartphone, BatteryCharging, Shirt, Gift];
  const complete = packed.length === content.requiredItems.length;
  return (
    <section className="scene peach-scene">
      <SectionHeader
        number="03"
        kicker="PACK WITH ME"
        title="行李箱：请合理使用空间"
      >
        <p>该带的一个别落，不该带的……也许可以先问问箱子。</p>
      </SectionHeader>
      <div className="packing-layout">
        <div className="items-grid">
          {content.requiredItems.map((x, i) => {
            const Icon = icons[i];
            return (
              <button
                disabled={packed.includes(x)}
                onClick={() => add(x)}
                key={x}
              >
                <Icon />
                <span>{x}</span>
                {packed.includes(x) && <Check />}
              </button>
            );
          })}
          {content.sillyItems.map((x) => (
            <button
              className="joke-item"
              onClick={() => setNote(x.reply)}
              key={x.name}
            >
              <X />
              <span>{x.name}</span>
            </button>
          ))}
        </div>
        <div className={`open-suitcase ${complete ? "ready" : ""}`}>
          <div className="suitcase-lid">
            <span>BIANCA</span>
            <i>SYD</i>
            <i>PVG</i>
          </div>
          <div className="suitcase-base">
            {packed.map((x) => (
              <span key={x}>{x}</span>
            ))}
            {!packed.length && <small>点选物品装进行李箱</small>}
          </div>
        </div>
      </div>
      {note && (
        <div className="inline-note coral" onClick={() => setNote("")}>
          {note}
        </div>
      )}
      {complete && (
        <div className="ready-banner">
          <Sparkles /> 准备出发！ <Sparkles />
        </div>
      )}
      {complete && <ContinueButton onClick={onDone} />}
    </section>
  );
}

type FareType = "经济舱" | "超经舱" | "商务舱";

const fareOptions: Array<{
  name: FareType;
  icon: string;
  price: string;
  message: string;
}> = [
  {
    name: "经济舱",
    icon: "💺",
    price: "生日特价 · $520",
    message: "经济舱已锁定，省下的钱拿去快乐。",
  },
  {
    name: "超经舱",
    icon: "✨",
    price: "舒服一点 · $888",
    message: "很心动，但我们要把钱留给奶茶。",
  },
  {
    name: "商务舱",
    icon: "🥂",
    price: "梦想价格 · $8888",
    message: "想得美。生日预算不允许。",
  },
];

export function FlightBooking({ onDone }: { onDone: Done }) {
  const [selectedFare, setSelectedFare] = useState<FareType | null>(null);
  const [booked, setBooked] = useState(false);
  const selectedOption = fareOptions.find((fare) => fare.name === selectedFare);

  return (
    <section className="scene blue-scene">
      <SectionHeader number="02" kicker="TICKET DESK" title="先把机票订好">
        <p>目的地已经决定，唯一悬念是：预算能撑到哪个舱位？</p>
      </SectionHeader>
      <div className="route-card">
        <div>
          <small>出发地</small>
          <b>{content.trip.from}</b>
          <span>{content.trip.fromCode}</span>
        </div>
        <Plane />
        <div>
          <small>目的地</small>
          <b>{content.trip.to}</b>
          <span>{content.trip.toCode}</span>
        </div>
      </div>
      <div className="date-row">
        <span>去程 <b>{content.trip.departure}</b></span>
        <span>回程 <b>{content.trip.returnDate}</b></span>
      </div>
      <div className="ticket-options">
        {fareOptions.map((fare) => (
          <button
            key={fare.name}
            className={selectedFare === fare.name ? "active" : ""}
            onClick={() => setSelectedFare(fare.name)}
          >
            <span>{fare.icon}</span>
            <b>{fare.name}</b>
            <small>{fare.price}</small>
          </button>
        ))}
      </div>
      {selectedOption && <div className="inline-note">{selectedOption.message}</div>}
      {!booked ? (
        <StickerButton
          disabled={selectedFare !== "经济舱"}
          onClick={() => setBooked(true)}
        >
          确认订票
        </StickerButton>
      ) : (
        <>
          <BoardingPassCard />
          <ContinueButton onClick={onDone} />
        </>
      )}
    </section>
  );
}

const packingFileNames = [
  "Passport.png",
  "Boarding Pass.png",
  "Phone.png",
  "Charger.png",
  "Cloth.png",
  "Gift.png",
];

const jokePackingFileNames = [
  "Working laptop.png",
  "Too many shoes.png",
  "Entire Sydney.png",
];

function PackingImage({ fileName, label }: { fileName: string; label: string }) {
  return (
    <span className="packing-image-frame" data-file={fileName}>
      <img
        src={`${import.meta.env.BASE_URL}packing-items/${fileName}`}
        alt={label}
        onError={(event) => {
          event.currentTarget.hidden = true;
          event.currentTarget.parentElement?.classList.add("missing");
        }}
      />
    </span>
  );
}

export function Packing({ onDone }: { onDone: Done }) {
  const [packed, setPacked] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const add = (item: string) =>
    setPacked((current) =>
      current.includes(item) ? current : [...current, item],
    );
  const complete = packed.length === content.requiredItems.length;

  return (
    <section className="scene peach-scene">
      <SectionHeader
        number="03"
        kicker="PACK WITH ME"
        title="行李箱：请合理使用空间"
      >
        <p>该带的一个别落，不该带的……也许可以先问问箱子。</p>
      </SectionHeader>
      <div className="packing-layout">
        <div className="items-grid">
          {content.requiredItems.map((item, index) => (
            <button
              disabled={packed.includes(item)}
              onClick={() => add(item)}
              key={item}
              aria-label={`装入${item}`}
            >
              <PackingImage fileName={packingFileNames[index]} label={item} />
              {packed.includes(item) && <Check />}
            </button>
          ))}
          {content.sillyItems.map((item, index) => (
            <button
              className="joke-item"
              onClick={() => setNote(item.reply)}
              key={item.name}
              aria-label={item.name}
            >
              <PackingImage
                fileName={jokePackingFileNames[index]}
                label={item.name}
              />
            </button>
          ))}
        </div>
        <div className={`open-suitcase ${complete ? "ready" : ""}`}>
          <div className="suitcase-lid bianca-id-slot">
            <img
              src={`${import.meta.env.BASE_URL}packing-items/Bianca ID.png`}
              alt="Bianca 角色卡"
            />
          </div>
          <div className="suitcase-base">
            {packed.map((item) => (
              <span key={item}>{item}</span>
            ))}
            {!packed.length && <small>点选物品装进行李箱</small>}
          </div>
        </div>
      </div>
      {note && (
        <div className="inline-note coral" onClick={() => setNote("")}>
          {note}
        </div>
      )}
      {complete && (
        <div className="ready-banner">
          <Sparkles /> 准备出发！ <Sparkles />
        </div>
      )}
      {complete && <ContinueButton onClick={onDone} />}
    </section>
  );
}

export function Airport({ onDone, debugMode = false, paused = false }: { onDone: Done; debugMode?: boolean; paused?: boolean }) {
  const steps = [
    ["值机", "行李托运成功，箱子去走自己的冒险线了。"],
    ["安检", "安检通过 ✓ 液体超过100ml？这题跳过。"],
    ["登机口", "到达登机口！难得没有一路狂奔。"],
  ];
  const [done, setDone] = useState<number[]>([]);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [boardingOpen, setBoardingOpen] = useState(false);
  const next = (i: number) => {
    if (debugMode) {
      if (i === 0) setCheckInOpen(true);
      if (i === 1) setSecurityOpen(true);
      if (i === 2) setBoardingOpen(true);
      return;
    }
    if (i === 0) {
      if (!done.includes(0)) setCheckInOpen(true);
      return;
    }
    if (i === 1 && done.includes(0)) {
      if (!done.includes(1)) setSecurityOpen(true);
      return;
    }
    if (i === 2 && done.includes(1)) setBoardingOpen(true);
  };
  return (
    <section className="scene airport-scene">
      <SectionHeader
        number="04"
        kicker="SYDNEY AIRPORT"
        title="机场闯关，三步就走"
      >
        <p>请 B老师按顺序完成今日份机场流程。</p>
      </SectionHeader>
      <div className="airport-board">
        <header>
          <span>出发流程</span>
          <b>ON TIME</b>
        </header>
        {steps.map((s, i) => (
          <button
            key={s[0]}
            onClick={() => next(i)}
            className={done.includes(i) ? "done" : ""}
          >
            <span className="step-num">0{i + 1}</span>
            <div>
              <b>{s[0]}</b>
              <small>{done.includes(i) ? s[1] : "点击完成这一步"}</small>
            </div>
            {done.includes(i) ? <Check /> : <ChevronRight />}
          </button>
        ))}
      </div>
      {done.length === 3 && (
        <ContinueButton label="可以登机啦 ✈" onClick={onDone} />
      )}
      {checkInOpen && (
        <CheckInDialogue
          onComplete={() => {
            setDone((current) => current.includes(0) ? current : [...current, 0]);
            setCheckInOpen(false);
          }}
        />
      )}
      {securityOpen && (
        <SecurityCheckScene
          debugMode={debugMode}
          paused={paused}
          onComplete={() => {
            setDone((current) => current.includes(1) ? current : [...current, 1]);
            setSecurityOpen(false);
          }}
        />
      )}
      {boardingOpen && (
        <BoardingScene
          paused={paused}
          onComplete={() => {
            setDone((current) => current.includes(2) ? current : [...current, 2]);
            setBoardingOpen(false);
          }}
        />
      )}
    </section>
  );
}

export function Flying({ onDone, paused = false }: { onDone: Done; paused?: boolean }) {
  return <ChapterFiveStory onComplete={onDone} paused={paused} />;
}

export function ChinaFun({ onDone }: { onDone: Done }) {
  const [active, setActive] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const open = (i: number) => {
    setActive(i);
    setSeen((s) => (s.includes(i) ? s : [...s, i]));
  };
  return (
    <section className="scene china-scene">
      <SectionHeader number="12" kicker="HAPPY LANDING" title="B老师的快乐地图">
        <p>这趟没有行程表。看到喜欢的，就去点一点。</p>
      </SectionHeader>
      <div className="fun-grid">
        {content.chinaFun.map((x, i) => (
          <button
            key={x.title}
            onClick={() => open(i)}
            className={seen.includes(i) ? "seen" : ""}
          >
            <span>{x.icon}</span>
            <b>{x.title}</b>
            <small>{seen.includes(i) ? "已打卡 ✓" : "点开看看"}</small>
          </button>
        ))}
      </div>
      {active !== null && (
        <PopupNote onClose={() => setActive(null)}>
          <span className="big-emoji">{content.chinaFun[active].icon}</span>
          <h3>{content.chinaFun[active].title}</h3>
          <p>{content.chinaFun[active].text}</p>
        </PopupNote>
      )}
      {seen.length >= 3 && <ContinueButton onClick={onDone} />}
    </section>
  );
}

export function Memories({ onDone }: { onDone: Done }) {
  return (
    <section className="scene memory-scene">
      <SectionHeader number="13" kicker="MEMORY FILM" title="这一年的旅行存档">
        <p>照片的位置先留好了，等真实回忆来入住。</p>
      </SectionHeader>
      <div className="polaroid-grid">
        {content.memories.map((x, i) => (
          <PolaroidCard item={x} index={i} key={x.title} />
        ))}
      </div>
      <ContinueButton onClick={onDone} />
    </section>
  );
}

export function Jokes({ onDone }: { onDone: Done }) {
  return (
    <section className="scene joke-scene">
      <SectionHeader number="14" kicker="FRIENDS ONLY" title="只有自己人看得懂">
        <p>一些经得起时间，但经不起追问的内部资料。</p>
      </SectionHeader>
      <div className="joke-wall">
        {content.jokes.map((x, i) => (
          <div className={`joke-note j${i}`} key={x}>
            <span>{i % 2 ? "♡" : "✦"}</span>
            {x}
          </div>
        ))}
      </div>
      <ContinueButton onClick={onDone} />
    </section>
  );
}

export function Messages({ onDone }: { onDone: Done }) {
  return (
    <section className="scene message-scene">
      <SectionHeader
        number="15"
        kicker="POSTCARDS FOR B"
        title="朋友们寄来的几句话"
      >
        <p>旅行要慢慢走，祝福也值得慢慢拆。</p>
      </SectionHeader>
      <div className="messages-list">
        {content.messages.map((x, i) => (
          <MessageCard {...x} index={i} key={x.name} />
        ))}
      </div>
      <ContinueButton label="拆最后一封信 💌" onClick={onDone} />
    </section>
  );
}

export function FinalCard() {
  const [celebrate, setCelebrate] = useState(false);
  return (
    <section className="scene final-scene">
      <div className="confetti" aria-hidden>
        {Array.from({ length: 24 }, (_, i) => (
          <i key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <span className="final-kicker">20 · 10 · 2026</span>
      <div className="cake">
        🎂<span>{celebrate ? "✨" : "🕯️"}</span>
      </div>
      <h2>生日快乐，Bianca</h2>
      <div className="final-poem">
        {content.finalMessage.map((x) => (
          <p key={x}>{x}</p>
        ))}
      </div>
      <div className="final-note">{content.finalNote}</div>
      <StickerButton onClick={() => setCelebrate(true)}>
        {celebrate ? "愿望已送达宇宙 ✦" : "吹蜡烛，收下愿望"}
      </StickerButton>
      <footer>WITH ALL OUR LOVE · 2026</footer>
    </section>
  );
}
