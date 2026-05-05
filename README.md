# 余生电量

一个移动优先（390x844）的人生剩余时间可视化 Web App，使用健康绿色主题，支持模板滑动、设置持久化、图片导出。

## 技术栈

- Next.js + TypeScript
- Tailwind CSS
- Framer Motion
- dayjs
- html-to-image
- npm workspaces monorepo

## 项目结构

- `apps/web`: Web 应用
- `packages/core`: 纯计算函数
- `packages/templates`: 模板定义
- `packages/tokens`: 视觉主题 tokens

## 本地运行（精确步骤）

### 一键启动（推荐）

```bash
npm run start:local
```

该命令会自动安装依赖并启动开发服务器。

### 分步启动（可选）

```bash
npm install
npm run dev
```

## 本地预览地址

开发环境默认访问：`http://localhost:3000`

## 已实现能力

- 底部三 Tab：`首页` / `组件` / `设置`
- 首页 5 个可横向切换模板：
  - battery
  - rhythm bars
  - circular progress
  - quote card
  - minimal number
- 设置项：出生日期、预期寿命、每日用餐次数、语气风格、默认模板
- 设置实时影响首页展示
- `localStorage` 持久化用户设置
- 长按卡片或按钮点击导出当前模板图片（PNG）
- 剩余比例（整数）与剩余天数（千分位）展示

## 计算规则

- 使用本地时区
- 按自然日计算
- 默认寿命 80 年
- 默认每日 3 餐


## 直接打开的 HTML 页面

如果你要“不要 PR 文案、直接打开网页”，可使用仓库根目录的 `douyin-downloader.html`：

1. 本地直接双击打开，或用任意静态服务器托管；
2. 若使用 GitHub Pages，可把该文件作为站点首页（重命名为 `index.html`）；
3. 打开后粘贴抖音链接即可解析并生成可点击下载链接。
