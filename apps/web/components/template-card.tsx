"use client";

import { motion } from "framer-motion";
import { themeTokens } from "@yusheng/tokens";
import type { TemplateKey } from "@yusheng/templates";

interface Props {
  template: TemplateKey;
  percent: number;
  remainingDays: string;
  quote: string;
}

export function TemplateCard({ template, percent, remainingDays, quote }: Props) {
  if (template === "battery") {
    return (
      <div className="space-y-5">
        <p className="text-3xl font-semibold">你还剩 {percent}%</p>
        <div className="h-16 rounded-2xl border border-white/30 p-1">
          <motion.div className="h-full rounded-xl" style={{ width: `${percent}%`, background: themeTokens.primary }} />
        </div>
        <p className="text-lg text-white/70">距离终点还有 {remainingDays} 天</p>
      </div>
    );
  }

  if (template === "rhythm-bars") {
    return (
      <div>
        <p className="text-3xl font-semibold mb-4">你的时间仍在前方</p>
        <div className="flex items-end gap-2 h-28">
          {Array.from({ length: 16 }).map((_, i) => {
            const active = i < Math.round((percent / 100) * 16);
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-md"
                style={{
                  height: `${30 + ((i * 17) % 60)}%`,
                  background: active ? themeTokens.primary : themeTokens.mutedBlock
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (template === "circular-progress") {
    const r = 66;
    const c = 2 * Math.PI * r;
    return (
      <div className="flex flex-col items-center gap-4">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={r} stroke="rgba(255,255,255,0.15)" strokeWidth="12" fill="none" />
          <motion.circle
            cx="90"
            cy="90"
            r={r}
            stroke={themeTokens.primary}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - percent / 100) }}
            style={{ strokeDasharray: c }}
          />
        </svg>
        <p className="text-3xl font-semibold">{percent}%</p>
      </div>
    );
  }

  if (template === "quote-card") {
    return (
      <div className="rounded-3xl p-6 bg-white/10 border border-white/10 space-y-4">
        <p className="text-2xl leading-relaxed">{quote}</p>
        <p className="text-white/70">余生电量 · {percent}%</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-2">
      <p className="text-white/70">距离终点还有</p>
      <p className="text-6xl font-semibold tracking-tight">{remainingDays}</p>
      <p className="text-white/70">天</p>
    </div>
  );
}
