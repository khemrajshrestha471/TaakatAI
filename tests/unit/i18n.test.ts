import { describe, expect, it } from "vitest";

import { diffMessages, flattenKeys } from "@/i18n/lib/compare-messages";
import en from "@/i18n/messages/en.json";
import ne from "@/i18n/messages/ne.json";

describe("i18n messages", () => {
  it("en and ne have identical keys", () => {
    expect(diffMessages(en, ne)).toEqual({ missing: [], empty: [] });
    expect(diffMessages(ne, en)).toEqual({ missing: [], empty: [] });
  });

  it("detects missing and empty keys", () => {
    const ref = { a: "x", b: { c: "y", d: "z" } };
    expect(flattenKeys(ref)).toEqual(["a", "b.c", "b.d"]);
    expect(diffMessages(ref, { a: "", b: { c: "y" } })).toEqual({ missing: ["b.d"], empty: ["a"] });
  });

  it("Nepali strings use Devanagari script", () => {
    expect(ne.common.tagline).toMatch(/[\u0900-\u097F]/);
  });
});
