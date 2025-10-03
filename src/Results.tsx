import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js'; // For static type reference
import { decryptQuizResult, Persona } from './utils/personaCalculator';
import { topPackages, weightsFromPersonaTags, Pkg, TagWeight, scorePackage } from './utils/scorePackage';
import { squadScore, makeSquadmates } from './utils/squadDemo';
import catalog from './utils/mock_packages.json';

const stripePromise = loadStripe('pk_test_51S0S0I0vUOeFawdmUtuWzmInQT5Ua9XSB0RxnWm4Qq0CCz64zpn3fTSWdXz5s5w3TkR3o05JmpxnU8rxEh4Tu3mZ00b8pkyknf');

const Results = () => {
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [error, setError] = useState<string>('');
  const [userTagWeights, setUserTagWeights] = useState<TagWeight | null>(null);
  const [squadMode, setSquadMode] = useState(false);
  const [squad, setSquad] = useState<{ mates: TagWeight[]; meta?: { score: number; cohesion: number; complementarity: number } } | null>(null);

  const shareTextOptions: Record<string, string[]> = {
    "The Wild Trailblazer": [
      "Blazing trails as a Wild Trailblazer with @Flightsnapp! Eyeing a {topPackage} adventure! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Wild Trailblazer on @Flightsnapp, ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Wild Trailblazer mode activated via @Flightsnapp! Pumped for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Party Pathfinder": [
      "Lighting up the night as a Party Pathfinder with @Flightsnapp! Vibing with {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Party Pathfinder on @Flightsnapp, set for {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Party Pathfinder here via @Flightsnapp! Hyped for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Solo Dreamer": [
      "Dreaming solo as a Solo Dreamer with @Flightsnapp! Planning {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Solo Dreamer on @Flightsnapp, chasing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Solo Dreamer vibes with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Easygoing Roamer": [
      "Roaming easy as an Easygoing Roamer with @Flightsnapp! Eyeing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m an Easygoing Roamer on @Flightsnapp, drifting to {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Easygoing Roamer here via @Flightsnapp—set for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Adventure Architect": [
      "Building epic quests as an Adventure Architect with @Flightsnapp! Planning {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m an Adventure Architect on @Flightsnapp, ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Adventure Architect mode on via @Flightsnapp—pumped for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Comfort Crusader": [
      "Crusading for cozy vibes as a Comfort Crusader with @Flightsnapp! Eyeing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Comfort Crusader on @Flightsnapp, set for {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Comfort Crusader here via @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Quiet Traditionalist": [
      "Chasing history as a Quiet Traditionalist with @Flightsnapp! Planning {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Quiet Traditionalist on @Flightsnapp, savoring {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Quiet Traditionalist vibes with @Flightsnapp—set for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Steady Socialite": [
      "Mingling as a Steady Socialite with @Flightsnapp! Eyeing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Steady Socialite on @Flightsnapp, ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Steady Socialite mode with @Flightsnapp—set for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Nervous Nomad": [
      "Navigating cautiously as a Nervous Nomad with @Flightsnapp! Planning {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Nervous Nomad on @Flightsnapp, set for {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Nervous Nomad here via @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Coolheaded Captain": [
      "Steering the ship as a Coolheaded Captain with @Flightsnapp! Eyeing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Coolheaded Captain on @Flightsnapp, planning {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Coolheaded Captain vibes with @Flightsnapp—set for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Impulsive Influencer": [
      "Chasing thrills as an Impulsive Influencer with @Flightsnapp! Hyped for {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m an Impulsive Influencer on @Flightsnapp, ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Impulsive Influencer mode on via @Flightsnapp—set for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Lone Maverick": [
      "Forging my path as a Lone Maverick with @Flightsnapp! Eyeing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Lone Maverick on @Flightsnapp, chasing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Lone Maverick vibes with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Friendly Voyager": [
      "Connecting as a Friendly Voyager with @Flightsnapp! Planning {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Friendly Voyager on @Flightsnapp, loving {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Friendly Voyager here via @Flightsnapp—set for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Budget Buccaneer": [
      "Hunting deals as a Budget Buccaneer with @Flightsnapp! Eyeing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Budget Buccaneer on @Flightsnapp, scoring {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Budget Buccaneer mode with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Lavish Logistician": [
      "Planning luxe escapes as a Lavish Logistician with @Flightsnapp! Eyeing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Lavish Logistician on @Flightsnapp, loving {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Lavish Logistician here via @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Culture Chaser": [
      "Chasing heritage as a Culture Chaser with @Flightsnapp! Planning {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Culture Chaser on @Flightsnapp, diving into {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Culture Chaser vibes with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Fearless Flyer": [
      "Soaring high as a Fearless Flyer with @Flightsnapp! Hyped for {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Fearless Flyer on @Flightsnapp, chasing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Fearless Flyer mode with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Cozy Companion": [
      "Chasing cozy vibes as a Cozy Companion with @Flightsnapp! Eyeing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Cozy Companion on @Flightsnapp, loving {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Cozy Companion here via @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Restless Ruler": [
      "Conquering as a Restless Ruler with @Flightsnapp! Planning {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Restless Ruler on @Flightsnapp, chasing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Restless Ruler vibes with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Zen Seeker": [
      "Finding peace as a Zen Seeker with @Flightsnapp! Planning {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Zen Seeker on @Flightsnapp, chasing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Zen Seeker mode with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Squad Strategist": [
      "Planning epic squads as a Squad Strategist with @Flightsnapp! Eyeing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Squad Strategist on @Flightsnapp, uniting for {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Squad Strategist vibes with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Casual Curator": [
      "Curating chill trips as a Casual Curator with @Flightsnapp! Eyeing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Casual Curator on @Flightsnapp, sampling {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Casual Curator mode with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Edgy Empath": [
      "Chasing stories as an Edgy Empath with @Flightsnapp! Planning {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m an Edgy Empath on @Flightsnapp, seeking {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Edgy Empath vibes with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Grounded Globetrotter": [
      "Exploring with a Grounded Globetrotter vibe via @Flightsnapp! Planning {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Grounded Globetrotter on @Flightsnapp, set for {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Grounded Globetrotter mode with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Homebound Hustler": [
      "Hustling local gems as a Homebound Hustler with @Flightsnapp! Eyeing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Homebound Hustler on @Flightsnapp, nailing {topPackage}! Snapp your travel persona at www.flightsnapp.com!",
      "Homebound Hustler vibes with @Flightsnapp—ready for {topPackage}! Snapp your travel persona at www.flightsnapp.com!"
    ]
  };

  useEffect(() => {
    const loadResults = async () => {
      try {
        const encrypted = localStorage.getItem('quizResult');
        if (!encrypted) {
          setError('No quiz results found. Please take the quiz first.');
          return;
        }
        const result = await decryptQuizResult(encrypted);
        if (!result) {
          setError('Failed to load results. Please try again.');
          return;
        }
        setPersona(result.persona);
        if (result.persona?.tags?.length) {
          setUserTagWeights(weightsFromPersonaTags(result.persona.tags));
        } else {
          setUserTagWeights({});
        }
      } catch (err) {
        setError('Error loading results: ' + (err instanceof Error ? err.message : String(err)));
      }
    };
    loadResults();
  }, []);

  useEffect(() => {
    if (!squadMode || !userTagWeights) {
      setSquad(null);
      return;
    }
    const mates = makeSquadmates(userTagWeights);
    const meta = squadScore([userTagWeights, ...mates]);
    setSquad({ mates, meta });
  }, [squadMode, userTagWeights]);

  const { top3, usedWeights } = useMemo(() => {
    if (!userTagWeights) return { top3: [], usedWeights: {} as TagWeight };
    const scored = (catalog as unknown as Pkg[]).map(p => {
      const matched = Object.keys(userTagWeights).filter(t => userTagWeights[t] > 0 && p.tags.includes(t));
      return { pkg: p, matched, score: scorePackage(userTagWeights, p) };
    });
    const sorted = scored.sort((a, b) => b.score - a.score);
    let top3 = sorted.slice(0, 3);
    if (!sorted.some(s => s.matched.length > 0)) {
      const broad = new Set(["Nightlife", "Adventure", "Culture", "Wellness", "Budget", "Luxury", "Group", "Solo", "Planner", "Spontaneous"]);
      const preferred = (catalog as unknown as Pkg[])
        .filter(p => p.tags.some(t => broad.has(t)))
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      top3 = preferred.slice(0, 3).map(p => ({ pkg: p, matched: [], score: 0 }));
    }
    const squadBias = squadMode && top3.some(t => t.pkg.group_suitability && t.pkg.group_suitability.cohesion_min <= (squad?.meta?.score ?? 0));
    if (squadBias) {
      const groupish = new Set(["Group", "Connector", "Planner", "Nightlife", "Adventure", "Organizer"]);
      top3 = top3.sort((a, b) => {
        const ag = a.pkg.tags.some(t => groupish.has(t)) ? 1 : 0;
        const bg = b.pkg.tags.some(t => groupish.has(t)) ? 1 : 0;
        return bg - ag;
      });
      if (squad?.meta && squad.meta.score >= 0.7) {
        const groupPkg = (catalog as unknown as Pkg[]).find(p => p.id === "4"); // Croatia Villa
        if (groupPkg && !top3.some(t => t.pkg.id === "4")) {
          top3.pop();
          top3.unshift({ pkg: groupPkg, matched: groupPkg.tags.filter(t => userTagWeights[t] > 0), score: scorePackage(userTagWeights, groupPkg) });
        }
      }
    }
    return { top3, usedWeights: userTagWeights };
  }, [squadMode, userTagWeights, squad]);

  const handleShareOnX = () => {
    if (!persona || !top3[0]) return;
    const topPackage = top3[0].pkg.title;
    const options = (shareTextOptions[persona.name] || [
      `I'm a ${persona.name} on @Flightsnapp! Ready for ${persona.tags?.[0]?.toLowerCase() ?? 'wild'} adventures! Snapp your travel persona at www.flightsnapp.com!`
    ]).map(text => text.replace('{topPackage}', topPackage));
    const text = options[Math.floor(Math.random() * options.length)];
    const url = `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

const handleUnlockBeta = async () => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      alert('Stripe not loaded. Please try again.');
      return;
    }
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        persona: persona?.name || 'User', // Your personalization, with fallback
      }),
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const { sessionId, error } = await response.json();
    if (error) {
      alert('Checkout failed: ' + error);
      return;
    }
    if (!sessionId) {
      alert('Failed to create checkout session. Please try again.');
      return;
    }
    // Match deployed: Use 'as any' to bypass TS (works since method exists at runtime)
    await (stripe as any).redirectToCheckout({ sessionId });
  } catch (error) {
    alert('Checkout failed: ' + (error instanceof Error ? error.message : String(error)));
  }
};

  if (error) {
    return (
      <div className="page-container">
        <div className="page-content flex flex-col items-center justify-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[#00FF7F] text-black font-bold rounded-lg"
            onClick={() => navigate('/quiz')}
          >
            Retake Quiz
          </motion.button>
        </div>
      </div>
    );
  }
  if (!persona) {
    return (
      <div className="page-container">
        <div className="page-content flex flex-col items-center justify-center text-white">
          <p>Loading your travel persona...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="page-container">
      <div className="page-content flex flex-col items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center w-full max-w-5xl"
        >
          <h1 className="text-4xl font-bold mb-4">Your Travel Persona: {persona.name}</h1>
          <p className="text-lg mb-6">{persona.description}</p>
          {!!persona.tags?.length && (
            <div className="flex flex-wrap justify-center mb-8 gap-2">
              {persona.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#00FF7F] text-black rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center gap-3 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={squadMode} onChange={e => setSquadMode(e.target.checked)} />
              <span className="text-sm">Squad Mode</span>
            </label>
            {squad?.meta && (
              <span className="px-3 py-1 rounded-full bg-[#00FF7F] text-black text-sm font-bold">
                Vibe-Match: {Math.round(squad.meta.score * 100)}%
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-4">Curated Snapp Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {top3.map(({ pkg, matched }) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -4 }}
                className="bg-[rgba(26,42,68,0.95)] rounded-2xl overflow-hidden border border-[#00FFFF]"
              >
                {pkg.images?.[0] ? (
                  <img
                    src={pkg.images[0]}
                    alt={`${pkg.title} in ${pkg.destination}`}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-[#1A2A44] to-[#0f172a] flex items-center justify-center">
                    <span className="text-[#3DB2C2] text-sm">Snapp preview coming soon!</span>
                  </div>
                )}
                <div className="p-4 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold text-[#3DB2C2]">{pkg.title}</h3>
                    {pkg.rating ? (
                      <span className="text-sm text-[#3DB2C2]">★ {pkg.rating.toFixed(1)}</span>
                    ) : null}
                  </div>
                  <div className="text-sm text-[#3DB2C2] mb-2">
                    {pkg.destination} • {pkg.duration_nights} nights
                  </div>
                  <div className="text-lg font-semibold mb-2 text-[#3DB2C2]">
                    ${pkg.price_per_person_usd.toLocaleString()} <span className="text-sm font-normal text-[#3DB2C2]/70">pp</span>
                  </div>
                  <p className="text-sm text-[#3DB2C2] mb-3 line-clamp-3">{pkg.summary}</p>
                  {matched.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs uppercase tracking-wide text-[#3DB2C2]/60 mb-1">Because you’re</div>
                      <div className="flex flex-wrap gap-1">
                        {matched.slice(0, 4).map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full bg-[#00FF7F] text-black text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <a
                      href={pkg.affiliate?.booking_url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#00FF7F] text-black font-bold rounded-lg"
                      onClick={(e) => {
                        if (!pkg.affiliate?.booking_url) {
                          e.preventDefault();
                          alert('Demo package — booking link coming soon.');
                        }
                      }}
                    >
                      Book (demo)
                    </a>
                    <div className="hidden md:flex flex-wrap gap-1 max-w-[50%] justify-end">
                      {pkg.tags.slice(0, 5).map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-[#00FF7F]/20 text-[#3DB2C2] text-xs border border-[#00FFFF]/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#00FF7F] text-black font-bold rounded-lg"
              onClick={() => navigate('/quiz')}
            >
              Retake Quiz
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#00FF7F] text-black font-bold rounded-lg"
              onClick={handleShareOnX}
            >
              Share on X
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#00FF7F] text-black font-bold rounded-lg"
              onClick={handleUnlockBeta}
            >
              UNLOCK BETA Q1 2026
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;