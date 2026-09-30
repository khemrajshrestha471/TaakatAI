type Messages = { [key: string]: string | Messages };

/** Flattens nested message objects into dot-separated keys. */
export function flattenKeys(messages: Messages, prefix = ""): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : flattenKeys(value, path);
  });
}

/** Keys present in `reference` but missing from `candidate`, plus empty translations. */
export function diffMessages(reference: Messages, candidate: Messages) {
  const candidateKeys = new Set(flattenKeys(candidate));
  const missing = flattenKeys(reference).filter((k) => !candidateKeys.has(k));
  const empty = flattenKeys(candidate).filter((k) => {
    const value = k
      .split(".")
      .reduce<string | Messages | undefined>(
        (node, part) => (typeof node === "object" ? node[part] : undefined),
        candidate,
      );
    return typeof value === "string" && value.trim() === "";
  });
  return { missing, empty };
}
