import { describe, expect, it } from "vitest";

import { EnvError, getFeatures, parseEnv } from "@/lib/env.schema";

const base = {
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  ENCRYPTION_KEY: Buffer.alloc(32, 1).toString("base64"),
  MONGODB_URI: "mongodb://localhost:27017/taakatai",
  AUTH_SECRET: "x".repeat(32),
};

describe("env", () => {
  it("accepts required keys and disables unconfigured features", () => {
    const env = parseEnv(base);
    const features = getFeatures(env);
    expect(features.ai).toBe(false);
    expect(features.khalti).toBe(false);
  });

  it("treats empty strings as missing", () => {
    const env = parseEnv({ ...base, ANTHROPIC_API_KEY: "", ANTHROPIC_MODEL: "" });
    expect(env.ANTHROPIC_API_KEY).toBeUndefined();
  });

  it("enables a feature once all its keys are present", () => {
    const env = parseEnv({ ...base, ANTHROPIC_API_KEY: "k", ANTHROPIC_MODEL: "m" });
    expect(getFeatures(env).ai).toBe(true);
  });

  it("lists every missing required key", () => {
    try {
      parseEnv({});
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(EnvError);
      const message = (error as EnvError).message;
      for (const key of ["NEXT_PUBLIC_APP_URL", "ENCRYPTION_KEY", "MONGODB_URI", "AUTH_SECRET"]) {
        expect(message).toContain(key);
      }
    }
  });
});
