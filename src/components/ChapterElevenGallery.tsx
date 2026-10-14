import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import cgManifest from "virtual:chapter-eleven-cg-manifest";
import { ContinueButton, SectionHeader } from "./UI";

type Props = { onComplete: () => void };

const GROUPS_PER_PAGE = 4;

export function ChapterElevenGallery({ onComplete }: Props) {
  const [page, setPage] = useState(0);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [closing, setClosing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const totalPages = Math.max(1, Math.ceil(cgManifest.length / GROUPS_PER_PAGE));
  const pageGroups = useMemo(
    () => cgManifest.slice(page * GROUPS_PER_PAGE, (page + 1) * GROUPS_PER_PAGE),
    [page],
  );
  const selectedGroup = selectedGroupIndex === null ? null : cgManifest[selectedGroupIndex];
  const selectedImage = selectedGroup?.images[selectedImageIndex] ?? null;
  const lightboxOpen = selectedGroupIndex !== null;

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [lightboxOpen]);

  const closeViewer = useCallback(() => {
    if (closing) return;
    setClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setSelectedGroupIndex(null);
      setSelectedImageIndex(0);
      setClosing(false);
    }, 180);
  }, [closing]);

  const moveImage = useCallback((direction: -1 | 1) => {
    if (selectedGroupIndex === null) return;
    const imageCount = cgManifest[selectedGroupIndex]?.images.length ?? 0;
    setSelectedImageIndex((current) => Math.max(0, Math.min(imageCount - 1, current + direction)));
  }, [selectedGroupIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") moveImage(-1);
      if (event.key === "ArrowRight") moveImage(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeViewer, lightboxOpen, moveImage]);

  const changePage = (nextPage: number) => {
    const safePage = Math.max(0, Math.min(totalPages - 1, nextPage));
    setPage(safePage);
    window.requestAnimationFrame(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const finishSwipe = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    const touch = event.changedTouches[0];
    swipeStartRef.current = null;
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 55 || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0) moveImage(1);
    else moveImage(-1);
  };

  return <section className="scene memory-scene cg-gallery-scene">
    <SectionHeader number="11" kicker="CG COLLECTION" title="旅途留影">
      <p>那些难忘的相遇，都被悄悄收藏了起来。</p>
    </SectionHeader>

    {cgManifest.length > 0 ? <div className="cg-gallery-grid" ref={gridRef}>
      {pageGroups.map((group, index) => {
        const globalIndex = page * GROUPS_PER_PAGE + index;
        return <button className="cg-polaroid" type="button" key={group.number} onClick={() => {
          setSelectedGroupIndex(globalIndex);
          setSelectedImageIndex(0);
        }} aria-label={`查看 ${group.title}`}>
          <span className="cg-image-area"><img src={group.images[0]} alt={group.title} /></span>
          <strong>{group.title}</strong>
        </button>;
      })}
    </div> : <div className="cg-empty-note"><span>✦</span><p>回忆正在整理中……</p><small>这里很快就会住进新的旅途留影。</small></div>}

    <nav className="cg-pagination" aria-label="CG 相册分页">
      <button type="button" disabled={page === 0} onClick={() => changePage(page - 1)}>上一页</button>
      <b>{page + 1} / {totalPages}</b>
      <button type="button" disabled={page >= totalPages - 1} onClick={() => changePage(page + 1)}>下一页</button>
    </nav>

    <ContinueButton onClick={onComplete} />

    {selectedGroup && selectedImage && <div className={`cg-lightbox ${closing ? "is-closing" : ""}`} role="dialog" aria-modal="true" aria-label={`查看 ${selectedGroup.title}`} onClick={closeViewer}>
      <div
        className="cg-lightbox-panel"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          if (touch) swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={finishSwipe}
      >
        <button className="cg-lightbox-close" type="button" onClick={closeViewer} aria-label="关闭 CG">×</button>
        <div className="cg-lightbox-image"><img src={selectedImage} alt={`${selectedGroup.title} ${selectedImageIndex + 1}`} /></div>
        <h3>{selectedGroup.title}</h3>
        <span className="cg-lightbox-count">{selectedImageIndex + 1} / {selectedGroup.images.length}</span>
        <button className="cg-lightbox-nav previous" type="button" disabled={selectedImageIndex === 0} onClick={() => moveImage(-1)} aria-label="上一张 CG">‹</button>
        <button className="cg-lightbox-nav next" type="button" disabled={selectedImageIndex === selectedGroup.images.length - 1} onClick={() => moveImage(1)} aria-label="下一张 CG">›</button>
      </div>
    </div>}
  </section>;
}
