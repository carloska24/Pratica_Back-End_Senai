export const masteryOrder = ["M07", "M08", "M09", "M10", "M11", "M12"] as const;

function readArray(key: string): unknown[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readUniqueStrings(key: string, allowed?: ReadonlySet<string>) {
  const values = readArray(key).filter((value): value is string => typeof value === "string");
  return [...new Set(allowed ? values.filter(value => allowed.has(value)) : values)];
}

export function readUniqueIntegers(key: string, min: number, max: number) {
  const values = readArray(key).filter((value): value is number => typeof value === "number" && Number.isInteger(value) && value >= min && value <= max);
  return [...new Set(values)];
}

export function readSequentialIntegers(key: string, length: number) {
  const saved = new Set(readUniqueIntegers(key, 0, length - 1));
  const sequence: number[] = [];
  for (let index = 0; index < length && saved.has(index); index += 1) sequence.push(index);
  return sequence;
}

export function readMasteredModules() {
  const saved = new Set(readUniqueStrings("campus-module-mastery", new Set(masteryOrder)));
  const sequence: string[] = [];
  for (const moduleId of masteryOrder) {
    if (!saved.has(moduleId)) break;
    sequence.push(moduleId);
  }
  return sequence;
}

export function readArrayLength(key: string) {
  return readArray(key).length;
}
