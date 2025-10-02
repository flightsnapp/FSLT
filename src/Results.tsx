import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { decryptQuizResult, Persona } from './utils/personaCalculator';

const Results = () => {
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [error, setError] = useState<string>('');

  const shareTextOptions: Record<string, string[]> = {
    "The Wild Trailblazer": [
      "Blazing trails as a Wild Trailblazer with @Flightsnapp! Ready for epic adventures! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Wild Trailblazer on @Flightsnapp, chasing uncharted vibes! Snapp your travel persona at www.flightsnapp.com!",
      "Wild Trailblazer mode activated via @Flightsnapp! Let’s explore the unknown! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Party Pathfinder": [
      "Lighting up the night as a Party Pathfinder with @Flightsnapp! Join the vibe! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Party Pathfinder on @Flightsnapp, ready for epic group vibes! Snapp your travel persona at www.flightsnapp.com!",
      "Party Pathfinder here via @Flightsnapp! Let’s make unforgettable memories! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Solo Dreamer": [
      "Dreaming solo as a Solo Dreamer with @Flightsnapp! Serenity awaits! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Solo Dreamer on @Flightsnapp, chasing quiet inspiration! Snapp your travel persona at www.flightsnapp.com!",
      "Solo Dreamer vibes with @Flightsnapp—ready for creative escapes! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Easygoing Roamer": [
      "Roaming easy as an Easygoing Roamer with @Flightsnapp! Chill vibes only! Snapp your travel persona at www.flightsnapp.com!",
      "I’m an Easygoing Roamer on @Flightsnapp, drifting to offbeat spots! Snapp your travel persona at www.flightsnapp.com!",
      "Easygoing Roamer here via @Flightsnapp—let’s go where the vibe feels right! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Adventure Architect": [
      "Building epic quests as an Adventure Architect with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m an Adventure Architect on @Flightsnapp, planning bold thrills! Snapp your travel persona at www.flightsnapp.com!",
      "Adventure Architect mode on via @Flightsnapp—let’s conquer new heights! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Comfort Crusader": [
      "Crusading for cozy vibes as a Comfort Crusader with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Comfort Crusader on @Flightsnapp, loving luxe escapes! Snapp your travel persona at www.flightsnapp.com!",
      "Comfort Crusader here via @Flightsnapp—ready for familiar fun! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Quiet Traditionalist": [
      "Chasing history as a Quiet Traditionalist with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Quiet Traditionalist on @Flightsnapp, savoring classic journeys! Snapp your travel persona at www.flightsnapp.com!",
      "Quiet Traditionalist vibes with @Flightsnapp—peaceful adventures await! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Steady Socialite": [
      "Mingling as a Steady Socialite with @Flightsnapp! Crew vibes on! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Steady Socialite on @Flightsnapp, ready for group fun! Snapp your travel persona at www.flightsnapp.com!",
      "Steady Socialite mode with @Flightsnapp—let’s connect and travel! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Nervous Nomad": [
      "Navigating cautiously as a Nervous Nomad with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Nervous Nomad on @Flightsnapp, seeking safe adventures! Snapp your travel persona at www.flightsnapp.com!",
      "Nervous Nomad here via @Flightsnapp—ready for secure explorations! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Coolheaded Captain": [
      "Steering the ship as a Coolheaded Captain with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Coolheaded Captain on @Flightsnapp, planning calm voyages! Snapp your travel persona at www.flightsnapp.com!",
      "Coolheaded Captain vibes with @Flightsnapp—group adventures await! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Impulsive Influencer": [
      "Chasing thrills as an Impulsive Influencer with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m an Impulsive Influencer on @Flightsnapp, ready for viral vibes! Snapp your travel persona at www.flightsnapp.com!",
      "Impulsive Influencer mode on via @Flightsnapp—let’s make it epic! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Lone Maverick": [
      "Forging my path as a Lone Maverick with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Lone Maverick on @Flightsnapp, chasing off-grid adventures! Snapp your travel persona at www.flightsnapp.com!",
      "Lone Maverick vibes with @Flightsnapp—ready for unique quests! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Friendly Voyager": [
      "Connecting as a Friendly Voyager with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Friendly Voyager on @Flightsnapp, loving group vibes! Snapp your travel persona at www.flightsnapp.com!",
      "Friendly Voyager here via @Flightsnapp—ready for eco-conscious trips! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Budget Buccaneer": [
      "Hunting deals as a Budget Buccaneer with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Budget Buccaneer on @Flightsnapp, scoring epic savings! Snapp your travel persona at www.flightsnapp.com!",
      "Budget Buccaneer mode with @Flightsnapp—let’s travel smart! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Lavish Logistician": [
      "Planning luxe escapes as a Lavish Logistician with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Lavish Logistician on @Flightsnapp, loving premium vibes! Snapp your travel persona at www.flightsnapp.com!",
      "Lavish Logistician here via @Flightsnapp—ready for opulent adventures! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Culture Chaser": [
      "Chasing heritage as a Culture Chaser with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Culture Chaser on @Flightsnapp, diving into traditions! Snapp your travel persona at www.flightsnapp.com!",
      "Culture Chaser vibes with @Flightsnapp—ready for immersive journeys! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Fearless Flyer": [
      "Soaring high as a Fearless Flyer with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Fearless Flyer on @Flightsnapp, chasing adrenaline! Snapp your travel persona at www.flightsnapp.com!",
      "Fearless Flyer mode with @Flightsnapp—let’s hit the skies! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Cozy Companion": [
      "Chasing cozy vibes as a Cozy Companion with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Cozy Companion on @Flightsnapp, loving familiar escapes! Snapp your travel persona at www.flightsnapp.com!",
      "Cozy Companion here via @Flightsnapp—ready for warm getaways! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Restless Ruler": [
      "Conquering as a Restless Ruler with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Restless Ruler on @Flightsnapp, chasing bold quests! Snapp your travel persona at www.flightsnapp.com!",
      "Restless Ruler vibes with @Flightsnapp—ready to rule the trip! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Zen Seeker": [
      "Finding peace as a Zen Seeker with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Zen Seeker on @Flightsnapp, chasing calm vibes! Snapp your travel persona at www.flightsnapp.com!",
      "Zen Seeker mode with @Flightsnapp—ready for serene escapes! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Squad Strategist": [
      "Planning epic squads as a Squad Strategist with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Squad Strategist on @Flightsnapp, uniting the crew! Snapp your travel persona at www.flightsnapp.com!",
      "Squad Strategist vibes with @Flightsnapp—ready for team adventures! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Casual Curator": [
      "Curating chill trips as a Casual Curator with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Casual Curator on @Flightsnapp, sampling unique vibes! Snapp your travel persona at www.flightsnapp.com!",
      "Casual Curator mode with @Flightsnapp—ready for eclectic escapes! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Edgy Empath": [
      "Chasing stories as an Edgy Empath with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m an Edgy Empath on @Flightsnapp, seeking deep connections! Snapp your travel persona at www.flightsnapp.com!",
      "Edgy Empath vibes with @Flightsnapp—ready for meaningful paths! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Grounded Globetrotter": [
      "Exploring with a Grounded Globetrotter vibe via @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Grounded Globetrotter on @Flightsnapp, planning epic trips! Snapp your travel persona at www.flightsnapp.com!",
      "Grounded Globetrotter mode with @Flightsnapp—ready for calm quests! Snapp your travel persona at www.flightsnapp.com!"
    ],
    "The Homebound Hustler": [
      "Hustling local gems as a Homebound Hustler with @Flightsnapp! Snapp your travel persona at www.flightsnapp.com!",
      "I’m a Homebound Hustler on @Flightsnapp, nailing staycations! Snapp your travel persona at www.flightsnapp.com!",
      "Homebound Hustler vibes with @Flightsnapp—ready for nearby wins! Snapp your travel persona at www.flightsnapp.com!"
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
      } catch (err) {
        setError('Error loading results: ' + (err instanceof Error ? err.message : String(err)));
      }
    };
    loadResults();
  }, []);

  const handleShareOnX = () => {
    if (!persona) return;
    const options = shareTextOptions[persona.name] || [
      `I'm a ${persona.name} on @Flightsnapp! Ready for ${persona.tags[0].toLowerCase()} adventures! Snapp your travel persona at www.flightsnapp.com!`
    ];
    const text = options[Math.floor(Math.random() * options.length)];
    const url = `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
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
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-6">Your Travel Persona: {persona.name}</h1>
          <p className="text-lg mb-8">{persona.description}</p>
          <div className="flex flex-wrap justify-center mb-8">
            {persona.tags.map(tag => (
              <span
                key={tag}
                className="mr-2 mb-2 px-3 py-1 bg-[#00FF7F] text-black rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">Suggested Trips</h2>
          <div className="flex flex-col items-center gap-4">
            {persona.example_trips.map(trip => (
              <motion.button
                key={trip}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#00FF7F] text-black font-bold rounded-lg w-full max-w-md disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled
              >
                Preflight: {trip}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-6 py-3 bg-[#00FF7F] text-black font-bold rounded-lg"
            onClick={() => navigate('/quiz')}
          >
            Retake Quiz
          </motion.button>
	{"                  "}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-6 py-3 bg-[#00FF7F] text-black font-bold rounded-lg"
            onClick={handleShareOnX}
          >
            Share on X
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;