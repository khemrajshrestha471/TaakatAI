/**
 * Calorie & macro targets (Mifflin-St Jeor) with the safety limits from the spec enforced in code:
 * - never below a BMR-based calorie floor (and an absolute floor per sex),
 * - weekly weight loss capped at ~1% of bodyweight,
 * - minors get no calorie deficit (youth-safe rules); a weight-loss goal is flagged to the coach.
 */

export type Sex = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive";
export type DietGoal = "lose" | "maintain" | "gain";

export const activityFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

/** Absolute minimum daily calories regardless of BMR. */
export const ABSOLUTE_FLOOR: Record<Sex, number> = { male: 1500, female: 1200 };
/** Max share of bodyweight lost per week. */
export const MAX_WEEKLY_LOSS = 0.01;
/** ~kcal in 1 kg of body fat. */
const KCAL_PER_KG = 7700;

export type MacroInput = {
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
  activity: ActivityLevel;
  goal: DietGoal;
  /** Requested change as a fraction of TDEE, e.g. 0.2 = 20% deficit/surplus. */
  adjustment: number;
};

export type MacroResult = {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  weeklyChangeKg: number;
  /** Safety rules that changed the requested target. */
  limits: ("floor" | "maxLossRate" | "minorNoDeficit")[];
  flagToCoach: boolean;
};

export function bmrMifflin({
  sex,
  age,
  weightKg,
  heightCm,
}: Pick<MacroInput, "sex" | "age" | "weightKg" | "heightCm">) {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
}

export function calculateTargets(input: MacroInput): MacroResult {
  const bmr = bmrMifflin(input);
  const tdee = bmr * activityFactors[input.activity];
  const isMinor = input.age < 18;
  const limits: MacroResult["limits"] = [];
  let flagToCoach = false;

  let calories = tdee;
  if (input.goal === "gain") calories = tdee * (1 + Math.min(input.adjustment, 0.2));

  if (input.goal === "lose") {
    if (isMinor) {
      limits.push("minorNoDeficit");
      flagToCoach = true;
    } else {
      calories = tdee * (1 - input.adjustment);
      const maxDeficit = (MAX_WEEKLY_LOSS * input.weightKg * KCAL_PER_KG) / 7;
      if (tdee - calories > maxDeficit) {
        calories = tdee - maxDeficit;
        limits.push("maxLossRate");
      }
      const floor = Math.max(bmr, ABSOLUTE_FLOOR[input.sex]);
      if (calories < floor) {
        calories = floor;
        limits.push("floor");
      }
    }
  }

  // Round to 10 kcal; round UP when clamped to the floor so rounding never undercuts it.
  calories = (limits.includes("floor") ? Math.ceil : Math.round)(calories / 10) * 10;
  const protein = Math.round(input.weightKg * (input.goal === "lose" ? 2.0 : 1.8));
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  const weeklyChangeKg = ((calories - tdee) * 7) / KCAL_PER_KG;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories,
    protein,
    fat,
    carbs,
    weeklyChangeKg: Math.round(weeklyChangeKg * 100) / 100,
    limits,
    flagToCoach,
  };
}
