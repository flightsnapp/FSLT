import { Scores, strength, Trait } from './scoreEngine';
import { TRAITS } from './personaCalculator';

import matrix from './modifier_matrix.json';

export function implicitFromTraits(scores: Scores): [string, number][] {
  const implicitTags: [string, number][] = [];

  for (const trait of TRAITS) {
    const score = scores[trait as Trait], hi = matrix.thresholds.hi, lo = matrix.thresholds.lo;
    let tags: string[] = [];
    if (score >= hi) {
      tags = matrix.implicit[trait as Trait].hi;
    } else if (score <= lo) {
      tags = matrix.implicit[trait as Trait].lo;
    }
    const weight = strength(score);
    tags.forEach(tag => implicitTags.push([tag, weight]));
  }

  // Sort by weight descending
  implicitTags.sort((a, b) => b[1] - a[1]);

  // Return top implicitTop
  return implicitTags.slice(0, matrix.caps.implicitTop);
}

export function mergeModifiers(implicit: [string, number][], direct: [string, number][], cap: number = matrix.caps.finalTop): [string, number][] {
  const weightMap = new Map<string, number>();

  // Add implicit
  implicit.forEach(([tag, weight]) => {
    weightMap.set(tag, (weightMap.get(tag) || 0) + weight);
  });

  // Add direct
  direct.forEach(([tag, weight]) => {
    weightMap.set(tag, (weightMap.get(tag) || 0) + weight);
  });

  // Cap and collect
  const merged: [string, number][] = Array.from(weightMap.entries()).map(([tag, w]) => [tag, Math.min(w, 1.0)]);

  // Sort descending by weight
  merged.sort((a, b) => b[1] - a[1]);

  // Return top cap
  return merged.slice(0, cap);
}
