import type { CSSProperties } from "react";

const sectionStyle: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: "20px 22px",
  boxShadow: "0 6px 20px rgba(15,23,42,0.04)"
};

const h2Style: CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 12,
  color: "#0f172a"
};

const h3Style: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  marginTop: 14,
  marginBottom: 8,
  color: "#1e293b"
};

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
        color: "#111827"
      }}
    >
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <header className="mb-8 rounded-2xl border border-indigo-100 bg-white/90 p-6 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">AI Agent 学习手册</p>
          <h1 className="mb-3 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
            从入门到精通：AI Agent 如何应用搭建（含案例）
          </h1>
          <p className="text-base text-slate-600">
            一页搞懂 Agent、Skill、AI 工作流的差异，并给出可落地的 30 天搭建路径。
          </p>
        </header>

        <div className="space-y-5 pb-10">
          <section style={sectionStyle}>
            <h2 style={h2Style}>一、统一认知：Agent 是什么？</h2>
            <p>
              <strong>AI Agent = 大模型 + 工具调用 + 记忆 + 规划 + 反馈执行闭环。</strong>
              它不是“只能聊天的机器人”，而是“能围绕目标持续行动并交付结果”的系统。
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>二、三大概念区别：Agent / Skill / Workflow</h2>
            <h3 style={h3Style}>1) AI Workflow（工作流）</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>预先编排好固定步骤，像流程图。</li>
              <li>优点：稳定、可控、易审计；缺点：灵活性一般。</li>
              <li>例子：用户提问 → 检索知识库 → 模板化回复。</li>
            </ul>

            <h3 style={h3Style}>2) Skill（技能）</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>可复用能力模块，类似插件/函数。</li>
              <li>例子：SQL 查询、发邮件、调用 ERP、读取 PDF。</li>
              <li>特点：单点能力强，可被多个 Agent 复用。</li>
            </ul>

            <h3 style={h3Style}>3) Agent</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>以目标为中心，能自主决定调用哪个 Skill、何时重试、是否改计划。</li>
              <li>优点：灵活、适应复杂任务；代价：治理难度和成本更高。</li>
              <li>例子：自动完成“本周运营复盘并邮件发送”。</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>三、从入门到精通：能力成长路线</h2>

            <h3 style={h3Style}>阶段 A：入门（跑通 MVP）</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>掌握 Prompt 结构化写法（角色/目标/约束/输出格式）。</li>
              <li>接入 1~3 个工具（Function Calling / API）。</li>
              <li>接入基础记忆和简单 RAG。</li>
            </ul>

            <h3 style={h3Style}>阶段 B：进阶（稳定上线）</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>加入计划器（Plan-Execute）与状态机。</li>
              <li>建立重试、超时、错误分级、人工兜底。</li>
              <li>指标化评估：成功率、延迟、成本、幻觉率。</li>
            </ul>

            <h3 style={h3Style}>阶段 C：精通（多 Agent 协作）</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>角色分工：研究员 Agent、执行 Agent、审计 Agent。</li>
              <li>动态路由：按任务难度切模型与流程。</li>
              <li>建立长期记忆、自动评估、A/B 与成本治理体系。</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>四、工程化搭建步骤（可直接执行）</h2>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                <strong>选任务：</strong>先选高频、可量化、可验收的单点场景。
              </li>
              <li>
                <strong>定指标：</strong>准确率、人工介入率、平均时延、单任务成本。
              </li>
              <li>
                <strong>建循环：</strong>Understand → Plan → Act → Observe → Reflect → Finish。
              </li>
              <li>
                <strong>做 Skill 规范：</strong>Schema 强约束、幂等、错误码、可回放日志。
              </li>
              <li>
                <strong>做治理：</strong>权限最小化、注入防护、敏感操作人工确认。
              </li>
            </ol>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>五、案例：从简单到复杂</h2>

            <h3 style={h3Style}>案例 1：客服问答助手（Workflow 主导）</h3>
            <p>流程：意图识别 → 知识检索 → 模板回复 → 低置信度转人工。</p>

            <h3 style={h3Style}>案例 2：运营周报 Agent（单 Agent + 多 Skill）</h3>
            <p>自动拉指标、识别异常、生成报告、邮件发送，减少重复劳动。</p>

            <h3 style={h3Style}>案例 3：招聘系统（多 Agent 协作）</h3>
            <p>简历解析 Agent、匹配 Agent、面试题 Agent、合规审查 Agent 协同完成招聘流程。</p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>六、30 天落地计划</h2>
            <ul className="list-disc space-y-1 pl-6">
              <li><strong>第 1 周：</strong>选场景 + 定 KPI（准确率/时延/人工介入率）。</li>
              <li><strong>第 2 周：</strong>完成 MVP（1 个 Agent + 2~3 个 Skills）。</li>
              <li><strong>第 3 周：</strong>构建测试集并优化检索、提示词、参数。</li>
              <li><strong>第 4 周：</strong>灰度上线，增加监控告警与人工兜底。</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
