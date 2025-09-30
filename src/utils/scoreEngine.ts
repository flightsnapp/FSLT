export type Trait = "Openness" | "Conscientiousness" | "Extraversion" | "Agreeableness" | "Neuroticism";

export type Scores = Record<Trait, number>;

export function normalize(x: number, dir: "direct" | "reverse"): number {
  if (x < 1 || x > 5) {
    throw new Error(`Score must be between 1 and 5, got ${x}`);
  }
  const scaled = ((x - 1) / 4) * 100;
  return dir === "direct" ? scaled : 100 - scaled;
}

export function strength(t: number): number {
  return Math.abs(t - 50) / 50;
}

export function center(t: number): number {
  return (t - 50) / 50;
}

export function personaFit(centered: Scores, weights: Record<string, Record<Trait, number>>): Array<{persona: string, score: number}> {
  const fits = Object.entries(weights).map(([persona, weightDict]) => {
    const dotProduct: number = TRAITS.reduce((sum, trait) => sum + (centered[trait] * (weightDict[trait] || 0)), 0);
    return { persona, score: dotProduct };
  });

  const scores = fits.map(f => f.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);

  const normalized: Array<{persona: string, score: number}> = fits.map(f => ({
    persona: f.persona,
    score: min === max ? 50 : Math.round(((f.score - min) / (max - min)) * 100)
  }));

  return normalized.sort((a, b) => b.score - a.score);
}

// TRAITS will be exported from personaCalculator.ts
