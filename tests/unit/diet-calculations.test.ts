import { describe, expect, it } from "vitest";

import { bmrMifflin, calculateTargets, type MacroInput } from "@/features/diet/calculations";

const adult: MacroInput = {
  sex: "female",
  age: 28,
  weightKg: 70,
  heightCm: 162,
  activity: "moderate",
  goal: "lose",
  adjustment: 0.2,
};

describe("diet calculations", () => {
  it("computes Mifflin-St Jeor BMR", () => {
    expect(bmrMifflin({ sex: "male", age: 30, weightKg: 80, heightCm: 180 })).toBe(1780);
    expect(bmrMifflin({ sex: "female", age: 30, weightKg: 60, heightCm: 165 })).toBeCloseTo(
      1320.25,
    );
  });

  it("applies a normal deficit within limits", () => {
    const r = calculateTargets(adult);
    expect(r.calories).toBeLessThan(r.tdee);
    expect(r.limits).toEqual([]);
  });

  it("never drops below the calorie floor", () => {
    const r = calculateTargets({ ...adult, activity: "sedentary", adjustment: 0.5 });
    const bmr = 10 * 70 + 6.25 * 162 - 5 * 28 - 161;
    expect(r.calories).toBeGreaterThanOrEqual(Math.max(bmr, 1200));
    expect(r.limits).toContain("floor");
  });

  it("caps weekly loss at ~1% of bodyweight", () => {
    const r = calculateTargets({
      ...adult,
      weightKg: 120,
      activity: "veryActive",
      adjustment: 0.4,
    });
    expect(Math.abs(r.weeklyChangeKg)).toBeLessThanOrEqual(1.2 + 0.01);
    expect(r.limits).toContain("maxLossRate");
  });

  it("gives minors no deficit and flags the coach", () => {
    const r = calculateTargets({ ...adult, age: 16 });
    expect(r.calories).toBe(Math.round(r.tdee / 10) * 10);
    expect(r.limits).toContain("minorNoDeficit");
    expect(r.flagToCoach).toBe(true);
  });
});
