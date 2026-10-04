import publicImages from "virtual:public-image-manifest";

export type PreloadAsset = {
  url: string;
  bytes: number;
  kind: "image";
  priority: boolean;
};

const sourceImageModules = import.meta.glob(
  "/src/assets/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);

const sourceImages: PreloadAsset[] = Object.values(sourceImageModules).map((url) => ({
  url: String(url),
  bytes: 0,
  kind: "image",
  priority: true,
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

// 首屏先准备封面和房间；packing、airport 及所有 chapter-* 目录会自动进入后台队列。
// 因此新增 chapter-eleven、chapter-twelve 等目录时不需要修改预载列表。
export const initialImageQueue = imagePreloadQueue.filter((asset) => asset.priority);
export const backgroundImageQueue = imagePreloadQueue.filter((asset) => !asset.priority);

const imagePromises = new Map<string, Promise<void>>();

export function preloadImage(url: string) {
  const existing = imagePromises.get(url);
  if (existing) return existing;
  const promise = new Promise<void>((resolve) => {
    const image = new Image();
    const finish = () => resolve();
    image.onload = finish;
    image.onerror = finish;
    image.src = url;
  });
  imagePromises.set(url, promise);
  return promise;
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

let backgroundStarted = false;
export function startBackgroundImagePreload() {
  if (backgroundStarted) return;
  backgroundStarted = true;
  void preloadAssets(backgroundImageQueue, () => undefined, 6);
}

// 音频以后可以复用 PreloadAsset + 独立 preloadAudio()，不需要改动图片队列。
