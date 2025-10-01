// Types
export type Trait = 'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Neuroticism';
export interface Scores {
  Openness: number;
  Conscientiousness: number;
  Extraversion: number;
  Agreeableness: number;
  Neuroticism: number;
}

// Canonical trait order
export const TRAITS: Trait[] = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];

// Likert(1..5) -> 0..100 (direction-aware)
export function normalize(score: number, dir: 'direct' | 'reverse'): number {
  if (!Number.isFinite(score) || score < 1 || score > 5) throw new Error('Score must be between 1 and 5');
  const v = dir === 'direct' ? score : (6 - score); // flip for reverse
  return ((v - 1) / 4) * 100; // 1 -> 0, 3 -> 50, 5 -> 100
}

// Raw(0..100) -> centered (-1..+1)
export function centerRaw(raw: number): number {
  if (!Number.isFinite(raw)) throw new Error('Invalid score');
  return (raw - 50) / 50;
}

// |raw - 50| scaled to 0..1 for weights
export function strength(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  return Math.min(1, Math.abs(raw - 50) / 50);
}

// Persona fit: accept RAW 0..100 scores, validate, center internally, dot with weights.
// Return min-max scaled 0..100; if degenerate (all same), return 50.
export function personaFit(
  raw: Scores,
  weights: Record<string, Record<Trait, number>>
): Array<{ persona: string; score: number }> {
  // Validate raw
  for (const t of TRAITS) {
    const v = (raw as any)[t];
    if (!Number.isFinite(v)) throw new Error('Invalid scores provided');
  }

  // Center
  const centered: Record<Trait, number> = {
    Openness: centerRaw(raw.Openness),
    Conscientiousness: centerRaw(raw.Conscientiousness),
    Extraversion: centerRaw(raw.Extraversion),
    Agreeableness: centerRaw(raw.Agreeableness),
    Neuroticism: centerRaw(raw.Neuroticism)
  };

  const entries = Object.entries(weights).map(([persona, w]) => {
    const dot = TRAITS.reduce((acc, t) => acc + centered[t] * (w[t] ?? 0), 0);
    return { persona, raw: dot };
  });

  const min = Math.min(...entries.map(e => e.raw));
  const max = Math.max(...entries.map(e => e.raw));

  const scaled = entries.map(e => ({
    persona: e.persona,
    score: max === min ? 50 : Math.round(100 * (e.raw - min) / (max - min))
  }));

  return scaled.sort((a, b) => b.score - a.score);
}