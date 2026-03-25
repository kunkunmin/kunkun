"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import {
  DEFAULT_MEALS_PER_DAY,
  DEFAULT_EXPECTED_LIFESPAN_YEARS,
  formatNumber,
  getLifeSummary,
  copyByTone,
  type ToneStyle
} from "@yusheng/core";
import { templates, type TemplateKey } from "@yusheng/templates";
import { themeTokens } from "@yusheng/tokens";
import { TemplateCard } from "../components/template-card";

type TabKey = "home" | "components" | "settings";

interface SettingsState {
  birthDate: string;
  expectedLifespanYears: number;
  mealsPerDay: number;
  toneStyle: ToneStyle;
  defaultTemplate: TemplateKey;
}

const SETTINGS_STORAGE_KEY = "yusheng_settings_v2";

const DEFAULT_SETTINGS: SettingsState = {
  birthDate: "1998-01-01",
  expectedLifespanYears: DEFAULT_EXPECTED_LIFESPAN_YEARS,
  mealsPerDay: DEFAULT_MEALS_PER_DAY,
  toneStyle: "poetic",
  defaultTemplate: "battery"
};

export default function Page() {
  const [tab, setTab] = useState<TabKey>("home");
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [currentTemplate, setCurrentTemplate] = useState<TemplateKey>(DEFAULT_SETTINGS.defaultTemplate);
  const [hydrated, setHydrated] = useState(false);
  const activeSlideRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<number>();

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<SettingsState>;
        const next = {
          ...DEFAULT_SETTINGS,
          ...parsed
        } as SettingsState;
        setSettings(next);
        setCurrentTemplate(next.defaultTemplate);
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  const currentIndex = useMemo(
    () => templates.findIndex((template) => template.key === currentTemplate),
    [currentTemplate]
  );

  const summary = useMemo(
    () =>
      getLifeSummary({
        birthDate: settings.birthDate,
        expectedLifespanYears: settings.expectedLifespanYears,
        mealsPerDay: settings.mealsPerDay
      }),
    [settings.birthDate, settings.expectedLifespanYears, settings.mealsPerDay]
  );

  const textCopy = useMemo(
    () => copyByTone(settings.toneStyle, summary.remainingPercentage, formatNumber(summary.remainingLifeDays)),
    [settings.toneStyle, summary.remainingPercentage, summary.remainingLifeDays]
  );

  async function exportCard() {
    if (!activeSlideRef.current) return;

    const dataUrl = await toPng(activeSlideRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      canvasWidth: 1080,
      canvasHeight: 1920,
      backgroundColor: themeTokens.backgroundDark
    });

    const link = document.createElement("a");
    link.download = `余生电量-${currentTemplate}-9x16.png`;
    link.href = dataUrl;
    link.click();
  }

  function onStartPress() {
    pressTimer.current = window.setTimeout(exportCard, 450);
  }

  function onEndPress() {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  }

  return (
    <main
      className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${themeTokens.background} 0%, ${themeTokens.backgroundDark} 100%)`,
        color: themeTokens.textPrimary
      }}
    >
      <section className="px-5 pt-8">
        <h1 className="text-[30px] font-semibold tracking-[0.02em]">余生电量</h1>
        <p className="mt-2 text-sm" style={{ color: themeTokens.textSecondary }}>
          左右滑动切换模板，长按导出
        </p>
      </section>

      {tab === "home" && (
        <section className="mt-5 flex-1 px-5">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              drag="x"
              dragConstraints={{ left: -((templates.length - 1) * 342), right: 0 }}
              dragElastic={0.05}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) {
                  setCurrentTemplate(templates[Math.min(currentIndex + 1, templates.length - 1)].key);
                }
                if (info.offset.x > 70) {
                  setCurrentTemplate(templates[Math.max(currentIndex - 1, 0)].key);
                }
              }}
              animate={{ x: -(currentIndex * 342) }}
            >
              {templates.map((item, idx) => {
                const active = idx === currentIndex;
                return (
                  <motion.article
                    key={item.key}
                    className="w-[330px] shrink-0 pr-3"
                    animate={{ opacity: active ? 1 : 0.52, scale: active ? 1 : 0.97 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div
                      ref={active ? activeSlideRef : undefined}
                      className="aspect-[9/16] w-full rounded-[28px] border border-white/10 p-6"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                      onTouchStart={onStartPress}
                      onTouchEnd={onEndPress}
                      onTouchCancel={onEndPress}
                      onMouseDown={onStartPress}
                      onMouseUp={onEndPress}
                      onMouseLeave={onEndPress}
                    >
                      <TemplateCard
                        template={item.key}
                        percent={summary.remainingPercentage}
                        remainingDays={formatNumber(summary.remainingLifeDays)}
                        quote={textCopy[3]}
                      />
                    </div>
                    <p className="mt-3 text-sm" style={{ color: themeTokens.textSecondary }}>
                      {item.title}
                    </p>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {templates.map((item) => (
              <button
                key={item.key}
                aria-label={`切换到${item.title}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: item.key === currentTemplate ? 22 : 8,
                  background: item.key === currentTemplate ? themeTokens.primary : "rgba(255,255,255,0.22)"
                }}
                onClick={() => setCurrentTemplate(item.key)}
              />
            ))}
          </div>

          <button
            className="mt-4 w-full rounded-2xl py-3 text-sm font-medium"
            style={{ background: themeTokens.primary, color: themeTokens.backgroundDark }}
            onClick={exportCard}
          >
            导出当前模板 PNG（9:16）
          </button>
        </section>
      )}

      {tab === "components" && (
        <section className="mt-6 flex-1 px-5 space-y-3">
          {[textCopy[0], textCopy[1], `剩余餐数 ${formatNumber(summary.remainingMeals)}`].map((line) => (
            <div key={line} className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.08)" }}>
              {line}
            </div>
          ))}
        </section>
      )}

      {tab === "settings" && (
        <section className="mt-5 flex-1 space-y-3 px-5 pb-6">
          <Field label="出生日期">
            <input
              type="date"
              value={settings.birthDate}
              onChange={(event) => setSettings((prev) => ({ ...prev, birthDate: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-transparent p-3 text-sm"
            />
          </Field>

          <Field label="预期寿命（年）">
            <input
              type="number"
              min={1}
              max={150}
              value={settings.expectedLifespanYears}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  expectedLifespanYears: Math.max(1, Number(event.target.value) || DEFAULT_EXPECTED_LIFESPAN_YEARS)
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-transparent p-3 text-sm"
            />
          </Field>

          <Field label="每日用餐次数">
            <input
              type="number"
              min={1}
              max={10}
              value={settings.mealsPerDay}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  mealsPerDay: Math.max(1, Number(event.target.value) || DEFAULT_MEALS_PER_DAY)
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-transparent p-3 text-sm"
            />
          </Field>

          <Field label="语气风格">
            <select
              value={settings.toneStyle}
              onChange={(event) => setSettings((prev) => ({ ...prev, toneStyle: event.target.value as ToneStyle }))}
              className="w-full rounded-xl border border-white/10 bg-transparent p-3 text-sm"
            >
              <option className="text-black" value="calm">平静</option>
              <option className="text-black" value="firm">坚定</option>
              <option className="text-black" value="poetic">诗意</option>
            </select>
          </Field>

          <Field label="默认模板">
            <select
              value={settings.defaultTemplate}
              onChange={(event) => {
                const value = event.target.value as TemplateKey;
                setSettings((prev) => ({ ...prev, defaultTemplate: value }));
                setCurrentTemplate(value);
              }}
              className="w-full rounded-xl border border-white/10 bg-transparent p-3 text-sm"
            >
              {templates.map((item) => (
                <option key={item.key} value={item.key} className="text-black">
                  {item.title}
                </option>
              ))}
            </select>
          </Field>
        </section>
      )}

      <nav
        className="grid grid-cols-3 border-t border-white/10"
        style={{ background: "rgba(10,44,33,0.92)", backdropFilter: "blur(8px)" }}
      >
        {[
          { key: "home", label: "首页" },
          { key: "components", label: "组件" },
          { key: "settings", label: "设置" }
        ].map((item) => (
          <button
            key={item.key}
            className="py-4 text-sm"
            style={{ color: item.key === tab ? themeTokens.primary : themeTokens.textSecondary }}
            onClick={() => setTab(item.key as TabKey)}
          >
            {item.label}
          </button>
        ))}
      </nav>

    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <p className="text-sm" style={{ color: themeTokens.textSecondary }}>
        {label}
      </p>
      {children}
    </label>
  );
}
