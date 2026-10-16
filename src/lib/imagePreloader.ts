import publicImages from "virtual:public-image-manifest";

export type PreloadAsset = {
  url: string;
  bytes: number;
  kind: "image";
};

const sourceImageModules = import.meta.glob(
  "/src/assets/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);

const sourceImages: PreloadAsset[] = Object.values(sourceImageModules).map((url) => ({
  url: String(url),
  bytes: 0,
  kind: "image",
}));

export const imagePreloadQueue: PreloadAsset[] = Array.from(
  new Map(
    [...publicImages.map((asset) => ({ ...asset, kind: "image" as const })), ...sourceImages]
      .map((asset) => [asset.url, asset]),
  ).values(),
);

export const imagePreloadStats = {
  count: imagePreloadQueue.length,
  knownBytes: imagePreloadQueue.reduce((sum, asset) => sum + asset.bytes, 0),
};

const imagePromises = new Map<string, Promise<void>>();
const retainedImages = new Map<string, HTMLImageElement>();

function assetChapter(asset: PreloadAsset) {
  const path = new URL(asset.url, window.location.origin).pathname.toLowerCase();
  const chapterFolders: Array<[string, number]> = [
    ["/chapter-five/", 5],
    ["/chapter-six/", 6],
    ["/chapter-seven/", 7],
    ["/chapter-eight/", 8],
    ["/chapter-nine/", 9],
    ["/chapter-ten/", 10],
    ["/chapter-eleven/", 11],
  ];
  const matchedChapter = chapterFolders.find(([folder]) => path.includes(folder));
  if (matchedChapter) return matchedChapter[1];
  if (path.includes("/airport-checkin/") || path.includes("/airport-security/") || path.includes("/airport-boarding/")) return 4;
  if (path.includes("/packing-items/")) return 3;
  if (path.includes("/desk-items/") || path.includes("/room-items/")) return 1;
  return 0;
}

export function getChapterAssets(chapters: number[]) {
  const chapterSet = new Set(chapters);
  return imagePreloadQueue.filter((asset) => chapterSet.has(assetChapter(asset)));
}

// 封面 + 第 1–4 章。后续章节改由滚动式章节窗口预加载。
export const initialImagePreloadQueue = getChapterAssets([0, 1, 2, 3, 4]);

export function preloadImage(url: string) {
  const existing = imagePromises.get(url);
  if (existing) return existing;
  const promise = new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = async () => {
      try {
        await image.decode();
      } catch {
        // 部分浏览器在 onload 后可能拒绝 decode；图片本身仍然可显示。
      }
      retainedImages.set(url, image);
      resolve();
    };
    image.onerror = () => {
      console.warn(`[preload] 图片加载失败：${url}`);
      resolve();
    };
    image.src = url;
  });
  imagePromises.set(url, promise);
  return promise;
}

function chaptersForWindow(chapter: number, includeEarlyCg: boolean) {
  const chapters = [chapter, chapter + 1, chapter + 2].filter((value) => value >= 0 && value <= 12);
  if (includeEarlyCg && chapter === 8 && !chapters.includes(11)) chapters.push(11);
  return chapters;
}

export async function preloadChapterWindow(chapter: number, includeEarlyCg = false) {
  const chapters = chaptersForWindow(chapter, includeEarlyCg);
  const assets = getChapterAssets(chapters);
  await preloadAssets(assets, () => undefined, 6);
  return { chapters, assets };
}

export function retainChapterWindow(chapter: number, includeEarlyCg = false) {
  const chapters = chapter <= 2
    ? [0, 1, 2, 3, 4]
    : chaptersForWindow(chapter, includeEarlyCg);
  const retainedUrls = new Set(getChapterAssets(chapters).map((asset) => asset.url));
  for (const url of retainedImages.keys()) {
    if (!retainedUrls.has(url)) {
      retainedImages.delete(url);
      imagePromises.delete(url);
    }
  }
}

export async function preloadAssets(
  assets: PreloadAsset[],
  onProgress: (completed: number, total: number) => void,
  concurrency = 8,
) {
  const total = assets.length;
  let nextIndex = 0;
  let completed = 0;
  onProgress(completed, total);

  const worker = async () => {
    while (nextIndex < total) {
      const asset = assets[nextIndex++];
      await preloadImage(asset.url);
      completed += 1;
      onProgress(completed, total);
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, total) }, worker));
}

// 音频以后可以复用 PreloadAsset + 独立 preloadAudio()，不需要改动图片队列。
