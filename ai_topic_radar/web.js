const sampleCsv = `日期,平台,关键词,标题,热度,涨幅,备注
2026-05-20,抖音热点,AI 做 PPT,用 AI 生成工作汇报 PPT,88000,42,职场办公
2026-05-20,微信指数,AI 会议纪要,AI 自动整理会议纪要搜索上升,56000,35,办公提效
2026-05-20,小红书热搜,AI 资料包,普通人用 AI 做副业资料包,73000,48,副业
2026-05-20,巨量算数,AI 自动化客服,小老板用 AI 自动回复客户咨询,92000,52,小老板
2026-05-20,B站热榜,AI 数字人,AI 数字人口播视频教程,61000,28,短视频
2026-05-20,百度指数,AI Excel,AI 做 Excel 报表,69000,31,办公
2026-05-20,小红书热搜,AI 写文案,AI 写朋友圈成交文案,58000,26,文案
2026-05-20,微信指数,AI 总结,AI 总结长文档和报告,64000,30,职场
2026-05-20,B站热榜,RAG 向量数据库,RAG 向量数据库部署教程,45000,22,开发者内容应过滤
2026-05-20,抖音热点,AI 搬运赚钱,AI 批量搬运短视频赚钱,77000,55,违规风险应过滤`;

const fixedDirectionKeywords = [
  "AI 工具",
  "AI 赚钱",
  "AI 办公",
  "AI 创业",
  "自动化",
  "AI 做 PPT",
  "AI 做 Excel",
  "AI 写文案",
  "AI 总结",
  "AI 会议纪要",
  "AI 数字人",
  "AI 接单",
  "AI 资料制作",
  "AI 工作流"
];

const platformWeights = new Map([
  ["巨量算数", 18],
  ["抖音热点", 18],
  ["抖音", 18],
  ["微信指数", 15],
  ["微信", 15],
  ["小红书热搜", 14],
  ["小红书", 14],
  ["B站热榜", 12],
  ["B站", 12],
  ["哔哩哔哩", 12],
  ["百度指数", 10],
  ["百度", 10]
]);

const negativePatterns = [
  {
    reason: "纯技术开发者话题",
    words: [
      "api",
      "sdk",
      "langchain",
      "llamaindex",
      "rag",
      "微调",
      "fine-tune",
      "finetune",
      "部署",
      "私有化部署",
      "cuda",
      "gpu",
      "token",
      "tokenizer",
      "向量数据库",
      "embedding",
      "function calling",
      "mcp",
      "benchmark",
      "评测集",
      "模型蒸馏",
      "开发者",
      "程序员"
    ]
  },
  {
    reason: "太宏观或难落地",
    words: [
      "agi",
      "通用人工智能",
      "模型大战",
      "大模型战争",
      "算力",
      "融资",
      "估值",
      "监管",
      "政策",
      "峰会",
      "行业报告",
      "市值",
      "发布会直播",
      "论文",
      "arxiv",
      "transformer",
      "参数"
    ]
  },
  {
    reason: "违规或灰产风险",
    words: [
      "灰产",
      "黑产",
      "擦边",
      "赌博",
      "博彩",
      "诈骗",
      "薅羊毛",
      "批量注册",
      "外挂",
      "破解",
      "盗版",
      "洗稿",
      "搬运",
      "刷量",
      "群控",
      "私信轰炸",
      "虚拟币",
      "币圈"
    ]
  }
];

const practicalSignals = [
  "工具",
  "教程",
  "办公",
  "ppt",
  "excel",
  "表格",
  "文案",
  "总结",
  "会议纪要",
  "数字人",
  "接单",
  "资料",
  "资料包",
  "工作流",
  "自动化",
  "客服",
  "获客",
  "剪辑",
  "海报",
  "短视频",
  "小红书",
  "电商",
  "简历",
  "合同",
  "报价单",
  "客服话术",
  "社群"
];

const conversionSignals = [
  "模板",
  "清单",
  "资料包",
  "工作流",
  "表格",
  "提示词",
  "案例",
  "工具包",
  "课程",
  "咨询",
  "自动化"
];

const audienceRules = [
  ["小老板", ["老板", "创业", "门店", "获客", "客服", "电商", "降本", "客户", "报价", "私域"]],
  ["副业人群", ["赚钱", "副业", "接单", "资料包", "自媒体", "小红书", "短视频", "变现"]],
  ["职场人", ["办公", "ppt", "excel", "会议", "纪要", "总结", "汇报", "老板", "简历", "文案"]]
];

const angleRules = [
  ["教程", ["教程", "怎么", "用 AI", "办公", "ppt", "excel", "文案", "总结", "纪要", "资料"]],
  ["案例", ["老板", "创业", "获客", "客服", "电商", "工作流", "自动化", "降本"]],
  ["测评", ["工具", "对比", "测评", "哪个好", "替代"]],
  ["盘点", ["清单", "合集", "工具包", "盘点"]],
  ["观点", ["趋势", "爆了", "为什么", "普通人"]]
];

const state = {
  topics: [],
  rejected: 0
};

const els = {
  input: document.querySelector("#hotspot-input"),
  runDate: document.querySelector("#run-date"),
  loadSample: document.querySelector("#load-sample"),
  generate: document.querySelector("#generate"),
  download: document.querySelector("#download"),
  inputCount: document.querySelector("#input-count"),
  outputCount: document.querySelector("#output-count"),
  statusText: document.querySelector("#status-text"),
  rejectCount: document.querySelector("#reject-count"),
  candidateCount: document.querySelector("#candidate-count"),
  audienceWork: document.querySelector("#audience-work"),
  audienceSide: document.querySelector("#audience-side"),
  audienceOwner: document.querySelector("#audience-owner"),
  topicBody: document.querySelector("#topic-body")
};

function todayIso() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function textKey(value) {
  return normalizeText(value).toLowerCase();
}

function parseNumber(value) {
  const number = Number(String(value || "").replace(/[,％%]/g, "").trim());
  return Number.isFinite(number) ? number : 0;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [header = [], ...body] = rows.filter((item) => item.some((cellValue) => normalizeText(cellValue)));
  return body.map((item) => {
    const record = {};
    header.forEach((key, index) => {
      record[normalizeText(key)] = normalizeText(item[index]);
    });
    return record;
  });
}

function pick(row, names, fallback = "") {
  for (const name of names) {
    if (row[name]) return normalizeText(row[name]);
  }
  const lowered = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value]));
  for (const name of names) {
    if (lowered[name.toLowerCase()]) return normalizeText(lowered[name.toLowerCase()]);
  }
  return fallback;
}

function containsAny(text, words) {
  const low = textKey(text);
  return words.some((word) => low.includes(textKey(word)));
}

function rejectionReason(text) {
  const match = negativePatterns.find((group) => containsAny(text, group.words));
  return match ? match.reason : "";
}

function isAiRelated(text) {
  return containsAny(text, [
    "ai",
    "人工智能",
    "大模型",
    "智能体",
    "chatgpt",
    "deepseek",
    "kimi",
    "豆包",
    "通义",
    "文心",
    "扣子",
    "coze"
  ]);
}

function canonicalKeyword(rawKeyword, title = "") {
  const text = `${rawKeyword} ${title}`;
  const low = textKey(text);
  const rules = [
    ["AI 做 PPT", ["ppt", "幻灯片", "演示文稿", "汇报"]],
    ["AI 做 Excel", ["excel", "表格", "数据透视", "函数"]],
    ["AI 写文案", ["文案", "朋友圈", "小红书文案", "卖点", "脚本"]],
    ["AI 总结", ["总结", "长文", "读文档", "提炼", "摘要"]],
    ["AI 会议纪要", ["会议纪要", "开会", "录音转文字", "会议总结"]],
    ["AI 数字人", ["数字人", "克隆声音", "虚拟主播", "口播"]],
    ["AI 接单", ["接单", "兼职", "副业", "变现"]],
    ["AI 资料制作", ["资料包", "资料制作", "模板", "课件", "手册"]],
    ["AI 自动化工作流", ["自动化", "工作流", "智能体", "客服", "获客", "coze", "扣子", "dify"]],
    ["AI 办公提效", ["办公", "效率", "提效", "职场"]],
    ["AI 工具清单", ["工具", "清单", "合集", "盘点"]],
    ["AI 创业获客", ["创业", "老板", "门店", "客户", "获客", "电商"]]
  ];
  const match = rules.find(([, signals]) => signals.some((signal) => low.includes(signal)));
  if (match) return match[0];
  if (low.includes("赚钱")) return "AI 赚钱";
  if (isAiRelated(text)) return normalizeText(rawKeyword);
  return `AI ${normalizeText(rawKeyword)}`;
}

function normalizeHeatScore(value, cap = 100000) {
  if (value <= 0) return 0;
  return (Math.min(value, cap) / cap) * 16;
}

function normalizeTrendScore(value, cap = 100) {
  if (value <= 0) return 0;
  return (Math.min(value, cap) / cap) * 12;
}

function platformScore(platforms) {
  let score = 0;
  platforms.forEach((platform) => {
    platformWeights.forEach((weight, name) => {
      if (platform.includes(name)) score = Math.max(score, weight);
    });
  });
  return score;
}

function selectByRules(text, rules, fallback) {
  const low = textKey(text);
  const scored = rules.map(([label, signals]) => ({
    label,
    score: signals.filter((signal) => low.includes(textKey(signal))).length
  }));
  scored.sort((first, second) => second.score - first.score);
  return scored[0] && scored[0].score ? scored[0].label : fallback;
}

function buildTopicTitle(keyword, audience, angle) {
  const low = textKey(keyword);
  if (low.includes("ppt")) return "普通人用 AI 10 分钟做出一份老板能看的 PPT";
  if (low.includes("excel") || low.includes("表格")) return "不会函数也能用 AI 做 Excel 报表，3 分钟看懂";
  if (low.includes("会议纪要")) return "开完会别再手写纪要了，用 AI 自动整理待办和重点";
  if (low.includes("自动化") || low.includes("工作流")) return "小老板用 AI 自动处理客户咨询，少招一个客服";
  if (low.includes("资料")) return "用 AI 做一套资料包，普通人也能开始副业";
  if (low.includes("接单")) return "普通人怎么用 AI 接到第一个小单？从这 3 类需求开始";
  if (low.includes("数字人")) return "不想出镜也能做口播，用 AI 数字人完成第一条视频";
  if (low.includes("文案")) return "不会写文案的人，用 AI 也能写出能成交的朋友圈";
  if (low.includes("总结")) return "把 50 页资料丢给 AI，5 分钟整理成可汇报提纲";
  if (low.includes("赚钱") || low.includes("副业")) return "别只问 AI 怎么赚钱，先用它做这 3 个可交付服务";
  if (low.includes("创业") || audience === "小老板") return "小老板每天都能用上的 5 个 AI 降本工具";
  if (low.includes("工具") || angle === "盘点") return "最近值得普通人试的 5 个 AI 工具，办公和副业都能用";
  return `${audience}可以马上上手的 ${keyword} 方法，今天就能照着做`;
}

function buildReason(candidate) {
  const reasons = [];
  if (candidate.sourcePlatforms.size) reasons.push("来自真实平台热点输入");
  if (candidate.trend > 0) reasons.push("热度有上升信号");
  if (containsAny(candidate.keyword, practicalSignals)) reasons.push("场景具体，容易展示操作前后对比");
  if (["职场人", "副业人群", "小老板"].includes(candidate.audience)) reasons.push(`命中${candidate.audience}的高频痛点`);
  if (containsAny(candidate.keyword, conversionSignals)) reasons.push("后续可承接模板、清单或资料包");
  return reasons.slice(0, 4).join("；") || "AI 方向明确，适合做成低门槛教程内容";
}

function buildConversion(keyword, audience) {
  const low = textKey(keyword);
  if (low.includes("ppt")) return "适合引流 PPT 模板、AI 办公工具清单、提示词包";
  if (low.includes("excel") || low.includes("表格")) return "适合引流 Excel 模板、报表自动化清单、办公训练营";
  if (low.includes("会议纪要") || low.includes("总结")) return "适合引流会议纪要模板、资料总结提示词、办公工具清单";
  if (low.includes("自动化") || low.includes("工作流")) return "适合引流工作流模板、自动化咨询、工具搭建服务";
  if (low.includes("资料") || low.includes("接单") || audience === "副业人群") return "适合引流资料包、接单案例、社群或入门课程";
  if (low.includes("数字人")) return "适合引流数字人工具清单、口播模板、短视频服务咨询";
  if (audience === "小老板") return "适合引流工具清单、降本方案、自动化咨询";
  return "适合引流 AI 工具清单、提示词模板、社群或轻咨询";
}

function readHotspots(csvText) {
  return parseCsv(csvText)
    .map((row) => ({
      date: pick(row, ["date", "日期"], todayIso()),
      platform: pick(row, ["platform", "平台", "source", "来源平台"], "人工输入"),
      keyword: pick(row, ["keyword", "关键词", "hotword", "热词"]),
      title: pick(row, ["title", "标题", "source_title", "热榜内容", "content"]),
      heat: parseNumber(pick(row, ["heat", "热度", "index", "指数"])),
      trend: parseNumber(pick(row, ["trend", "涨幅", "increase", "变化"])),
      note: pick(row, ["note", "备注"])
    }))
    .filter((item) => item.keyword || item.title)
    .map((item) => ({
      ...item,
      keyword: item.keyword || item.title
    }));
}

function expandKeywords(hotspots) {
  const candidates = new Map();
  const add = (keyword, hotspot = null, baseBonus = 0) => {
    const cleanKeyword = normalizeText(keyword);
    if (!cleanKeyword) return;
    if (!candidates.has(cleanKeyword)) {
      candidates.set(cleanKeyword, {
        keyword: cleanKeyword,
        sourcePlatforms: new Set(),
        sourceTitles: new Set(),
        heat: 0,
        trend: 0,
        score: 0
      });
    }
    const candidate = candidates.get(cleanKeyword);
    candidate.score += baseBonus;
    if (hotspot) {
      candidate.sourcePlatforms.add(hotspot.platform);
      if (hotspot.title) candidate.sourceTitles.add(hotspot.title);
      candidate.heat = Math.max(candidate.heat, hotspot.heat);
      candidate.trend = Math.max(candidate.trend, hotspot.trend);
    }
  };

  fixedDirectionKeywords.forEach((keyword) => add(keyword, null, 4));

  hotspots.forEach((hotspot) => {
    const combined = `${hotspot.keyword} ${hotspot.title} ${hotspot.note}`;
    if (!isAiRelated(combined) && !containsAny(combined, practicalSignals)) return;

    const canonical = canonicalKeyword(hotspot.keyword, hotspot.title);
    add(canonical, hotspot, 10);

    if (isAiRelated(combined)) {
      practicalSignals.forEach((signal) => {
        if (containsAny(combined, [signal])) {
          add(canonicalKeyword(`AI ${signal}`, combined), hotspot, 5);
        }
      });
    }
  });

  return [...candidates.values()];
}

function scoreCandidate(candidate) {
  const text = [candidate.keyword, ...candidate.sourceTitles].join(" ");
  candidate.rejectReason = rejectionReason(text);
  if (candidate.rejectReason) {
    candidate.score = -100;
    return candidate;
  }

  const audienceSignalWords = audienceRules.flatMap(([, signals]) => signals);
  const practicalScore = containsAny(text, practicalSignals) ? 24 : 8;
  const conversionScore = containsAny(text, conversionSignals) ? 14 : 6;
  const aiScore = isAiRelated(text) ? 16 : 6;
  const audienceScore = containsAny(text, audienceSignalWords) ? 12 : 6;

  candidate.score +=
    aiScore +
    practicalScore +
    conversionScore +
    audienceScore +
    platformScore(candidate.sourcePlatforms) +
    normalizeHeatScore(candidate.heat) +
    normalizeTrendScore(candidate.trend);

  candidate.audience = selectByRules(text, audienceRules, "职场人");
  candidate.angle = selectByRules(text, angleRules, "教程");
  candidate.title = buildTopicTitle(candidate.keyword, candidate.audience, candidate.angle);
  candidate.reason = buildReason(candidate);
  candidate.conversion = buildConversion(candidate.keyword, candidate.audience);
  return candidate;
}

function generateTopics(csvText, limit = 10) {
  const hotspots = readHotspots(csvText);
  const candidates = expandKeywords(hotspots).map(scoreCandidate);
  const usable = candidates.filter((candidate) => candidate.score > 0 && !candidate.rejectReason);
  const rejected = candidates.filter((candidate) => candidate.rejectReason).length;
  usable.sort((first, second) => second.score - first.score);
  return {
    hotspots,
    topics: usable.slice(0, limit),
    rejected,
    totalCandidates: candidates.length
  };
}

function audienceClass(audience) {
  if (audience === "副业人群") return "tag side";
  if (audience === "小老板") return "tag owner";
  return "tag";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderTopics(topics) {
  if (!topics.length) {
    els.topicBody.innerHTML = `<tr class="empty-row"><td colspan="9">暂无结果</td></tr>`;
    return;
  }

  els.topicBody.innerHTML = topics
    .map((topic, index) => {
      const platforms = [...topic.sourcePlatforms].sort().join(" / ") || "固定方向词";
      return `<tr>
        <td><input class="adopt-check" type="checkbox" aria-label="采用第 ${index + 1} 条" data-index="${index}" /></td>
        <td>${index + 1}</td>
        <td>${escapeHtml(topic.keyword)}</td>
        <td>${escapeHtml(topic.title)}</td>
        <td>${escapeHtml(topic.reason)}</td>
        <td><span class="${audienceClass(topic.audience)}">${escapeHtml(topic.audience)}</span></td>
        <td>${escapeHtml(topic.angle)}</td>
        <td>${escapeHtml(topic.conversion)}</td>
        <td>${escapeHtml(platforms)}</td>
      </tr>`;
    })
    .join("");
}

function renderMetrics(result) {
  const topics = result.topics;
  els.inputCount.textContent = `${result.hotspots.length} 条`;
  els.outputCount.textContent = `${topics.length} / 10`;
  els.statusText.textContent = topics.length ? "已生成" : "无可用选题";
  els.rejectCount.textContent = `过滤 ${result.rejected} 条`;
  els.candidateCount.textContent = String(result.totalCandidates);
  els.audienceWork.textContent = String(topics.filter((topic) => topic.audience === "职场人").length);
  els.audienceSide.textContent = String(topics.filter((topic) => topic.audience === "副业人群").length);
  els.audienceOwner.textContent = String(topics.filter((topic) => topic.audience === "小老板").length);
  els.download.disabled = !topics.length;
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function buildExportCsv() {
  const fields = [
    "日期",
    "排名",
    "关键词",
    "爆款选题标题",
    "爆款理由",
    "目标人群",
    "内容角度",
    "引流/转化潜力",
    "来源平台",
    "是否采用",
    "备注"
  ];
  const rows = state.topics.map((topic, index) => {
    const adopted = document.querySelector(`.adopt-check[data-index="${index}"]`)?.checked ? "是" : "";
    return [
      els.runDate.value,
      index + 1,
      topic.keyword,
      topic.title,
      topic.reason,
      topic.audience,
      topic.angle,
      topic.conversion,
      [...topic.sourcePlatforms].sort().join(" / ") || "固定方向词",
      adopted,
      `score=${topic.score.toFixed(1)}`
    ].map(csvCell);
  });
  return [fields.map(csvCell), ...rows].map((row) => row.join(",")).join("\n");
}

function downloadCsv() {
  const csv = `\uFEFF${buildExportCsv()}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `ai-topic-radar-${els.runDate.value || todayIso()}.csv`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function runGenerate() {
  const result = generateTopics(els.input.value, 10);
  state.topics = result.topics;
  state.rejected = result.rejected;
  renderTopics(result.topics);
  renderMetrics(result);
}

els.runDate.value = todayIso();
els.input.value = sampleCsv;
els.loadSample.addEventListener("click", () => {
  els.input.value = sampleCsv;
  runGenerate();
});
els.generate.addEventListener("click", runGenerate);
els.download.addEventListener("click", downloadCsv);
els.input.addEventListener("input", () => {
  const rows = readHotspots(els.input.value).length;
  els.inputCount.textContent = `${rows} 条`;
  els.statusText.textContent = "等待生成";
});

runGenerate();
