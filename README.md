# B老师的旅行生日手账

一个为 Bianca 制作的移动端优先互动生日故事。使用 React、TypeScript 和 Vite，无后端依赖。

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 编辑内容

所有常用文案都集中在 `src/data/content.ts`：

- `title`、`intro`：封面标题和开场文案
- `trip`：出发地、目的地、日期、乘客和航班号
- `chinaFun`：中国玩乐打卡内容
- `memories`：旅行回忆卡片
- `jokes`：内部梗
- `messages`：朋友留言
- `finalMessage`、`finalNote`：最终生日卡文案

## 替换图片

- 封面人物图：替换 `public/bianca-chibi.png`，保留文件名即可。
- 回忆区目前使用设计好的占位卡。要放入真实照片，可在 `content.ts` 的回忆项中加入图片路径，并在 `src/components/Cards.tsx` 的 `PolaroidCard` 中把 `.photo-placeholder` 替换成 `<img>`。
- 推荐把照片放入 `public/photos/`，通过 `/photos/文件名.jpg` 引用。

## 结构

- `src/App.tsx`：章节进度、本地保存和流程控制
- `src/data/content.ts`：可编辑内容
- `src/components/`：按钮、弹窗、登机牌、拍立得和留言卡
- `src/sections/StorySections.tsx`：11 个互动章节
- `src/styles/global.css`：视觉主题、响应式布局和动画

进度会保存在浏览器 `localStorage` 中，点击右上角“从头再来”可重置。
