export type TemplateKey =
  | "battery"
  | "rhythm-bars"
  | "circular-progress"
  | "quote-card"
  | "minimal-number";

export interface TemplateDefinition {
  key: TemplateKey;
  title: string;
  description: string;
}

export const templates: TemplateDefinition[] = [
  { key: "battery", title: "电量电池", description: "最直观的余生比例" },
  { key: "rhythm-bars", title: "节律条", description: "把日子变成呼吸节奏" },
  { key: "circular-progress", title: "环形进度", description: "时间是一圈圈展开" },
  { key: "quote-card", title: "金句卡片", description: "适合分享的一句话" },
  { key: "minimal-number", title: "极简数字", description: "只保留震撼数字" }
];
