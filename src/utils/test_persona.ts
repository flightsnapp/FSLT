import { normalize, personaFit, TRAITS, Scores } from '../../utils/scoreEngine.ts';
import { implicitFromTraits, mergeModifiers } from '../../utils/applyModifiers.ts';
import { squadScore, Vec } from '../../utils/squad_scoring.ts';

// Mock personaWeights
const personaWeights: Record<string, Record<string, number>> = {
// sample small data
};

describe('normalize', () => {
  test('direct score=3 should be about 50', () => {
    expect(normalize(3, 'direct')).toBeCloseTo(50);
  });
  test('reverse score=3 should be about 50', () => {
    expect(normalize(3, 'reverse')).toBeCloseTo(50);
  });
  test('throw error if score <1 or >5', () => {
    expect(() => normalize(0, 'direct')).toThrow();
    expect(() => normalize(6, 'direct')).toThrow();
  });
});

describe('personaFit', () => {
  test('all scores=50 should score all personas around 50', () => {
    const scores = Object.fromEntries(TRAITS.map(trait => [trait, 50])) as Scores;
    const fits = personaFit(scores, personaWeights);
    fits.forEach(fit => expect(fit.score).toBeCloseTo(50, 1));
  });
});

describe('implicitFromTraits', () => {
  test('Openness=80 should include Adventure with 0.6', () => {
    const scores = Object.fromEntries(TRAITS.map(trait => [trait, trait === 'Openness' ? 80 : 50])) as Scores;
    const implicit = implicitFromTraits(scores);
    expect(implicit.some(([tag, _]) => tag === 'Adventure')).toBe(true);
    expect(implicit.find(([tag, _]) => tag === 'Adventure')![1]).toBeCloseTo(0.6);
  });
});

describe('mergeModifiers', () => {
  test('merge implicit and direct, cap at top-5', () => {
    const implicit: [string, number][] = [['A', 0.5], ['B', 0.4]];
    const direct: [string, number][] = [['C', 0.6], ['D', 0.3]];
    const merged = mergeModifiers(implicit, direct, 5);
    expect(merged.length).toBeLessThanOrEqual(4);
    merged.forEach(([_, w]) => expect(w).toBeLessThanOrEqual(1.0));
  });
});

describe('squadScore', () => {
  test('solo should have cohesion 1, complementarity 1, score 1', () => {
    const vecs: Vec[] = [{ Adventure: 0.5 }];
    const result = squadScore(vecs);
    expect(result.cohesion).toBe(1);
    expect(result.complementarity).toBe(1);
    expect(result.score).toBe(1);
  });
  test('same tags should have high cohesion', () => {
    const vecs: Vec[] = [
      { Adventure: 0.8, Planner: 0.5 },
      { Adventure: 0.7, Planner: 0.4 }
    ];
    const result = squadScore(vecs);
    expect(result.cohesion).toBeGreaterThan(0.8);
  });
  test('diverse roles should have high complementarity', () => {
    const vecs: Vec[] = [
      { Planner: 0.9 },
      { Spark: 0.9 },
      { Glue: 0.9 },
      { Safety: 0.9 },
      { Thrill: 0.9 }
    ];
    const result = squadScore(vecs);
    expect(result.complementarity).toBeGreaterThan(0.8);
  });
});
