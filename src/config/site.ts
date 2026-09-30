/** Single source of truth for product identity. Change the name here (or via env). */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "TaakatAI",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  brand: {
    background: "#0A0A0A",
    primary: "#E11D2A",
  },
} as const;
