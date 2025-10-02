import { TagWeight } from './scorePackage';

export function dot(a: TagWeight, b: TagWeight) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let s = 0;
  keys.forEach(k => { s += (a[k] || 0) * (b[k] || 0); });
  return s;
}

export function norm(a: TagWeight) {
  return Math.sqrt(Object.values(a).reduce((s, x) => s + x * x, 0)) || 1;
}

export function cosine(a: TagWeight, b: TagWeight) {
  return dot(a, b) / (norm(a) * norm(b));
}

export function makeSquadmates(user: TagWeight): TagWeight[] {
  const entries = Object.entries(user).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const base = Object.fromEntries(entries);
  const mate1: TagWeight = {}; // Glue
  const mate2: TagWeight = {}; // Spark
  for (const [t, w] of Object.entries(base)) {
    mate1[t] = Math.max(0, w - 0.15);
    mate2[t] = Math.max(0, w - 0.1);
  }
  mate1["Group"] = Math.max(mate1["Group"] || 0, 0.8);
  mate1["Connector"] = Math.max(mate1["Connector"] || 0, 0.7);
  mate1["Planner"] = Math.max(mate1["Planner"] || 0, 0.6);
  mate2["Spontaneous"] = Math.max(mate2["Spontaneous"] || 0, 0.8);
  mate2["Nightlife"] = Math.max(mate2["Nightlife"] || 0, 0.7);
  mate2["Adventure"] = Math.max(mate2["Adventure"] || 0, 0.6);
  return [mate1, mate2];
}

export function cohesion(vecs: TagWeight[]) {
  if (vecs.length < 2) return 1;
  const pairs: [number, number][] = [[0, 1], [0, 2], [1, 2]].filter(p => p[1] < vecs.length) as [number, number][];
  const sims = pairs.map(([i, j]) => cosine(vecs[i], vecs[j]));
  return sims.reduce((a, b) => a + b, 0) / sims.length;
}

export function complementarity(vecs: TagWeight[]) {
  const role = (v: TagWeight) => ({
    Planner: Math.max(v["Planner"] || 0, v["Structured"] || 0),
    Spark: Math.max(v["Spontaneous"] || 0, v["Last-Minute"] || 0),
    Glue: Math.max(v["Connector"] || 0, v["Group"] || 0, v["Friendly"] || 0),
    Safety: Math.max(v["Security-Seeker"] || 0, v["Guided"] || 0, v["Wellness"] || 0),
    Thrill: Math.max(v["Fearless"] || 0, v["Risk-Taker"] || 0, v["Adventure"] || 0),
  });
  const counts: Record<string, number> = { Planner: 0, Spark: 0, Glue: 0, Safety: 0, Thrill: 0 };
  vecs.forEach(v => {
    const r = role(v);
    Object.entries(r).forEach(([k, val]) => { if (val >= 0.6) counts[k] += 1; });
  });
  const distinct = Object.values(counts).filter(x => x > 0).length;
  let score = Math.min(1, distinct / 4.5);
  if (counts["Spark"] > 1 && counts["Glue"] === 0) score *= 0.8;
  return score;
}

export function squadScore(vecs: TagWeight[]) {
  const coh = cohesion(vecs);
  const comp = complementarity(vecs);
  return { cohesion: coh, complementarity: comp, score: 0.6 * coh + 0.4 * comp };
}