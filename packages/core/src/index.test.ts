import { describe, expect, it } from "vitest";
import {
  formatNumber,
  getElapsedLifeDays,
  getLifeSummary,
  getRemainingLifeDays,
  getRemainingMeals,
  getRemainingPercentage,
  getTotalLifeDays
} from "./index";

describe("life calculation functions", () => {
  it("computes total life days using natural day boundaries", () => {
    expect(getTotalLifeDays("2000-01-01", 80)).toBeGreaterThan(29000);
  });

  it("never returns negative elapsed or remaining days", () => {
    expect(getElapsedLifeDays("2099-01-01", "2026-01-01")).toBe(0);
    expect(getRemainingLifeDays("1900-01-01", 80, "2100-01-01")).toBe(0);
  });

  it("clamps remaining percentage between 0 and 100", () => {
    expect(getRemainingPercentage("2090-01-01", 80, "2026-01-01")).toBe(100);
    expect(getRemainingPercentage("1900-01-01", 80, "2100-01-01")).toBe(0);
  });

  it("never returns negative meals", () => {
    expect(getRemainingMeals("1900-01-01", 80, 3, "2100-01-01")).toBe(0);
    expect(getRemainingMeals("2000-01-01", 80, -2, "2026-01-01")).toBeGreaterThanOrEqual(0);
  });

  it("formats numbers with separators", () => {
    expect(formatNumber(17794)).toBe("17,794");
  });

  it("returns stable summary structure", () => {
    const summary = getLifeSummary({
      birthDate: "1995-06-18",
      expectedLifespanYears: 85,
      mealsPerDay: 3,
      now: "2026-03-25"
    });

    expect(summary).toMatchObject({
      totalLifeDays: expect.any(Number),
      elapsedLifeDays: expect.any(Number),
      remainingLifeDays: expect.any(Number),
      remainingPercentage: expect.any(Number),
      remainingMeals: expect.any(Number),
      formattedRemainingLifeDays: expect.any(String),
      formattedRemainingMeals: expect.any(String)
    });
  });
});
