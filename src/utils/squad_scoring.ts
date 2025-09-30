// Dot function implemented here since not in scoreEngine

export type Vec = Record<string, number>;

export function dot(a: Vec, b: Vec): number {
  let sum = 0;
  for (const k in a) {
    if (b[k] !== undefined) {
      sum += a[k] * b[k];
    }
  }
  return sum;
}

export function norm(a: Vec): number {
  let sum = 0;
  for (const v in a) {
    sum += a[v] * a[v];
  }
  return sum > 0 ? Math.sqrt(sum) : 1;
}

export function cosine(a: Vec, b: Vec): number {
  const na = norm(a), nb = norm(b);
  return na * nb === 0 ? 0 : dot(a, b) / (na * nb);
}

export function cohesion(vectors: Vec[]): number {
  if (vectors.length < 2) return 1;
  let total = 0, count = 0;
  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      total += cosine(vectors[i], vectors[j]);
      count++;
    }
  }
  return count > 0 ? total / count : 1;
}

export function roles(vec: Vec): Record<string, number> {
  // Define role groups (tags to roles)
  const roleGroups = {
    Planner: ['Planner', 'Structured'],
    Spark: ['Spontaneous', 'Last-Minute', 'YOLO', 'Group', 'Nightlife', 'Festival'],
    Glue: ['Connector', 'Community', 'Friendly'],
    Wildcard: ['Offbeat', 'Independent', 'Cultural', 'Maverick', 'Solo', 'Introspective'],
    Safety: ['Guided', 'Wellness', 'Security-Seeker', 'Comfort', 'Familiar', 'Luxury'],
    Thrill: ['Adventure', 'Fearless', 'Risk-Taker']
  };

  const result: Record<string, number> = {};
  for (const role in roleGroups) {
    const tags = roleGroups[role as keyof typeof roleGroups];
    const max_weight = Math.max(...tags.map(tag => vec[tag] || 0));
    result[role] = max_weight;
  }
  return result;
}

export function complementarity(vectors: Vec[]): number {
  if (vectors.length === 1) return 1;

  // Get all roles presence
  const distinctRoles = new Set<string>();
  let wildcardCount = 0, glueCount = 0;

  for (const vec of vectors) {
    const r = roles(vec);
    for (const role in r) {
      if (r[role] > 0.6) {
        distinctRoles.add(role);
        if (role === 'Wildcard') wildcardCount++;
        if (role === 'Glue') glueCount++;
      }
    }
  }

  let complement = Math.min(distinctRoles.size, 5) / 5;
  if (wildcardCount > 1 && glueCount === 0) {
    complement *= 0.7;
  }

  return complement;
}

export function squadScore(vecs: Vec[]): { cohesion: number, complementarity: number, score: number } {
  if (vecs.length === 1) return { cohesion: 1, complementarity: 1, score: 1 };

  const coh = cohesion(vecs);
  const comp = complementarity(vecs);
  const score = 0.6 * coh + 0.4 * comp;

  return { cohesion: coh, complementarity: comp, score };
}
