/**
 * Sample data that powers the portal screens until the real data layer lands
 * (auth in Phase 2, then training/diet/check-ins/etc.). Every page that uses it shows a
 * "Sample data" badge. Replace calls to these functions with scoped repository queries.
 *
 * Coach/client-generated content (names, messages, notes) is data, not UI copy, so it is not
 * in the i18n message files. Exercise and food names are bilingual per the spec.
 */

export type L10n = { en: string; ne: string };

export function localized(text: L10n, locale: string) {
  return locale === "ne" ? text.ne : text.en;
}

const DAY = 86_400_000;

/** Deterministic pseudo-random noise so server and client render the same numbers. */
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function round(n: number, digits = 1) {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function daysAgo(now: Date, days: number) {
  return new Date(now.getTime() - days * DAY).toISOString();
}

// ---------------------------------------------------------------------------
// Exercises & foods
// ---------------------------------------------------------------------------

export const exercises = {
  bench: { en: "Bench press", ne: "बेन्च प्रेस" },
  row: { en: "Barbell row", ne: "बारबेल रो" },
  ohp: { en: "Overhead press", ne: "ओभरहेड प्रेस" },
  pulldown: { en: "Lat pulldown", ne: "ल्याट पुलडाउन" },
  curl: { en: "Dumbbell curl", ne: "डम्बेल कर्ल" },
  pushdown: { en: "Triceps pushdown", ne: "ट्राइसेप्स पुसडाउन" },
  squat: { en: "Back squat", ne: "ब्याक स्क्वाट" },
  rdl: { en: "Romanian deadlift", ne: "रोमानियन डेडलिफ्ट" },
  deadlift: { en: "Deadlift", ne: "डेडलिफ्ट" },
  legPress: { en: "Leg press", ne: "लेग प्रेस" },
  lunge: { en: "Walking lunge", ne: "वाकिङ लन्ज" },
  calf: { en: "Standing calf raise", ne: "स्ट्यान्डिङ काफ रेज" },
  plank: { en: "Plank", ne: "प्ल्याङ्क" },
} satisfies Record<string, L10n>;

export type ExerciseKey = keyof typeof exercises;

export type PlannedExercise = {
  key: ExerciseKey;
  sets: number;
  reps: string;
  rpe: number;
  restSec: number;
  tempo?: string;
  /** Last session's top set, shown inline in the logger. */
  previous?: { weight: number; reps: number };
};

export type ProgramDay = { id: string; name: L10n; focus: L10n; exercises: PlannedExercise[] };

export const currentProgram = {
  name: { en: "Upper / Lower — Fat loss", ne: "अपर / लोअर — बोसो घटाउने" },
  week: 5,
  totalWeeks: 12,
  days: [
    {
      id: "upper-a",
      name: { en: "Upper A", ne: "अपर A" },
      focus: { en: "Chest & back strength", ne: "छाती र ढाडको बल" },
      exercises: [
        {
          key: "bench",
          sets: 4,
          reps: "6–8",
          rpe: 8,
          restSec: 150,
          tempo: "3-1-1",
          previous: { weight: 40, reps: 8 },
        },
        {
          key: "row",
          sets: 4,
          reps: "8–10",
          rpe: 8,
          restSec: 120,
          previous: { weight: 35, reps: 10 },
        },
        {
          key: "ohp",
          sets: 3,
          reps: "8–10",
          rpe: 7,
          restSec: 120,
          previous: { weight: 22.5, reps: 9 },
        },
        {
          key: "pulldown",
          sets: 3,
          reps: "10–12",
          rpe: 8,
          restSec: 90,
          previous: { weight: 40, reps: 12 },
        },
        {
          key: "curl",
          sets: 3,
          reps: "12–15",
          rpe: 9,
          restSec: 60,
          previous: { weight: 8, reps: 14 },
        },
        {
          key: "pushdown",
          sets: 3,
          reps: "12–15",
          rpe: 9,
          restSec: 60,
          previous: { weight: 20, reps: 15 },
        },
      ],
    },
    {
      id: "lower-a",
      name: { en: "Lower A", ne: "लोअर A" },
      focus: { en: "Squat focus", ne: "स्क्वाटमा केन्द्रित" },
      exercises: [
        {
          key: "squat",
          sets: 4,
          reps: "5–7",
          rpe: 8,
          restSec: 180,
          previous: { weight: 60, reps: 6 },
        },
        {
          key: "rdl",
          sets: 3,
          reps: "8–10",
          rpe: 8,
          restSec: 150,
          previous: { weight: 50, reps: 10 },
        },
        {
          key: "legPress",
          sets: 3,
          reps: "10–12",
          rpe: 8,
          restSec: 120,
          previous: { weight: 100, reps: 12 },
        },
        {
          key: "calf",
          sets: 4,
          reps: "12–15",
          rpe: 9,
          restSec: 60,
          previous: { weight: 40, reps: 15 },
        },
        { key: "plank", sets: 3, reps: "45s", rpe: 7, restSec: 60 },
      ],
    },
    {
      id: "upper-b",
      name: { en: "Upper B", ne: "अपर B" },
      focus: { en: "Shoulders & arms", ne: "काँध र पाखुरा" },
      exercises: [
        {
          key: "ohp",
          sets: 4,
          reps: "6–8",
          rpe: 8,
          restSec: 150,
          previous: { weight: 25, reps: 7 },
        },
        {
          key: "pulldown",
          sets: 4,
          reps: "8–10",
          rpe: 8,
          restSec: 120,
          previous: { weight: 45, reps: 9 },
        },
        {
          key: "bench",
          sets: 3,
          reps: "10–12",
          rpe: 7,
          restSec: 120,
          previous: { weight: 32.5, reps: 12 },
        },
        {
          key: "curl",
          sets: 3,
          reps: "10–12",
          rpe: 9,
          restSec: 60,
          previous: { weight: 10, reps: 11 },
        },
        {
          key: "pushdown",
          sets: 3,
          reps: "10–12",
          rpe: 9,
          restSec: 60,
          previous: { weight: 25, reps: 12 },
        },
      ],
    },
    {
      id: "lower-b",
      name: { en: "Lower B", ne: "लोअर B" },
      focus: { en: "Hinge focus", ne: "हिन्जमा केन्द्रित" },
      exercises: [
        {
          key: "deadlift",
          sets: 3,
          reps: "4–6",
          rpe: 8,
          restSec: 180,
          previous: { weight: 80, reps: 5 },
        },
        {
          key: "lunge",
          sets: 3,
          reps: "10/leg",
          rpe: 8,
          restSec: 90,
          previous: { weight: 12, reps: 10 },
        },
        {
          key: "legPress",
          sets: 3,
          reps: "12–15",
          rpe: 8,
          restSec: 90,
          previous: { weight: 90, reps: 15 },
        },
        {
          key: "calf",
          sets: 4,
          reps: "15–20",
          rpe: 9,
          restSec: 45,
          previous: { weight: 35, reps: 18 },
        },
      ],
    },
  ] as ProgramDay[],
};

export const foods = {
  oats: { en: "Oats", ne: "ओट्स" },
  eggs: { en: "Boiled eggs", ne: "उसिनेको अण्डा" },
  banana: { en: "Banana", ne: "केरा" },
  rice: { en: "Rice (bhat)", ne: "भात" },
  dal: { en: "Dal", ne: "दाल" },
  chickenCurry: { en: "Chicken curry", ne: "कुखुराको मासु" },
  saag: { en: "Saag", ne: "साग" },
  curd: { en: "Curd", ne: "दही" },
  chiura: { en: "Chiura", ne: "चिउरा" },
  roti: { en: "Roti", ne: "रोटी" },
  paneer: { en: "Paneer", ne: "पनिर" },
  mixedVeg: { en: "Mixed vegetables", ne: "मिसाइएको तरकारी" },
  momo: { en: "Chicken momo (10 pcs)", ne: "कुखुराको मःम (१० वटा)" },
  dhido: { en: "Dhido", ne: "ढिँडो" },
} satisfies Record<string, L10n>;

export type FoodKey = keyof typeof foods;

export type MealItem = {
  food: FoodKey;
  qty: L10n;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};
export type Meal = { id: string; name: L10n; time: string; items: MealItem[]; swap?: L10n };

export const dietPlan = {
  targets: { kcal: 1850, protein: 140, carbs: 190, fat: 55, waterMl: 3000 },
  meals: [
    {
      id: "breakfast",
      name: { en: "Breakfast", ne: "बिहानको खाना" },
      time: "07:30",
      items: [
        {
          food: "oats",
          qty: { en: "60 g", ne: "६० ग्राम" },
          kcal: 225,
          protein: 8,
          carbs: 40,
          fat: 4,
        },
        {
          food: "eggs",
          qty: { en: "3 whole", ne: "३ वटा" },
          kcal: 215,
          protein: 19,
          carbs: 1,
          fat: 15,
        },
        {
          food: "banana",
          qty: { en: "1 medium", ne: "१ मध्यम" },
          kcal: 105,
          protein: 1,
          carbs: 27,
          fat: 0,
        },
      ],
      swap: {
        en: "Swap oats for 50 g chiura + 200 g curd.",
        ne: "ओट्सको सट्टा ५० ग्राम चिउरा + २०० ग्राम दही।",
      },
    },
    {
      id: "lunch",
      name: { en: "Lunch — Dal bhat", ne: "दिउँसो — दाल भात" },
      time: "12:30",
      items: [
        {
          food: "rice",
          qty: { en: "150 g cooked", ne: "१५० ग्राम पकाएको" },
          kcal: 195,
          protein: 4,
          carbs: 42,
          fat: 0,
        },
        {
          food: "dal",
          qty: { en: "1 bowl", ne: "१ कचौरा" },
          kcal: 150,
          protein: 9,
          carbs: 22,
          fat: 3,
        },
        {
          food: "chickenCurry",
          qty: { en: "150 g", ne: "१५० ग्राम" },
          kcal: 265,
          protein: 36,
          carbs: 5,
          fat: 11,
        },
        { food: "saag", qty: { en: "1 cup", ne: "१ कप" }, kcal: 45, protein: 3, carbs: 5, fat: 2 },
      ],
      swap: {
        en: "Vegetarian: replace chicken with 150 g paneer or soya chunks.",
        ne: "शाकाहारी: कुखुराको सट्टा १५० ग्राम पनिर वा सोयाबडी।",
      },
    },
    {
      id: "snack",
      name: { en: "Snack", ne: "खाजा" },
      time: "16:30",
      items: [
        {
          food: "curd",
          qty: { en: "200 g", ne: "२०० ग्राम" },
          kcal: 125,
          protein: 8,
          carbs: 9,
          fat: 6,
        },
        {
          food: "chiura",
          qty: { en: "40 g", ne: "४० ग्राम" },
          kcal: 145,
          protein: 3,
          carbs: 31,
          fat: 1,
        },
      ],
    },
    {
      id: "dinner",
      name: { en: "Dinner", ne: "बेलुकीको खाना" },
      time: "19:30",
      items: [
        {
          food: "roti",
          qty: { en: "2 medium", ne: "२ मध्यम" },
          kcal: 210,
          protein: 6,
          carbs: 36,
          fat: 4,
        },
        {
          food: "paneer",
          qty: { en: "100 g", ne: "१०० ग्राम" },
          kcal: 265,
          protein: 18,
          carbs: 4,
          fat: 20,
        },
        {
          food: "mixedVeg",
          qty: { en: "1.5 cups", ne: "१.५ कप" },
          kcal: 90,
          protein: 4,
          carbs: 14,
          fat: 2,
        },
      ],
      swap: {
        en: "Eating out? 10 steamed chicken momo fit this slot — skip the fried ones.",
        ne: "बाहिर खाँदै हुनुहुन्छ? १० वटा स्टिम कुखुराको मःम मिल्छ — तारेको नखानुहोस्।",
      },
    },
  ] as Meal[],
  supplements: [
    { id: "whey", name: { en: "Whey protein (1 scoop)", ne: "ह्वे प्रोटिन (१ स्कूप)" } },
    { id: "creatine", name: { en: "Creatine 5 g", ne: "क्रिएटिन ५ ग्राम" } },
    { id: "vitd", name: { en: "Vitamin D", ne: "भिटामिन D" } },
  ],
};

export function mealTotals(meal: Meal) {
  return meal.items.reduce(
    (acc, i) => ({
      kcal: acc.kcal + i.kcal,
      protein: acc.protein + i.protein,
      carbs: acc.carbs + i.carbs,
      fat: acc.fat + i.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

// ---------------------------------------------------------------------------
// Client (the signed-in client in /app)
// ---------------------------------------------------------------------------

export const demoClient = {
  name: "Sita Gurung",
  coachName: "Aarav Shrestha",
  goal: "fatLoss" as const,
  startWeight: 72,
  targetWeight: 60,
  streakDays: 12,
  unreadMessages: 2,
  checkInDay: 6, // Saturday
  packageName: { en: "3-month transformation", ne: "३ महिने रूपान्तरण" },
};

/** 84 days of daily weigh-ins with a 7-day moving average. */
export function weightSeries(now: Date) {
  const days = 84;
  const raw = Array.from({ length: days }, (_, i) => {
    const trend = 72 - (5.6 * i) / (days - 1);
    return round(trend + (noise(i + 1) - 0.5) * 1.2);
  });
  return raw.map((weight, i) => {
    const window = raw.slice(Math.max(0, i - 6), i + 1);
    return {
      date: daysAgo(now, days - 1 - i),
      weight,
      average: round(window.reduce((a, b) => a + b, 0) / window.length, 2),
    };
  });
}

/** Estimated 1RM per week for the three main lifts. */
export function strengthSeries() {
  return Array.from({ length: 12 }, (_, w) => ({
    week: w + 1,
    squat: round(70 + w * 2.1 + (noise(w + 40) - 0.5) * 2),
    bench: round(45 + w * 1.1 + (noise(w + 60) - 0.5) * 1.5),
    deadlift: round(90 + w * 2.6 + (noise(w + 80) - 0.5) * 2.5),
  }));
}

export const measurements = [
  { key: "waist", start: 84, current: 77.5 },
  { key: "hips", start: 101, current: 96 },
  { key: "chest", start: 92, current: 90 },
  { key: "arms", start: 29, current: 29.5 },
  { key: "thighs", start: 58, current: 55 },
] as const;

export function personalRecords(now: Date) {
  return [
    { exercise: "deadlift" as ExerciseKey, weight: 80, reps: 5, date: daysAgo(now, 3) },
    { exercise: "squat" as ExerciseKey, weight: 62.5, reps: 6, date: daysAgo(now, 5) },
    { exercise: "bench" as ExerciseKey, weight: 42.5, reps: 6, date: daysAgo(now, 8) },
    { exercise: "row" as ExerciseKey, weight: 37.5, reps: 10, date: daysAgo(now, 15) },
  ];
}

export function checkInHistory(now: Date) {
  return Array.from({ length: 8 }, (_, i) => ({
    weekOf: daysAgo(now, 7 * (i + 1)),
    weight: round(66.6 + i * 0.55),
    training: Math.round(80 + noise(i + 7) * 20),
    diet: Math.round(72 + noise(i + 17) * 25),
    status: (i === 0 ? "submitted" : "reviewed") as "submitted" | "reviewed",
  }));
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

export type ChatMessage = {
  id: string;
  from: "coach" | "client" | "ai";
  text: string;
  at: string;
  escalated?: boolean;
};

export function coachThread(now: Date): ChatMessage[] {
  return [
    {
      id: "1",
      from: "coach",
      text: "Great work on the deadlift PR this week! 💪 How did the lower back feel afterwards?",
      at: daysAgo(now, 2.2),
    },
    {
      id: "2",
      from: "client",
      text: "Felt fine, just a little tight the next morning. Should I keep the same weight next session?",
      at: daysAgo(now, 2.1),
    },
    {
      id: "3",
      from: "coach",
      text: "Keep 80 kg and aim for a clean 3×5 first. Film your last set and send it in Form Check so I can look at your hip hinge.",
      at: daysAgo(now, 2),
    },
    {
      id: "4",
      from: "client",
      text: "Will do. Also — is it okay to have momo on Saturday with friends?",
      at: daysAgo(now, 0.3),
    },
    {
      id: "5",
      from: "coach",
      text: "Absolutely. Go for steamed chicken momo, and keep lunch a bit lighter that day. Enjoy it!",
      at: daysAgo(now, 0.2),
    },
  ];
}

export function aiThread(now: Date): ChatMessage[] {
  return [
    {
      id: "a1",
      from: "client",
      text: "How much water should I drink on training days?",
      at: daysAgo(now, 1),
    },
    {
      id: "a2",
      from: "ai",
      text: "Your plan targets 3 litres a day. On training days, add roughly 500 ml for each hour of training, and sip during your sessions. Your coach can adjust this if you train in hot conditions.",
      at: daysAgo(now, 1),
    },
    {
      id: "a3",
      from: "client",
      text: "My knee hurts when I squat. What should I do?",
      at: daysAgo(now, 0.5),
    },
    {
      id: "a4",
      from: "ai",
      text: "I can't assess pain or injuries. Please stop the exercise that causes pain and see a doctor or physiotherapist if it continues. I've flagged this to your coach so they can review your program.",
      at: daysAgo(now, 0.5),
      escalated: true,
    },
  ];
}

// ---------------------------------------------------------------------------
// Coach
// ---------------------------------------------------------------------------

export type ClientStatus = "active" | "paused" | "expired" | "lead";
export type Goal =
  "fatLoss" | "muscleGain" | "recomposition" | "strength" | "contestPrep" | "generalFitness";

export type CoachClient = {
  id: string;
  name: string;
  goal: Goal;
  status: ClientStatus;
  adherence: number;
  lastCheckInDays: number | null;
  lastLoginDays: number;
  coach: string;
  isMinor: boolean;
  weightChange: number;
  packageEndsInDays: number | null;
  healthFlag: boolean;
};

export const coachClients: CoachClient[] = [
  {
    id: "c1",
    name: "Sita Gurung",
    goal: "fatLoss",
    status: "active",
    adherence: 92,
    lastCheckInDays: 1,
    lastLoginDays: 0,
    coach: "Aarav Shrestha",
    isMinor: false,
    weightChange: -5.4,
    packageEndsInDays: 41,
    healthFlag: false,
  },
  {
    id: "c2",
    name: "Bikash Thapa",
    goal: "muscleGain",
    status: "active",
    adherence: 85,
    lastCheckInDays: 2,
    lastLoginDays: 1,
    coach: "Aarav Shrestha",
    isMinor: false,
    weightChange: 2.1,
    packageEndsInDays: 12,
    healthFlag: false,
  },
  {
    id: "c3",
    name: "Anish Tamang",
    goal: "strength",
    status: "active",
    adherence: 88,
    lastCheckInDays: 3,
    lastLoginDays: 0,
    coach: "Aarav Shrestha",
    isMinor: true,
    weightChange: 1.2,
    packageEndsInDays: 64,
    healthFlag: false,
  },
  {
    id: "c4",
    name: "Priya Maharjan",
    goal: "recomposition",
    status: "active",
    adherence: 54,
    lastCheckInDays: 15,
    lastLoginDays: 9,
    coach: "Aarav Shrestha",
    isMinor: false,
    weightChange: -0.3,
    packageEndsInDays: 20,
    healthFlag: true,
  },
  {
    id: "c5",
    name: "Rohan Karki",
    goal: "fatLoss",
    status: "active",
    adherence: 78,
    lastCheckInDays: 6,
    lastLoginDays: 2,
    coach: "Nisha Rai",
    isMinor: false,
    weightChange: -3.2,
    packageEndsInDays: 5,
    healthFlag: false,
  },
  {
    id: "c6",
    name: "Emily Carter",
    goal: "generalFitness",
    status: "active",
    adherence: 95,
    lastCheckInDays: 1,
    lastLoginDays: 0,
    coach: "Nisha Rai",
    isMinor: false,
    weightChange: -1.1,
    packageEndsInDays: 88,
    healthFlag: false,
  },
  {
    id: "c7",
    name: "Suman Adhikari",
    goal: "contestPrep",
    status: "active",
    adherence: 97,
    lastCheckInDays: 1,
    lastLoginDays: 0,
    coach: "Aarav Shrestha",
    isMinor: false,
    weightChange: -6.8,
    packageEndsInDays: 30,
    healthFlag: false,
  },
  {
    id: "c8",
    name: "Kabita Lama",
    goal: "fatLoss",
    status: "paused",
    adherence: 40,
    lastCheckInDays: 22,
    lastLoginDays: 18,
    coach: "Nisha Rai",
    isMinor: false,
    weightChange: -2.0,
    packageEndsInDays: 45,
    healthFlag: false,
  },
  {
    id: "c9",
    name: "Dipesh Shah",
    goal: "muscleGain",
    status: "expired",
    adherence: 70,
    lastCheckInDays: 35,
    lastLoginDays: 30,
    coach: "Aarav Shrestha",
    isMinor: false,
    weightChange: 3.4,
    packageEndsInDays: null,
    healthFlag: false,
  },
  {
    id: "c10",
    name: "Aayusha Poudel",
    goal: "generalFitness",
    status: "active",
    adherence: 81,
    lastCheckInDays: 4,
    lastLoginDays: 1,
    coach: "Nisha Rai",
    isMinor: true,
    weightChange: 0.4,
    packageEndsInDays: 70,
    healthFlag: false,
  },
  {
    id: "c11",
    name: "James Miller",
    goal: "strength",
    status: "lead",
    adherence: 0,
    lastCheckInDays: null,
    lastLoginDays: 0,
    coach: "Aarav Shrestha",
    isMinor: false,
    weightChange: 0,
    packageEndsInDays: null,
    healthFlag: false,
  },
  {
    id: "c12",
    name: "Manisha KC",
    goal: "recomposition",
    status: "lead",
    adherence: 0,
    lastCheckInDays: null,
    lastLoginDays: 1,
    coach: "Nisha Rai",
    isMinor: false,
    weightChange: 0,
    packageEndsInDays: null,
    healthFlag: true,
  },
];

/** At risk = active + (missed check-in > 10 days OR adherence < 60 OR no login in 7 days). */
export function isAtRisk(c: CoachClient) {
  return (
    c.status === "active" &&
    ((c.lastCheckInDays ?? 0) > 10 || c.adherence < 60 || c.lastLoginDays > 7)
  );
}

export type QueueItem = {
  id: string;
  kind: "checkIn" | "formCheck" | "message" | "atRisk" | "application" | "expiring";
  client: string;
  isMinor: boolean;
  at: string;
  priority: "high" | "medium" | "low";
};

export function priorityQueue(now: Date): QueueItem[] {
  return [
    {
      id: "q1",
      kind: "atRisk",
      client: "Priya Maharjan",
      isMinor: false,
      at: daysAgo(now, 15),
      priority: "high",
    },
    {
      id: "q2",
      kind: "checkIn",
      client: "Sita Gurung",
      isMinor: false,
      at: daysAgo(now, 1),
      priority: "high",
    },
    {
      id: "q3",
      kind: "formCheck",
      client: "Anish Tamang",
      isMinor: true,
      at: daysAgo(now, 0.4),
      priority: "high",
    },
    {
      id: "q4",
      kind: "expiring",
      client: "Rohan Karki",
      isMinor: false,
      at: daysAgo(now, 0),
      priority: "medium",
    },
    {
      id: "q5",
      kind: "checkIn",
      client: "Suman Adhikari",
      isMinor: false,
      at: daysAgo(now, 1),
      priority: "medium",
    },
    {
      id: "q6",
      kind: "message",
      client: "Bikash Thapa",
      isMinor: false,
      at: daysAgo(now, 0.1),
      priority: "medium",
    },
    {
      id: "q7",
      kind: "application",
      client: "James Miller",
      isMinor: false,
      at: daysAgo(now, 0.6),
      priority: "low",
    },
  ];
}

export function upcomingCalls(now: Date) {
  const inHours = (h: number) => new Date(now.getTime() + h * 3_600_000).toISOString();
  return [
    {
      id: "k1",
      client: "Bikash Thapa",
      at: inHours(5),
      durationMin: 30,
      topic: { en: "Squat form review", ne: "स्क्वाट फर्म समीक्षा" },
      isMinor: false,
      status: "confirmed" as const,
    },
    {
      id: "k2",
      client: "Anish Tamang",
      at: inHours(28),
      durationMin: 20,
      topic: { en: "Monthly progress chat", ne: "मासिक प्रगति कुराकानी" },
      isMinor: true,
      status: "confirmed" as const,
    },
    {
      id: "k3",
      client: "Emily Carter",
      at: inHours(52),
      durationMin: 30,
      topic: { en: "Travel week plan", ne: "यात्रा हप्ताको योजना" },
      isMinor: false,
      status: "requested" as const,
    },
    {
      id: "k4",
      client: "Priya Maharjan",
      at: inHours(74),
      durationMin: 30,
      topic: { en: "Re-motivation call", ne: "पुनः प्रेरणा कल" },
      isMinor: false,
      status: "requested" as const,
    },
  ];
}

/** Monthly coaching revenue in NPR. */
export function revenueByMonth(now: Date) {
  const values = [148_000, 162_500, 171_000, 169_000, 188_500, 204_000];
  return values.map((value, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (values.length - 1 - i), 1);
    return { month: d.toISOString(), value };
  });
}

export const programTemplates = [
  {
    id: "p1",
    name: { en: "Upper / Lower — Fat loss", ne: "अपर / लोअर — बोसो घटाउने" },
    weeks: 12,
    daysPerWeek: 4,
    clients: 5,
    level: "intermediate" as const,
    updatedDays: 3,
    createdBy: "coach" as const,
  },
  {
    id: "p2",
    name: { en: "Push / Pull / Legs — Hypertrophy", ne: "पुस / पुल / लेग्स — मांसपेशी वृद्धि" },
    weeks: 8,
    daysPerWeek: 6,
    clients: 3,
    level: "advanced" as const,
    updatedDays: 10,
    createdBy: "coach" as const,
  },
  {
    id: "p3",
    name: { en: "Full body — Beginner", ne: "पूरा शरीर — सुरुवाती" },
    weeks: 6,
    daysPerWeek: 3,
    clients: 4,
    level: "beginner" as const,
    updatedDays: 21,
    createdBy: "coach" as const,
  },
  {
    id: "p4",
    name: { en: "Home — Dumbbells only", ne: "घरमै — डम्बेल मात्र" },
    weeks: 8,
    daysPerWeek: 4,
    clients: 2,
    level: "beginner" as const,
    updatedDays: 1,
    createdBy: "ai" as const,
  },
  {
    id: "p5",
    name: { en: "Youth athletic development", ne: "युवा खेलकुद विकास" },
    weeks: 10,
    daysPerWeek: 3,
    clients: 2,
    level: "beginner" as const,
    updatedDays: 14,
    createdBy: "coach" as const,
  },
];

export const dietTemplates = [
  {
    id: "d1",
    name: { en: "Nepali fat loss — non-veg", ne: "नेपाली बोसो घटाउने — मांसाहारी" },
    kcal: 1850,
    protein: 140,
    meals: 4,
    clients: 4,
  },
  {
    id: "d2",
    name: { en: "Nepali fat loss — vegetarian", ne: "नेपाली बोसो घटाउने — शाकाहारी" },
    kcal: 1800,
    protein: 120,
    meals: 4,
    clients: 3,
  },
  {
    id: "d3",
    name: { en: "Lean bulk — dal bhat based", ne: "लिन बल्क — दाल भातमा आधारित" },
    kcal: 2900,
    protein: 165,
    meals: 5,
    clients: 2,
  },
  {
    id: "d4",
    name: { en: "Youth balanced nutrition", ne: "युवा सन्तुलित पोषण" },
    kcal: 2400,
    protein: 100,
    meals: 5,
    clients: 2,
  },
];

export function pendingCheckIns(now: Date) {
  return [
    {
      id: "ci1",
      client: "Sita Gurung",
      isMinor: false,
      submittedAt: daysAgo(now, 1),
      weight: 66.4,
      weightChange: -0.5,
      training: 100,
      diet: 90,
      sleep: 7,
      energy: 4,
      aiSummary: {
        en: "Steady loss of ~0.5 kg/week (0.7% bodyweight) with 90%+ adherence. Energy and sleep are good. Client asked about eating out at weekends.",
        ne: "९०%+ पालनासहित हप्तामा करिब ०.५ किलो (शरीरको तौलको ०.७%) स्थिर रूपमा घटेको छ। ऊर्जा र निद्रा राम्रो छ। क्लाइन्टले सप्ताहन्तमा बाहिर खाने बारे सोध्नुभएको छ।",
      },
      suggestion: {
        en: "Keep calories at 1,850 kcal. Progress is on track — no change needed.",
        ne: "क्यालोरी १,८५० kcal मै राख्नुहोस्। प्रगति ठीक छ — परिवर्तन आवश्यक छैन।",
      },
    },
    {
      id: "ci2",
      client: "Suman Adhikari",
      isMinor: false,
      submittedAt: daysAgo(now, 1.2),
      weight: 78.2,
      weightChange: 0,
      training: 100,
      diet: 95,
      sleep: 6,
      energy: 3,
      aiSummary: {
        en: "Weight flat for 2 weeks while adherence is 95%. Sleep dropped to 6 h and energy is lower.",
        ne: "९५% पालना हुँदाहुँदै २ हप्तादेखि तौल स्थिर छ। निद्रा ६ घण्टामा झरेको छ र ऊर्जा कम छ।",
      },
      suggestion: {
        en: "Suggest −150 kcal (from carbs) and a sleep target of 7+ h. Stays above the safe calorie floor.",
        ne: "कार्बोहाइड्रेटबाट −१५० kcal र ७+ घण्टा निद्राको लक्ष्य सुझाव। सुरक्षित क्यालोरी सीमाभन्दा माथि नै रहन्छ।",
      },
    },
    {
      id: "ci3",
      client: "Anish Tamang",
      isMinor: true,
      submittedAt: daysAgo(now, 2),
      weight: 58.1,
      weightChange: 0.3,
      training: 90,
      diet: 85,
      sleep: 8,
      energy: 5,
      aiSummary: {
        en: "Good training consistency and energy. Squat technique improving. (Youth-safe rules applied; photos not analyzed.)",
        ne: "तालिम नियमित छ र ऊर्जा राम्रो छ। स्क्वाट प्रविधि सुध्रिँदैछ। (युवा-सुरक्षित नियम लागू; फोटो विश्लेषण गरिएको छैन।)",
      },
      suggestion: {
        en: "No calorie change. Focus next block on technique and habits.",
        ne: "क्यालोरीमा परिवर्तन छैन। अर्को चरणमा प्रविधि र बानीमा ध्यान दिनुहोस्।",
      },
    },
  ];
}

export function formChecks(now: Date) {
  return [
    {
      id: "f1",
      client: "Anish Tamang",
      isMinor: true,
      exercise: "squat" as ExerciseKey,
      submittedAt: daysAgo(now, 0.4),
      durationSec: 38,
      status: "aiReady" as const,
      aiIssues: [
        {
          en: "Knees drift inward (valgus) on reps 4–5",
          ne: "रेप ४–५ मा घुँडा भित्रतिर जान्छ (भाल्गस)",
        },
        { en: "Depth is good — hip crease below knee", ne: "गहिराइ राम्रो छ — हिप घुँडाभन्दा तल" },
      ],
      confidence: "medium" as const,
      comments: [] as { sec: number; text: string }[],
    },
    {
      id: "f2",
      client: "Sita Gurung",
      isMinor: false,
      exercise: "deadlift" as ExerciseKey,
      submittedAt: daysAgo(now, 2),
      durationSec: 45,
      status: "reviewed" as const,
      aiIssues: [
        { en: "Slight lower-back rounding at lockout", ne: "लकआउटमा ढाड अलिकति गोलो हुन्छ" },
      ],
      confidence: "high" as const,
      comments: [
        { sec: 4, text: "Nice brace here — keep that tension." },
        { sec: 12, text: "Push the floor away; bar drifts forward slightly." },
        { sec: 27, text: "Squeeze glutes to finish instead of leaning back." },
      ],
    },
    {
      id: "f3",
      client: "Bikash Thapa",
      isMinor: false,
      exercise: "bench" as ExerciseKey,
      submittedAt: daysAgo(now, 0.9),
      durationSec: 30,
      status: "uploaded" as const,
      aiIssues: [],
      confidence: null,
      comments: [],
    },
  ];
}

export const coachingPackages = [
  {
    id: "k1",
    name: { en: "1-month coaching", ne: "१ महिने कोचिङ" },
    durationDays: 30,
    npr: 6000,
    usd: 49,
    active: true,
    clients: 3,
  },
  {
    id: "k2",
    name: { en: "3-month transformation", ne: "३ महिने रूपान्तरण" },
    durationDays: 90,
    npr: 15000,
    usd: 129,
    active: true,
    clients: 6,
  },
  {
    id: "k3",
    name: { en: "6-month elite", ne: "६ महिने एलिट" },
    durationDays: 180,
    npr: 27000,
    usd: 229,
    active: true,
    clients: 2,
  },
];

export type PaymentProviderId = "khalti" | "esewa" | "stripe" | "paypal" | "manual";

export function recentPayments(now: Date) {
  return [
    {
      id: "INV-0142",
      client: "Bikash Thapa",
      amount: 15000,
      currency: "NPR",
      provider: "khalti" as PaymentProviderId,
      status: "paid" as const,
      at: daysAgo(now, 1),
    },
    {
      id: "INV-0141",
      client: "Emily Carter",
      amount: 129,
      currency: "USD",
      provider: "stripe" as PaymentProviderId,
      status: "paid" as const,
      at: daysAgo(now, 3),
    },
    {
      id: "INV-0140",
      client: "Rohan Karki",
      amount: 6000,
      currency: "NPR",
      provider: "esewa" as PaymentProviderId,
      status: "pending" as const,
      at: daysAgo(now, 4),
    },
    {
      id: "INV-0139",
      client: "Suman Adhikari",
      amount: 27000,
      currency: "NPR",
      provider: "manual" as PaymentProviderId,
      status: "paid" as const,
      at: daysAgo(now, 6),
    },
    {
      id: "INV-0138",
      client: "Kabita Lama",
      amount: 6000,
      currency: "NPR",
      provider: "khalti" as PaymentProviderId,
      status: "failed" as const,
      at: daysAgo(now, 8),
    },
    {
      id: "INV-0137",
      client: "James Miller",
      amount: 49,
      currency: "USD",
      provider: "paypal" as PaymentProviderId,
      status: "refunded" as const,
      at: daysAgo(now, 12),
    },
  ];
}

// ---------------------------------------------------------------------------
// Guardian
// ---------------------------------------------------------------------------

export const guardianView = {
  guardianName: "Maya Tamang",
  minor: { name: "Anish Tamang", age: 16, coach: "Aarav Shrestha", goal: "strength" as Goal },
  consents: { coaching: true, healthData: true, photos: false, ai: true },
  program: { en: "Youth athletic development", ne: "युवा खेलकुद विकास" },
  diet: { en: "Youth balanced nutrition", ne: "युवा सन्तुलित पोषण" },
  trainingThisWeek: { done: 2, planned: 3 },
  checkInStatus: "submitted" as const,
};

// ---------------------------------------------------------------------------
// Super admin
// ---------------------------------------------------------------------------

export type WorkspaceType = "INDEPENDENT_COACH" | "GYM_CENTER";

export const workspaces = [
  {
    id: "w1",
    name: "Aarav Fitness Coaching",
    type: "INDEPENDENT_COACH" as WorkspaceType,
    plan: "proCoach",
    status: "active" as const,
    clients: 42,
    coaches: 2,
    branches: 0,
    storageGb: 18.4,
    aiTokens: 1_240_000,
    mrrNpr: 5999,
  },
  {
    id: "w2",
    name: "Iron Temple Gym",
    type: "GYM_CENTER" as WorkspaceType,
    plan: "gymBusiness",
    status: "active" as const,
    clients: 386,
    coaches: 14,
    branches: 3,
    storageGb: 112.7,
    aiTokens: 4_980_000,
    mrrNpr: 19999,
  },
  {
    id: "w3",
    name: "Nisha Rai Wellness",
    type: "INDEPENDENT_COACH" as WorkspaceType,
    plan: "soloCoach",
    status: "trial" as const,
    clients: 9,
    coaches: 1,
    branches: 0,
    storageGb: 2.1,
    aiTokens: 88_000,
    mrrNpr: 0,
  },
  {
    id: "w4",
    name: "Pokhara Power House",
    type: "GYM_CENTER" as WorkspaceType,
    plan: "gymStarter",
    status: "active" as const,
    clients: 164,
    coaches: 6,
    branches: 1,
    storageGb: 41.3,
    aiTokens: 1_730_000,
    mrrNpr: 9999,
  },
  {
    id: "w5",
    name: "Lift with Sam",
    type: "INDEPENDENT_COACH" as WorkspaceType,
    plan: "soloCoach",
    status: "pastDue" as const,
    clients: 21,
    coaches: 1,
    branches: 0,
    storageGb: 6.8,
    aiTokens: 402_000,
    mrrNpr: 2499,
  },
  {
    id: "w6",
    name: "Everest Strength Club",
    type: "GYM_CENTER" as WorkspaceType,
    plan: "gymStarter",
    status: "suspended" as const,
    clients: 97,
    coaches: 5,
    branches: 1,
    storageGb: 22.0,
    aiTokens: 0,
    mrrNpr: 0,
  },
];

export function mrrByMonth(now: Date) {
  const values = [21_500, 26_000, 29_400, 33_900, 36_400, 38_496];
  return values.map((value, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (values.length - 1 - i), 1);
    return { month: d.toISOString(), value };
  });
}

export const revenueByProvider = [
  { provider: "khalti" as PaymentProviderId, value: 16_497 },
  { provider: "esewa" as PaymentProviderId, value: 9_999 },
  { provider: "stripe" as PaymentProviderId, value: 7_999 },
  { provider: "paypal" as PaymentProviderId, value: 2_499 },
  { provider: "manual" as PaymentProviderId, value: 1_502 },
];

export const aiUsageByWorkspace = [
  {
    workspace: "Iron Temple Gym",
    checkIns: 1_920_000,
    formChecks: 1_610_000,
    chat: 1_450_000,
    costUsd: 41.2,
    credits: 0.83,
  },
  {
    workspace: "Pokhara Power House",
    checkIns: 720_000,
    formChecks: 510_000,
    chat: 500_000,
    costUsd: 14.6,
    credits: 0.58,
  },
  {
    workspace: "Aarav Fitness Coaching",
    checkIns: 480_000,
    formChecks: 420_000,
    chat: 340_000,
    costUsd: 10.3,
    credits: 0.62,
  },
  {
    workspace: "Lift with Sam",
    checkIns: 160_000,
    formChecks: 130_000,
    chat: 112_000,
    costUsd: 3.4,
    credits: 0.4,
  },
  {
    workspace: "Nisha Rai Wellness",
    checkIns: 40_000,
    formChecks: 18_000,
    chat: 30_000,
    costUsd: 0.7,
    credits: 0.09,
  },
];

export function auditLogs(now: Date) {
  return [
    {
      id: "l1",
      actor: "super-admin@taakat.app",
      action: "workspace.suspend",
      target: "Everest Strength Club",
      at: daysAgo(now, 0.2),
      ip: "103.10.28.4",
    },
    {
      id: "l2",
      actor: "super-admin@taakat.app",
      action: "impersonation.start",
      target: "Lift with Sam (owner)",
      at: daysAgo(now, 0.9),
      ip: "103.10.28.4",
    },
    {
      id: "l3",
      actor: "aarav@aaravfitness.com",
      action: "plan.publish",
      target: "Sita Gurung — Upper / Lower v5",
      at: daysAgo(now, 1.4),
      ip: "27.34.12.90",
    },
    {
      id: "l4",
      actor: "owner@irontemple.com.np",
      action: "payment.manual",
      target: "INV-2291 · NPR 6,000",
      at: daysAgo(now, 2),
      ip: "110.44.117.8",
    },
    {
      id: "l5",
      actor: "super-admin@taakat.app",
      action: "plan.update",
      target: "Gym Starter — limits",
      at: daysAgo(now, 4),
      ip: "103.10.28.4",
    },
    {
      id: "l6",
      actor: "owner@irontemple.com.np",
      action: "staff.invite",
      target: "frontdesk@irontemple.com.np",
      at: daysAgo(now, 5),
      ip: "110.44.117.8",
    },
  ];
}

export function guardianThread(now: Date): ChatMessage[] {
  return [
    {
      id: "g1",
      from: "coach",
      text: "Hi Anish, great session numbers this week. Remember: technique first, the weight will follow.",
      at: daysAgo(now, 3),
    },
    {
      id: "g2",
      from: "client",
      text: "Thanks! My knees felt a bit wobbly on the last squat set.",
      at: daysAgo(now, 2.9),
    },
    {
      id: "g3",
      from: "coach",
      text: "Good that you told me. Send a form-check video of your next squat session and we'll work on knee tracking together.",
      at: daysAgo(now, 2.8),
    },
    { id: "g4", from: "client", text: "Sent it today!", at: daysAgo(now, 0.4) },
  ];
}

export function guardianInvoices(now: Date) {
  return [
    {
      id: "INV-0131",
      period: { en: "3-month transformation", ne: "३ महिने रूपान्तरण" },
      amount: 15000,
      currency: "NPR",
      provider: "esewa" as PaymentProviderId,
      status: "paid" as const,
      at: daysAgo(now, 26),
    },
    {
      id: "INV-0098",
      period: { en: "1-month coaching", ne: "१ महिने कोचिङ" },
      amount: 6000,
      currency: "NPR",
      provider: "khalti" as PaymentProviderId,
      status: "paid" as const,
      at: daysAgo(now, 58),
    },
  ];
}

export function youthStrength() {
  return Array.from({ length: 8 }, (_, w) => ({
    week: w + 1,
    squat: round(40 + w * 1.6 + (noise(w + 90) - 0.5) * 1.5),
    pushups: Math.round(12 + w * 1.4 + (noise(w + 99) - 0.5) * 2),
  }));
}
