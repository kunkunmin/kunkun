import dayjs, { type ConfigType, type Dayjs } from "dayjs";

export interface LifeSummaryInput {
  birthDate: ConfigType;
  expectedLifespanYears?: number;
  mealsPerDay?: number;
  now?: ConfigType;
}

export interface LifeSummary {
  totalLifeDays: number;
  elapsedLifeDays: number;
  remainingLifeDays: number;
  remainingPercentage: number;
  remainingMeals: number;
  formattedRemainingLifeDays: string;
  formattedRemainingMeals: string;
}

export const DEFAULT_EXPECTED_LIFESPAN_YEARS = 80;
export const DEFAULT_MEALS_PER_DAY = 3;

function toStartOfNaturalDay(value: ConfigType): Dayjs {
  return dayjs(value).startOf("day");
}

function clampPositiveInteger(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(Math.trunc(value), 0);
}

function getLifespanEndDate(birthDate: ConfigType, expectedLifespanYears: number): Dayjs {
  return toStartOfNaturalDay(birthDate).add(expectedLifespanYears, "year");
}

export function getTotalLifeDays(birthDate: ConfigType, expectedLifespanYears: number): number {
  const birth = toStartOfNaturalDay(birthDate);
  const years = clampPositiveInteger(expectedLifespanYears, DEFAULT_EXPECTED_LIFESPAN_YEARS);
  const end = birth.add(years, "year");
  return Math.max(end.diff(birth, "day"), 1);
}

export function getElapsedLifeDays(birthDate: ConfigType, now: ConfigType = dayjs()): number {
  const birth = toStartOfNaturalDay(birthDate);
  const today = toStartOfNaturalDay(now);
  return Math.max(today.diff(birth, "day"), 0);
}

export function getRemainingLifeDays(
  birthDate: ConfigType,
  expectedLifespanYears: number,
  now: ConfigType = dayjs()
): number {
  const today = toStartOfNaturalDay(now);
  const lifespanEnd = getLifespanEndDate(
    birthDate,
    clampPositiveInteger(expectedLifespanYears, DEFAULT_EXPECTED_LIFESPAN_YEARS)
  );

  return Math.max(lifespanEnd.diff(today, "day"), 0);
}

export function getRemainingPercentage(
  birthDate: ConfigType,
  expectedLifespanYears: number,
  now: ConfigType = dayjs()
): number {
  const total = getTotalLifeDays(birthDate, expectedLifespanYears);
  const remaining = getRemainingLifeDays(birthDate, expectedLifespanYears, now);
  const raw = Math.round((remaining / total) * 100);
  return Math.min(Math.max(raw, 0), 100);
}

export function getRemainingMeals(
  birthDate: ConfigType,
  expectedLifespanYears: number,
  mealsPerDay: number,
  now: ConfigType = dayjs()
): number {
  const safeMealsPerDay = clampPositiveInteger(mealsPerDay, DEFAULT_MEALS_PER_DAY);
  const remainingDays = getRemainingLifeDays(birthDate, expectedLifespanYears, now);
  return Math.max(remainingDays * safeMealsPerDay, 0);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("zh-CN").format(value);
}

export function getLifeSummary(input: LifeSummaryInput): LifeSummary {
  const now = input.now ?? dayjs();
  const expectedLifespanYears = clampPositiveInteger(
    input.expectedLifespanYears ?? DEFAULT_EXPECTED_LIFESPAN_YEARS,
    DEFAULT_EXPECTED_LIFESPAN_YEARS
  );
  const mealsPerDay = clampPositiveInteger(input.mealsPerDay ?? DEFAULT_MEALS_PER_DAY, DEFAULT_MEALS_PER_DAY);

  const totalLifeDays = getTotalLifeDays(input.birthDate, expectedLifespanYears);
  const elapsedLifeDays = getElapsedLifeDays(input.birthDate, now);
  const remainingLifeDays = getRemainingLifeDays(input.birthDate, expectedLifespanYears, now);
  const remainingPercentage = getRemainingPercentage(input.birthDate, expectedLifespanYears, now);
  const remainingMeals = getRemainingMeals(input.birthDate, expectedLifespanYears, mealsPerDay, now);

  return {
    totalLifeDays,
    elapsedLifeDays,
    remainingLifeDays,
    remainingPercentage,
    remainingMeals,
    formattedRemainingLifeDays: formatNumber(remainingLifeDays),
    formattedRemainingMeals: formatNumber(remainingMeals)
  };
}


export type ToneStyle = "calm" | "firm" | "poetic";

export interface UserSettings {
  birthDate: string;
  expectedLifespan: number;
  mealsPerDay: number;
  toneStyle: ToneStyle;
  defaultTemplate: string;
}

export interface LifeMetrics {
  ageDays: number;
  lifespanDays: number;
  remainingDays: number;
  remainingPercent: number;
  mealsRemaining: number;
}

export const DEFAULT_SETTINGS: UserSettings = {
  birthDate: "1998-01-01",
  expectedLifespan: DEFAULT_EXPECTED_LIFESPAN_YEARS,
  mealsPerDay: DEFAULT_MEALS_PER_DAY,
  toneStyle: "calm",
  defaultTemplate: "battery"
};

export function calculateLifeMetrics(
  settings: Pick<UserSettings, "birthDate" | "expectedLifespan" | "mealsPerDay">,
  now: ConfigType = dayjs()
): LifeMetrics {
  const summary = getLifeSummary({
    birthDate: settings.birthDate,
    expectedLifespanYears: settings.expectedLifespan,
    mealsPerDay: settings.mealsPerDay,
    now
  });

  return {
    ageDays: summary.elapsedLifeDays,
    lifespanDays: summary.totalLifeDays,
    remainingDays: summary.remainingLifeDays,
    remainingPercent: summary.remainingPercentage,
    mealsRemaining: summary.remainingMeals
  };
}

export function copyByTone(tone: ToneStyle, percent: number, days: string): string[] {
  const shared = [`你还剩 ${percent}%`, `距离终点还有 ${days} 天`];

  if (tone === "firm") {
    return [...shared, "你的时间仍在前方", "别等答案，先做选择"];
  }

  if (tone === "poetic") {
    return [...shared, "你的时间仍在前方", "余生不是答案，选择才是"];
  }

  return [...shared, "你的时间仍在前方", "今天也值得慢慢走"];
}
