// Define types
export type Trait = 'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Neuroticism';

export interface Scores {
  Openness: number;
  Conscientiousness: number;
  Extraversion: number;
  Agreeableness: number;
  Neuroticism: number;
}

// TRAITS as array for iteration
export const TRAITS: Trait[] = [
  'Openness',
  'Conscientiousness',
  'Extraversion',
  'Agreeableness',
  'Neuroticism'
];

// Normalize scores to 1-5 range
export const normalize = (scores: number[]): number[] => {
  return scores.map(score => Math.max(1, Math.min(5, score)));
};

// Calculate persona fit using dot product
export const personaFit = (
  centered: Scores,
  weights: Record<string, Record<Trait, number>>
): Array<{ persona: string; score: number }> => {
  const fits = Object.entries(weights).map(([persona, weightDict]) => {
    const dotProduct: number = TRAITS.reduce(
      (sum, trait) => sum + (centered[trait] * (weightDict[trait] || 0)),
      0
    );
    return { persona, score: dotProduct };
  });
  return fits.sort((a, b) => b.score - a.score);
};