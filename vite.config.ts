import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const IMAGE_PATTERN = /\.(png|jpe?g|webp|avif)$/i;
const virtualImageManifest = 'virtual:public-image-manifest';
const resolvedVirtualImageManifest = `\0${virtualImageManifest}`;

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

export default defineConfig({
  plugins: [publicImageManifestPlugin(), react()],
  base: '/bianca-birthday-story/',
});
