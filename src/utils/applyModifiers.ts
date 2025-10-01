import { Scores, strength, Trait, TRAITS } from './scoreEngine';
import matrix from './modifier_matrix.json';

// Type for modifier_matrix.json
interface ModifierMatrix {
  thresholds: { hi: number; lo: number };
  implicit: Record<Trait, { hi: string[]; lo: string[] }>;
  caps: { implicitTop: number; finalTop: number };
  abVariants: { thresholdsHi: number[]; thresholdsLo: number[] };
}

// Validate TRAITS is an array of 5 traits
if (!Array.isArray(TRAITS) || TRAITS.length !== 5) {
  throw new Error('TRAITS is undefined or invalid in scoreEngine');
}

// Validate matrix shape against Trait keys from TRAITS (array)
const traitSet = new Set<string>(TRAITS);
const validateMatrix = (m: any): m is ModifierMatrix => {
  if (!m || typeof m !== 'object') {
    console.error('Invalid modifier_matrix: Not an object');
    return false;
  }
  if (!m.thresholds || typeof m.thresholds.hi !== 'number' || typeof m.thresholds.lo !== 'number') {
    console.error('Invalid modifier_matrix: Missing or invalid thresholds');
    return false;
  }
  if (!m.implicit || !Object.keys(m.implicit).every(k => traitSet.has(k))) {
    console.error('Invalid modifier_matrix: Missing or invalid implicit traits');
    return false;
  }
  if (!m.caps || typeof m.caps.implicitTop !== 'number' || typeof m.caps.finalTop !== 'number') {
    console.error('Invalid modifier_matrix: Missing or invalid caps');
    return false;
  }
  return true;
};

if (!validateMatrix(matrix)) {
  throw new Error('Invalid modifier_matrix.json structure');
}

export function implicitFromTraits(scores: Scores): [string, number][] {
  const out: [string, number][] = [];
  const { hi, lo } = matrix.thresholds;

  for (const trait of TRAITS) {
    const raw = (scores as any)[trait];
    if (!Number.isFinite(raw)) continue;

    const choices =
      raw >= hi ? matrix.implicit[trait].hi :
      raw <= lo ? matrix.implicit[trait].lo : [];

    const w = strength(raw);
    for (const tag of choices) out.push([tag, w]);
  }

  out.sort((a, b) => b[1] - a[1]);
  return out.slice(0, matrix.caps.implicitTop);
}

export function mergeModifiers(
  implicit: [string, number][],
  direct: [string, number][],
  cap: number = matrix.caps.finalTop
): [string, number][] {
  const m = new Map<string, number>();
  for (const [tag, w] of implicit) if (Number.isFinite(w)) m.set(tag, (m.get(tag) || 0) + w);
  for (const [tag, w] of direct) if (Number.isFinite(w)) m.set(tag, (m.get(tag) || 0) + w);
  return [...m.entries()].map(([tag, w]) => [tag, Math.min(1, w)] as [string, number])
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, cap);
}