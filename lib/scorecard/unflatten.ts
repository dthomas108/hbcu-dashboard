export function unflatten(obj: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(".");
    let cur = result;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (i === parts.length - 1) {
        cur[p] = value;
      } else {
        cur[p] = cur[p] ?? {};
        cur = cur[p] as Record<string, unknown>;
      }
    }
  }
  return result;
}