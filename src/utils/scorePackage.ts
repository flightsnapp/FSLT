export type TagWeight = Record<string, number>;
export type Pkg = {
  id: string;
  title: string;
  destination: string;
  duration_nights: number;
  price_per_person_usd: number;
  tags: string[];
  summary: string;
  highlights: string[];
  best_months: string[];
  group_suitability?: { ideal_group_size: [number, number]; cohesion_min: number; complementarity_bonus: boolean };
  images?: string[];
  affiliate?: { supplier: string; product_code: string; booking_url: string };
  rating?: number;
};

export function weightsFromPersonaTags(personaTags: string[] = []): TagWeight {
  const base = [0.9, 0.75, 0.6, 0.5, 0.4, 0.35, 0.3];
  const w: TagWeight = {};
  personaTags.forEach((t, i) => { w[t] = Math.max(w[t] ?? 0, base[i] ?? 0.3); });
  return w;
}

export function scorePackage(userTags: TagWeight, pkg: Pkg): number {
  let overlap = 0;
  for (const t of pkg.tags) overlap += (userTags[t] ?? 0);
  const ratingNudge = 0.05 * ((pkg.rating ?? 4.5) - 4.0);
  return overlap + ratingNudge;
}

export function topPackages(userTags: TagWeight, list: Pkg[], k = 3): { pkg: Pkg; score: number; matched: string[] }[] {
  const scored = list.map(p => {
    const matched = Object.keys(userTags).filter(t => userTags[t] > 0 && p.tags.includes(t));
    return { pkg: p, matched, score: scorePackage(userTags, p) };
  });
  const sorted = scored.sort((a, b) => b.score - a.score);
  if (!sorted.some(s => s.matched.length > 0)) {
    const broad = new Set(["Nightlife", "Adventure", "Culture", "Wellness", "Budget", "Luxury", "Group", "Solo", "Planner", "Spontaneous"]);
    const preferred = list
      .filter(p => p.tags.some(t => broad.has(t)))
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return pickTop(preferred, k).map(p => ({ pkg: p, matched: [], score: 0 }));
  }
  return sorted.slice(0, k);
}

function pickTop(list: Pkg[], k = 3) {
  return list.slice(0, k);
}