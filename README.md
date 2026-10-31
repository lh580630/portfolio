# 梁辉 · 剪辑包装师作品集

苹果风单页站点，零依赖静态文件，双击 `index.html` 即可打开，也可整体上传任意静态托管。

## 线上地址

**https://lianghuiwork-dpj1ipnx14ux.edgeone.dev?eo_token=3150c54b85e433adec0f01536413cc5a&eo_time=1793443746**

> 托管：腾讯 EdgeOne Pages（免费）。发送给他人的时候**必须带完整 `?eo_token=...&eo_time=...` 参数**，只发裸域名会被网关判定为「缺少访问参数」返回 401。

已在 2026-10-31 完成线上校验：首页 200，44 个视频 + 46 张封面全部可访问且支持 206 分片；其中 7 个关键文件（Showreel / DataMesh / 拼贴图 / 头像 / 简历 PDF / CSS / JS）与本地逐字节 md5 一致，无损坏。

## 现状

| 项目 | 状态 |
|---|---|
| 设计系统（毛玻璃导航 / 大留白 / 缓入动效 / 滚动进度） | 已完成 |
| 43 部作品：视频 + 封面 + 一句话说明 | 已完成 |
| Showreel（18 段代表片段拼合，约 47 秒 / 5.7MB） | 已完成 |
| 首屏拼贴（42 张封面网格 2240×1080） | 已完成 |
| 简历 PDF、头像 | 已完成 |
| 响应式（手机 / 平板 / 桌面）+ 触屏播放入口常显 | 已完成 |

站点本体约 32 MB（源素材 1.1 GB）。

## 排序规则

作品按**制作难度由难到易**自上而下排列，筛选分类后的相对顺序同样保持由难到易：

宣传片 → 实景跟踪 → 微电影 → 三维 → 包装合成 → 粒子特效 → 混剪卡点 → 口播信息流 → MG 动画

排序调整写在 `build.py` 的 `W` 清单里，改完执行 `python build.py inject` 即可重排。

## 目录

```
portfolio/
├── index.html                页面结构（含 43 张作品卡片）
├── assets/
│   ├── css/style.css         设计系统与响应式
│   ├── js/main.js            动效 / 筛选 / 视频灯箱
│   ├── videos/*.mp4          43 支网页版视频 + showreel.mp4
│   ├── images/*.jpg          43 张封面 + hero-mosaic + portrait + showreel
│   └── files/resume-lianghui.pdf
└── README.md
build.py                      素材构建脚本（转码 / Showreel / 拼贴 / 卡片注入）
```

## 分类

MG 动画 10 · 粒子特效 7 · 实景跟踪 6 · 包装合成 5 · 口播信息流 5 · 宣传片 4 · 混剪卡点 3 · 三维 2 · 微电影 1

## 重新生成素材（可选）

改 `build.py` 顶部的作品清单后执行：

```bash
python build.py media     # 转码 + 抽封面
python build.py reel      # 合成 Showreel
python build.py mosaic    # 生成首屏拼贴
python build.py inject    # 写入作品卡片
```

已剔除内容：`字体燃烧`（质量未达标）、重复的 App 演示视频（mg动画/手机app.mp4 与 包装合成类/手机app.mp4 完全一致，只保留后者）。

## 发布

任意静态托管均可，直接上传整个 `portfolio` 目录即可，无需构建。
注意：视频总体积约 31 MB，选择托管时留意流量与单文件大小限制。
