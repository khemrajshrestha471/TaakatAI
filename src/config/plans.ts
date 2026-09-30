/**
 * SaaS plans sold to coaches and gyms. Seed values for the super-admin plan editor (Phase 12),
 * which will store them in the database.
 *
 * TODO(owner): prices are PLACEHOLDERS — confirm final NPR/USD pricing (prompt.md §18 Q6).
 */
export type PlanId = "soloCoach" | "proCoach" | "gymStarter" | "gymBusiness";

export type SaasPlan = {
  id: PlanId;
  audience: "coach" | "gym";
  monthly: { npr: number; usd: number };
  /** `null` = unlimited. */
  limits: {
    coaches: number | null;
    clients: number | null;
    branches: number | null;
    storageGb: number;
    aiCredits: number;
  };
  features: { customBranding: boolean; customSubdomain: boolean; prioritySupport: boolean };
  highlighted?: boolean;
};

export const TRIAL_DAYS = 14;

export const saasPlans: SaasPlan[] = [
  {
    id: "soloCoach",
    audience: "coach",
    monthly: { npr: 2499, usd: 19 },
    limits: { coaches: 1, clients: 30, branches: 0, storageGb: 20, aiCredits: 500 },
    features: { customBranding: false, customSubdomain: false, prioritySupport: false },
  },
  {
    id: "proCoach",
    audience: "coach",
    monthly: { npr: 5999, usd: 49 },
    limits: { coaches: 5, clients: 150, branches: 0, storageGb: 100, aiCredits: 2500 },
    features: { customBranding: true, customSubdomain: false, prioritySupport: false },
    highlighted: true,
  },
  {
    id: "gymStarter",
    audience: "gym",
    monthly: { npr: 9999, usd: 79 },
    limits: { coaches: 10, clients: 500, branches: 1, storageGb: 250, aiCredits: 6000 },
    features: { customBranding: true, customSubdomain: false, prioritySupport: false },
  },
  {
    id: "gymBusiness",
    audience: "gym",
    monthly: { npr: 19999, usd: 149 },
    limits: { coaches: null, clients: null, branches: null, storageGb: 1000, aiCredits: 20000 },
    features: { customBranding: true, customSubdomain: true, prioritySupport: true },
  },
];
