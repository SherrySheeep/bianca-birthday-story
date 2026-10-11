请把第六章图片放在这个文件夹，并保持以下文件名：

feixing1.png     飞行考试训练场背景
feixing2.png     飞行小游戏天空背景
fengquan1.png    风圈贴纸
pilot1.png       Bianca 风之翼玩家形象

安柏图片继续读取 public/chapter-five/Anbo1.png 至 Anbo4.png。
新增飞行考试素材也放在本文件夹：
- qiliu1.png：气流障碍
- LilAnbo1.png：安柏实时提示的小头像

气流参数位于 src/components/ChapterSixStory.tsx 顶部：
- REQUIRED_RING_HITS：通过考试需要成功穿过的风圈数量
- AIRFLOW_TRIGGER_HITS：通过几个风圈后出现气流
- AIRFLOW_SPEED_MULTIPLIER：气流相对风圈的动画时长倍率；越小越快
- MAX_AIRFLOW_HITS：最大允许碰撞次数
- RING_SPAWN_CHANCE：第二阶段每轮生成风圈的概率
- AIRFLOW_SPAWN_CHANCE：第二阶段每轮生成气流的概率
