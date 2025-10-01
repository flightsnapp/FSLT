import { TRAITS, personaFit } from './scoreEngine';

// Define types
export type Trait = 'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Neuroticism';

export interface Scores {
  Openness: number;
  Conscientiousness: number;
  Extraversion: number;
  Agreeableness: number;
  Neuroticism: number;
}

export interface Persona {
  name: string;
  description: string;
  tags: string[];
  example_trips: string[];
  weights: Record<Trait, number>;
}

// 25 Travel Personas
export const PERSONAS: Persona[] = [
  {
    name: "The Wild Trailblazer",
    weights: { Openness: 0.286, Conscientiousness: -0.214, Extraversion: 0.286, Agreeableness: -0.143, Neuroticism: -0.071 },
    description: "You're the ultimate Wild Trailblazer—a fearless explorer who thrives on uncharted territories, bold thrills, and cultural dives, powered by high Openness and Extraversion for that novel, high-energy wanderlust per Big 5 insights. Flightsnapp's hybrid curator spins hyper-personalized snaps just for you: random slot-machine deals on off-the-beaten-path gems, group packages syncing with fellow adventurers, and seamless affiliate ties for guided eco-tours or unique off-grid stays. Let's blaze trails with intuitive, joyful vibes like a vacation playlist echoing your spontaneous dreams!",
    tags: ["Adventure", "Spontaneous", "Outdoor", "Cultural"],
    example_trips: ["Safari in Kenya (guided eco-tours)", "Trekking in Patagonia (off-grid stays)", "Skydiving in New Zealand (group packages for thrill-seekers)"]
  },
  {
    name: "The Party Pathfinder",
    weights: { Openness: 0.071, Conscientiousness: -0.286, Extraversion: 0.357, Agreeableness: 0.214, Neuroticism: -0.071 },
    description: "As the Party Pathfinder, you're the electrifying life of the nightlife, charting vibrant social scenes and group escapades where Extraversion sparks the fun and low Conscientiousness unleashes pure spontaneity. Flightsnapp's AI magic curates your playlist of joy: Random spins for hot deals on festivals, persona-matched squads for epic vibes, and one-tap snaps blending affiliates for social dinners or events. Let's pathfind the party with intuitive, 5-star thrills reflecting your gregarious dreams!",
    tags: ["Social", "Nightlife", "Spontaneous", "Group"],
    example_trips: ["Club hopping in Ibiza (social dinners)", "Carnival in Rio (persona-matched groups)", "Music festival in Coachella (one-tap Snap bookings)"]
  },
  {
    name: "The Solo Dreamer",
    weights: { Openness: 0.385, Conscientiousness: -0.231, Extraversion: -0.308, Agreeableness: 0, Neuroticism: 0.077 },
    description: "Embrace your inner Solo Dreamer—a reflective wanderer chasing quiet inspiration in creative havens, where high Openness unlocks artistic depths and low Extraversion nurtures introspective serenity. Flightsnapp's hybrid curate dreams up your perfect solo snaps: Flexible date options for serene getaways, random spins for budget-friendly wellness retreats, and seamless ties to affiliates for workshops or unique hideaways. Let's dream solo with joyful, intuitive curation like a vacation playlist whispering your whimsical aspirations!",
    tags: ["Solo", "Creative", "Introspective", "Wellness"],
    example_trips: ["Artist retreat in Santorini (workshops)", "Meditation in Kyoto (low Neuroticism vibes)", "Photography walk in Prague (budget-friendly spins)"]
  },
  // ... (Include all 25 personas here; truncated for brevity. Use the full list from your original documents, ensuring each has 'weights', 'description', 'tags', 'example_trips')
  {
    name: "The Homebound Hustler",
    weights: { Openness: -0.286, Conscientiousness: 0.286, Extraversion: -0.214, Agreeableness: 0, Neuroticism: 0.214 },
    description: "Hustle as the Homebound Hustler—a practical planner maximizing nearby gems with purpose, high Conscientiousness for structure and low Openness/Extraversion for familiar focus. Flightsnapp's curator hustles homebound: Quick snaps for staycations, budget drives for local parks, and short-hauls for weekends. Let's hustle homebound with intuitive, joyful curation like a vacation playlist hustling your local legends!",
    tags: ["Planner", "Local", "Practical", "Staycation"],
    example_trips: ["City staycation in Chicago (local activities)", "National park tour in the U.S. (budget drives)", "Weekend in Quebec City (short-hauls)"]
  }
];

// Persona weights for scoring
export const personaWeights: Record<string, Record<Trait, number>> = Object.fromEntries(
  PERSONAS.map(p => [p.name, p.weights])
);

// Center scores around 50
const center = (score: number): number => {
  return Math.max(0, Math.min(100, score - 50));
};

// Calculate strength of scores
const strength = (score: number): number => {
  return Math.abs(score - 50) / 50;
};

// Calculate trait scores
export const calculateTraitScores = (questionScores: number[]): { raw: Scores; centered: Scores; strength: Scores } => {
  if (!questionScores || questionScores.length !== 10) {
    throw new Error('Must provide exactly 10 question scores');
  }

  const rawAverages = [
    (questionScores[0] + questionScores[1]) / 2,
    (questionScores[2] + questionScores[3]) / 2,
    (questionScores[4] + questionScores[5]) / 2,
    (questionScores[6] + questionScores[7]) / 2,
    (questionScores[8] + questionScores[9]) / 2
  ];

  const raw: Scores = {
    Openness: ((rawAverages[0] - 1) / 4) * 100,
    Conscientiousness: ((rawAverages[1] - 1) / 4) * 100,
    Extraversion: ((rawAverages[2] - 1) / 4) * 100,
    Agreeableness: ((rawAverages[3] - 1) / 4) * 100,
    Neuroticism: ((rawAverages[4] - 1) / 4) * 100
  };

  const cent: Scores = {
    Openness: center(raw.Openness),
    Conscientiousness: center(raw.Conscientiousness),
    Extraversion: center(raw.Extraversion),
    Agreeableness: center(raw.Agreeableness),
    Neuroticism: center(raw.Neuroticism)
  };

  const str: Scores = {
    Openness: strength(raw.Openness),
    Conscientiousness: strength(raw.Conscientiousness),
    Extraversion: strength(raw.Extraversion),
    Agreeableness: strength(raw.Agreeableness),
    Neuroticism: strength(raw.Neuroticism)
  };

  return { raw, centered: cent, strength: str };
};

// Get persona based on trait scores
export const getPersona = (traitScores: Scores, followUpTags: string[] = []): Persona => {
  if (!traitScores || Object.keys(traitScores).length !== 5) {
    throw new Error('Must provide trait scores for all 5 traits');
  }

  // Assume traitScores is raw 0-100
  const centered: Scores = Object.fromEntries(
    Object.entries(traitScores).map(([k, v]) => [k, center(v)])
  ) as Scores;

  const fits = personaFit(centered, personaWeights);
  const selectedPersona = PERSONAS.find(p => p.name === fits[0].persona);
  if (!selectedPersona) {
    throw new Error('No matching persona found');
  }
  return { ...selectedPersona, tags: [...selectedPersona.tags, ...followUpTags] };
};

// Encrypt quiz result
export async function encryptQuizResult(data: { persona: Persona; scores: number[]; date: Date }): Promise<string> {
  try {
    const baseKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('flight-snapp-quiz-result'),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(16),
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(JSON.stringify(data))
    );
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt quiz result
export async function decryptQuizResult(encryptedData: string): Promise<{ persona: Persona; scores: number[]; date: Date } | null> {
  try {
    const baseKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('flight-snapp-quiz-result'),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(16),
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    const bytes = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
    const iv = bytes.slice(0, 12);
    const ct = bytes.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch (error) {
    return null;
  }
}

// Mock geolocation (replace with real implementation)
export async function getSecureGeoLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      error => reject(error),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
}