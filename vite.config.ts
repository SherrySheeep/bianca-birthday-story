import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const IMAGE_PATTERN = /\.(png|jpe?g|webp|avif)$/i;
const virtualImageManifest = 'virtual:public-image-manifest';
const resolvedVirtualImageManifest = `\0${virtualImageManifest}`;
const virtualCgManifest = 'virtual:chapter-eleven-cg-manifest';
const resolvedVirtualCgManifest = `\0${virtualCgManifest}`;

function collectPublicImages(directory: string, root = directory) {
  const images: Array<{ path: string; bytes: number }> = [];
  const walk = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const absolute = join(current, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (IMAGE_PATTERN.test(entry.name)) {
        images.push({
          path: relative(root, absolute).split(sep).map(encodeURIComponent).join('/'),
          bytes: statSync(absolute).size,
        });
      }
    }
  };
  walk(directory);
  return images.sort((a, b) => a.path.localeCompare(b.path));
}

function publicImageManifestPlugin() {
  let publicDir = '';
  let base = '/';
  return {
    name: 'public-image-preload-manifest',
    configResolved(config: { publicDir: string; base: string }) {
      publicDir = config.publicDir;
      base = config.base;
    },
    resolveId(id: string) {
      if (id === virtualImageManifest) return resolvedVirtualImageManifest;
    },
    load(id: string) {
      if (id !== resolvedVirtualImageManifest) return;
      const images = collectPublicImages(publicDir).map((image) => ({
        url: `${base}${image.path}`,
        bytes: image.bytes,
      }));
      const totalMb = images.reduce((sum, image) => sum + image.bytes, 0) / 1024 / 1024;
      console.info(`[preload] 自动扫描到 ${images.length} 张图片，共 ${totalMb.toFixed(2)} MB`);
      return `export default ${JSON.stringify(images)};`;
    },
  };
}

function collectChapterElevenCgs(publicDir: string, base: string) {
  const cgDirectory = join(publicDir, 'chapter-eleven', 'cg');
  if (!existsSync(cgDirectory)) return [];

  const titles = new Map<number, string>();
  const titleFile = join(cgDirectory, 'CG.txt');
  if (existsSync(titleFile)) {
    for (const rawLine of readFileSync(titleFile, 'utf8').split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) continue;
      const match = line.match(/^CG(\d+)\s*[:：]\s*(.*)$/i);
      if (!match) continue;
      const title = match[2].trim();
      if (title) titles.set(Number(match[1]), title);
    }
  }

  return readdirSync(cgDirectory)
    .map((fileName) => ({ fileName, match: fileName.match(/^CG(\d+)\.png$/i) }))
    .filter((entry): entry is { fileName: string; match: RegExpMatchArray } => Boolean(entry.match))
    .map(({ fileName, match }) => {
      const number = Number(match[1]);
      return {
        number,
        title: titles.get(number) ?? `CG ${number}`,
        url: `${base}chapter-eleven/cg/${encodeURIComponent(fileName)}`,
      };
    })
    .sort((a, b) => a.number - b.number);
}

function chapterElevenCgManifestPlugin() {
  let publicDir = '';
  let base = '/';
  let cgDirectory = '';

  return {
    name: 'chapter-eleven-cg-manifest',
    configResolved(config: { publicDir: string; base: string }) {
      publicDir = config.publicDir;
      base = config.base;
      cgDirectory = join(publicDir, 'chapter-eleven', 'cg');
    },
    resolveId(id: string) {
      if (id === virtualCgManifest) return resolvedVirtualCgManifest;
    },
    load(id: string) {
      if (id !== resolvedVirtualCgManifest) return;
      return `export default ${JSON.stringify(collectChapterElevenCgs(publicDir, base))};`;
    },
    configureServer(server: import('vite').ViteDevServer) {
      const refresh = (changedPath: string) => {
        if (!changedPath.startsWith(cgDirectory)) return;
        const module = server.moduleGraph.getModuleById(resolvedVirtualCgManifest);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh);
      server.watcher.on('change', refresh);
      server.watcher.on('unlink', refresh);
    },
  };
}

export default defineConfig({
  plugins: [publicImageManifestPlugin(), chapterElevenCgManifestPlugin(), react()],
  base: '/bianca-birthday-story/',
});
