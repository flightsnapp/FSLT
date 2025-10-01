```typescript
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { normalize, personaFit } from './utils/scoreEngine.ts';
import { getPersona, calculateTraitScores, encryptQuizResult, getSecureGeoLocation, personaWeights } from './utils/personaCalculator.ts';

// Define types
interface Scores {
  Openness: number;
  Conscientiousness: number;
  Extraversion: number;
  Agreeableness: number;
  Neuroticism: number;
}

interface Persona {
  name: string;
  description: string;
  tags: string[];
  example_trips: string[];
  weights: Scores;
}

interface Question {
  question: string;
  trait: string;
  direction: 'direct' | 'reverse';
  feedback: { [key: number]: string };
}

interface FollowUpQuestion {
  question: string;
  tag: string;
}

type Stage = 'welcome' | 'core' | 'follow-up' | 'reveal' | 'results';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [scores, setScores] = useState<number[]>(new Array(10).fill(3));
  const [prelimPersona, setPrelimPersona] = useState<Persona | null>(null);
  const [finalPersona, setFinalPersona] = useState<Persona | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [progressFilled, setProgressFilled] = useState<number>(0);
  const [consent, setConsent] = useState<boolean>(false);
  const [departureCity, setDepartureCity] = useState<string>('');
  const [isGeoLoading, setIsGeoLoading] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string>('');
  const [followUpScores, setFollowUpScores] = useState<number[]>([3, 3, 3]);
  const [currentFollowUp, setCurrentFollowUp] = useState<number>(0);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [geoConsent, setGeoConsent] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 10 core questions
  const questions: Question[] = [
    {
      question: "If someone dares me to try something ridiculous, I'm already halfway in.",
      trait: "openness",
      direction: "direct",
      feedback: {
        1: "Classic-comfort connoisseur—predictable can be perfect.",
        2: "Comfort-first with a hint of curiosity. Solid.",
        3: "Balanced explorer—open, but not reckless.",
        4: "Certified novelty chaser—stories pending.",
        5: "Unapologetic chaos magnet. We salute you."
      }
    },
    {
      question: "New is overrated—my comfort classics slap every time.",
      trait: "openness",
      direction: "reverse",
      feedback: {
        1: "New thrills > reruns—pure discovery energy.",
        2: "Leans fresh over familiar—nice.",
        3: "Equal parts classic and curious.",
        4: "Tradition lover—reliable vibes.",
        5: "Comfort king/queen—five-star familiar."
      }
    },
    {
      question: "I color-code itineraries like I'm launching a mission.",
      trait: "conscientiousness",
      direction: "direct",
      feedback: {
        1: "Free spirit unlocked—you'll wing it just fine.",
        2: "Loose planner—enough structure to play.",
        3: "Balanced—checklist meets vibes.",
        4: "Precision pilot—smooth ops ahead.",
        5: "General of logistics—nothing escapes the plan."
      }
    },
    {
      question: "Prep is optional—vibes will decide the plan when we land.",
      trait: "conscientiousness",
      direction: "reverse",
      feedback: {
        1: "Schedule loyalist—chaos denied.",
        2: "Structure-friendly with wiggle room.",
        3: "Go-with-the-flow realist.",
        4: "Spontaneous operator—embraces the swirl.",
        5: "YOLO tactician—we'll figure it out live."
      }
    },
    {
      question: "Give me a mic, a crowd, and bad karaoke—vacation mode engaged.",
      trait: "extraversion",
      direction: "direct",
      feedback: {
        1: "Solo fuel—quiet wins.",
        2: "Mostly low-key with social spice.",
        3: "Ambivert—you can flip either switch.",
        4: "People-powered—stage ready.",
        5: "Headliner energy—crowd surfer."
      }
    },
    {
      question: "Crowded rooms drain me—my playlist and bubble revive me.",
      trait: "extraversion",
      direction: "reverse",
      feedback: {
        1: "Crowd surfer—noise is nectar.",
        2: "Social-leaning but adaptable.",
        3: "Balanced—alone or together works.",
        4: "Solo-leaning—protects the battery.",
        5: "Certified lone wolf—peace is premium."
      }
    },
    {
      question: "If a friend texts 'help—moving chaos,' I'm sweating before I reply.",
      trait: "agreeableness",
      direction: "direct",
      feedback: {
        1: "Boundary boss—plans come first.",
        2: "Selective helper—fair trade energy.",
        3: "Situational softie—case by case.",
        4: "Reliable ride-or-die.",
        5: "Saint status—crew's MVP."
      }
    },
    {
      question: "Drama erupts? I'm booking a solo table and minding my bliss.",
      trait: "agreeableness",
      direction: "reverse",
      feedback: {
        1: "Glue friend—de-dramas the room.",
        2: "Mediator-leaning when needed.",
        3: "Flexible—help or dip as required.",
        4: "Independent operator—unbothered.",
        5: "Maverick mode—solo ticket secured."
      }
    },
    {
      question: "Dead battery, lost keys, delayed flight—my brain hits sirens fast.",
      trait: "neuroticism",
      direction: "direct",
      feedback: {
        1: "Chill deity—zen armor equipped.",
        2: "Mostly calm—small ripples only.",
        3: "Manageable jitters—you adapt.",
        4: "Alert planner—backup on standby.",
        5: "Anxiety athlete—lists save lives."
      }
    },
    {
      question: "When trips go sideways, I laugh, pivot, and order a piña colada.",
      trait: "neuroticism",
      direction: "reverse",
      feedback: {
        1: "Contingency captain—likes control.",
        2: "Prepared realist—keeps receipts.",
        3: "Roll-with-it neutral.",
        4: "Unfazed—pivot specialist.",
        5: "Unbothered icon—chaos is content."
      }
    }
  ];

  // Follow-up questions based on prelimPersona name
  const personalityQuestions: { [key: string]: FollowUpQuestion[] } = {
    "The Wild Trailblazer": [
      { question: "Give me chaos over checklists—let the city decide the plot twists.", tag: "Spontaneous" },
      { question: "If locals love it and tourists miss it, that's my compass.", tag: "Offbeat" },
      { question: "Sunrise is just the after-party—one more stop, always.", tag: "Nightlife" }
    ],
    "The Party Pathfinder": [
      { question: "Crowds, confetti, and bass drops are my natural habitat.", tag: "Festival" },
      { question: "I pick destinations where the night refuses to end.", tag: "Nightlife" },
      { question: "Trips hit harder with a hype squad on speed dial.", tag: "Group" }
    ],
    "The Solo Dreamer": [
      { question: "Solo time turns my brain into an art studio.", tag: "Solo" },
      { question: "Silence and soft light beat schedules and small talk.", tag: "Wellness" },
      { question: "I map trips by indie galleries, cafes, and poetry corners.", tag: "Cultural" }
    ],
    "The Easygoing Roamer": [
      { question: "Slow mornings and loose timelines are non-negotiable.", tag: "Relaxed" },
      { question: "Detours over deadlines—if it feels right, I'm in.", tag: "Flexible" },
      { question: "Give me hammock towns and eco-chill over neon traps.", tag: "Eco" }
    ],
    "The Adventure Architect": [
      { question: "I like trips with clean blocks: move, eat, conquer, repeat.", tag: "Planner" },
      { question: "Summits, dives, and distance goals make me grin.", tag: "Adventure" },
      { question: "Certified guides and eco creds make it a yes.", tag: "Eco" }
    ],
    "The Comfort Crusader": [
      { question: "Resorts, cruises, familiar comforts—reset me gently.", tag: "Comfort" },
      { question: "Shared routines with the crew keep trips smooth.", tag: "Group" },
      { question: "All-inclusive? My love language.", tag: "Luxury" }
    ],
    "The Quiet Traditionalist": [
      { question: "Give me landmarks, libraries, and legacy over hype.", tag: "History" },
      { question: "Predictable, low-noise spaces refill my soul.", tag: "Calm" },
      { question: "Solo pacing > group scramble.", tag: "Solo" }
    ],
    "The Steady Socialite": [
      { question: "Small-group villas and shared dinners are my sweet spot.", tag: "Group" },
      { question: "I like a plan with breathing room for surprises.", tag: "Balanced" },
      { question: "I end up hosting, organizing, and vibing the table.", tag: "Connector" }
    ],
    "The Nervous Nomad": [
      { question: "Checklists, backups, and receipts = my calm kit.", tag: "Security-Seeker" },
      { question: "I trust places with tight logistics and clear reviews.", tag: "Guided" },
      { question: "I'll try spice… with safety nets.", tag: "Cautious" }
    ],
    "The Coolheaded Captain": [
      { question: "When travel wobbles, I steady the ship.", tag: "Calm" },
      { question: "I naturally end up making the call for the group.", tag: "Leader" },
      { question: "I plan ahead, then pivot like it was the plan.", tag: "Adaptable" }
    ],
    "The Impulsive Influencer": [
      { question: "Flash sale spotted—I'm booked before the scroll ends.", tag: "Last-Minute" },
      { question: "If it doesn't hit the feed, did it even happen?", tag: "Influencer" },
      { question: "I travel better with a loud, laughing crew.", tag: "Social" }
    ],
    "The Lone Maverick": [
      { question: "I'm happiest steering solo at my own pace.", tag: "Solo" },
      { question: "Remote, off-grid, low-signal spots call my name.", tag: "Off-Grid" },
      { question: "I'll risk a little for a story no one else has.", tag: "Risk-Taker" }
    ],
    "The Friendly Voyager": [
      { question: "Homestays, shared tables, and neighbor vibes are my scene.", tag: "Community" },
      { question: "Group tours help me find my people fast.", tag: "Group" },
      { question: "I pick greener options whenever it's possible.", tag: "Eco" }
    ],
    "The Budget Buccaneer": [
      { question: "Under-$500 masterpieces are my obsession.", tag: "Budget" },
      { question: "Hostels and shared rooms? Social savings.", tag: "Hostel" },
      { question: "I'll swap speed for savings and call it strategy.", tag: "Frugal" }
    ],
    "The Lavish Logistician": [
      { question: "Premium stays with details dialed to perfection.", tag: "Luxury" },
      { question: "White-glove itineraries make me purr.", tag: "Planner" },
      { question: "Yes to tasting menus, yachts, and once-ever moments.", tag: "Gourmet" }
    ],
    "The Culture Chaser": [
      { question: "Museums, galleries, stages—put them on my path.", tag: "Culture" },
      { question: "I want rituals, customs, and real conversations.", tag: "Immersion" },
      { question: "I prefer slow, sustainable routes to heritage sites.", tag: "Eco" }
    ],
    "The Fearless Flyer": [
      { question: "Adrenaline itineraries? Inject them straight in.", tag: "Thrill-Seeker" },
      { question: "Fear rarely wins the argument with me.", tag: "Fearless" },
      { question: "Fast-move cities and tight turnarounds hype me up.", tag: "Adventure" }
    ],
    "The Cozy Companion": [
      { question: "Familiar amenities > surprises I didn't order.", tag: "Comfort" },
      { question: "Everything's better with my favorite human beside me.", tag: "Companion" },
      { question: "I like a comfy 'home base' between forays.", tag: "Home-Base" }
    ],
    "The Restless Ruler": [
      { question: "I set the vision and I love steering the pace.", tag: "Leader" },
      { question: "Exclusive events and upgrades tempt me instantly.", tag: "Luxury" },
      { question: "No-plan meltdown? I need options on deck.", tag: "Control" }
    ],
    "The Zen Seeker": [
      { question: "Trips are for slowing down and remembering to breathe.", tag: "Wellness" },
      { question: "Forests, springs, coastlines—nature is medicine.", tag: "Nature" },
      { question: "Gentle routines > frantic checklists.", tag: "Calm" }
    ],
    "The Squad Strategist": [
      { question: "I love assigning roles and wrangling timelines.", tag: "Organizer" },
      { question: "Shared villas + team rituals = peak group joy.", tag: "Group" },
      { question: "Games, challenges, surprise missions? Say less.", tag: "Gamified" }
    ],
    "The Casual Curator": [
      { question: "I sample a bit of everything, never in a rush.", tag: "Balanced" },
      { question: "Street food, markets, and local art are my map pins.", tag: "Cultural" },
      { question: "If something cooler appears, the plan can move.", tag: "Flexible" }
    ],
    "The Edgy Empath": [
      { question: "Alt scenes and subcultures feel like home base.", tag: "Alternative" },
      { question: "I hunt for human stories, not photo ops.", tag: "Empathy" },
      { question: "I'll try ideas that respectfully challenge my lens.", tag: "Perspective" }
    ],
    "The Grounded Globetrotter": [
      { question: "Big horizons, solid structure—both, please.", tag: "Planner" },
      { question: "Give me meaningful hikes and history over hype.", tag: "Adventure" },
      { question: "Low-fuss logistics keep me present.", tag: "Calm" }
    ],
    "The Homebound Hustler": [
      { question: "Local wins: staycations and short hops fit my life.", tag: "Local" },
      { question: "I squeeze magic out of weekends with tight agendas.", tag: "Planner" },
      { question: "Nearby gems beat long-haul marathons for me.", tag: "Practical" }
    ]
  };

  // Timer for auto-advance after user interaction
  const handleSliderChange = (value: number) => {
    const newScores = [...scores];
    newScores[currentQuestion] = value;
    setScores(newScores);
    // Set timer for auto-advance after 1 second
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (currentQuestion < 9) {
        handleNext();
      } else {
        handleCoreComplete();
      }
    }, 1000);
  };

  const handleNext = () => {
    setProgressFilled((currentQuestion + 1) / 10 * 100);
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleCoreComplete();
    }
  };

  const handleCoreComplete = () => {
    // Sanitize scores: clamp to 1-5, default to 3 on NaN
    const sanitizedScores = scores.slice(0, 10).map(s => isNaN(s) || s < 1 || s > 5 ? 3 : s);
    // Adjust reversed questions: score = 6 - value to flip Likert scale
    const adjustedScores = sanitizedScores.map((score, idx) =>
      questions[idx].direction === 'reverse' ? 6 - score : score
    );
    const traitScores: Scores = calculateTraitScores(adjustedScores);
    const persona = getPersona(traitScores);
    console.log("Calculated trait scores:", traitScores);
    console.log("Selected persona:", persona.name, "tags:", persona.tags);
    setPrelimPersona(persona);
    setStage('follow-up');
  };

  const handleFollowUpComplete = () => {
    const followUpQuestions = personalityQuestions[prelimPersona!.name] || [];
    const newTags = [...prelimPersona!.tags];
    followUpQuestions.forEach((q, i) => {
      if (followUpScores[i] >= 4 && !newTags.includes(q.tag)) {
        newTags.push(q.tag);
      }
    });
    setFinalPersona({ ...prelimPersona!, tags: newTags });
    setStage('reveal');
  };

  const handleFollowUpChange = (value: number) => {
    const newScores = [...followUpScores];
    newScores[currentFollowUp] = value;
    setFollowUpScores(newScores);
    // Auto-advance after 1 second
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (currentFollowUp < 2) {
        handleNextFollowUp();
      } else {
        handleFollowUpComplete();
      }
    }, 1000);
  };

  const handleNextFollowUp = () => {
    setCurrentFollowUp(currentFollowUp + 1);
  };

  const handleRevealComplete = async () => {
    try {
      const encrypted = await encryptQuizResult({ persona: finalPersona, scores, date: new Date() });
      localStorage.setItem('quizResult', encrypted);
      navigate('/results');
    } catch (error) {
      alert(`Encryption failed (${(error as Error).message}), using insecure storage for demo.`);
      // Fallback to insecure for MVP
      localStorage.setItem('quizResult', JSON.stringify({ persona: finalPersona, scores, date: new Date() }));
      navigate('/results');
    }
  };

  const getLocation = async () => {
    console.log('Requesting geolocation...');
    setIsGeoLoading(true);
    setGeoError('');
    try {
      const coords = await getSecureGeoLocation();
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
        {
          signal: AbortSignal.timeout(5000) // 5s timeout for reverse geocode
        }
      );
      const data = await response.json();
      const city = data.display_name.split(',')[0] || data.display_name;
      setDepartureCity(city);
      localStorage.setItem('departureCity', city);
    } catch (err) {
      setGeoError('Failed to get location: ' + (err as Error).message);
    } finally {
      setIsGeoLoading(false);
    }
  };

  const ParticleBurst: React.FC<{ visible: boolean }> = ({ visible }) => (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            scale: [1, 1.5, 0],
            opacity: [1, 0.8, 0]
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-green-400 rounded-full absolute"
              initial={{
                x: 0,
                y: 0,
                opacity: 1
              }}
              animate={{
                x: Math.cos(i * 30 * Math.PI / 180) * 60,
                y: Math.sin(i * 30 * Math.PI / 180) * 60,
                opacity: 0
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const Badge: React.FC<{ text: string; visible: boolean }> = ({ text, visible }) => (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-lg px-4 py-2 shadow-lg"
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const Milestone: React.FC<{ visible: boolean; text: string }> = ({ visible, text }) => (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-yellow-400 rounded-full flex items-center justify-center text-white text-sm"
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ProgressBar: React.FC = () => (
    <motion.div
      className="w-full h-4 bg-gray-600 rounded-full overflow-hidden mb-4"
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-green-400 to-green-600"
        initial={{ width: `${progressFilled}%` }}
        animate={{ width: `${progressFilled}%` }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );

  // Slider custom component for spin effect
  const Slider: React.FC<{
    value: number;
    onChange: (value: number) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
  }> = ({ value, onChange, onDragStart, onDragEnd }) => {
    return (
      <div className="w-full max-w-md mx-auto">
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={value}
          onInput={(e) => {
            const val = parseFloat((e.target as HTMLInputElement).value);
            onChange(val);
          }}
          onMouseDown={onDragStart}
          onMouseUp={onDragEnd}
          onTouchStart={onDragStart}
          onTouchEnd={onDragEnd}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #00FF7F 0%, #00FF7F ${(value - 1) / 4 * 100}%, #444 ${(value - 1) / 4 * 100}%, #444 100%)`
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            height: 30px;
            width: 30px;
            border-radius: 50%;
            background: #00FF7F;
            cursor: pointer;
            animation: ${isDragging ? 'spin 0.5s linear infinite' : 'none'};
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          input[type="range"]::-moz-range-thumb {
            height: 30px;
            width: 30px;
            border-radius: 50%;
            background: #00FF7F;
            cursor: pointer;
            border: none;
            animation: ${isDragging ? 'spin 0.5s linear infinite' : 'none'};
          }
        `}</style>
        <div className="flex justify-between mt-2 text-sm">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>
      </div>
    );
  };

  const handleModalProceed = async () => {
    if (!termsChecked) {
      alert('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (geoConsent === 'yes') {
      await getLocation();
    } else if (geoConsent === 'no') {
      setDepartureCity(region || 'Global');
    } else {
      alert('Please select a location consent option.');
      return;
    }
    setModalOpen(false);
    setStage('core');
  };

  if (stage === 'welcome') {
    return (
      <div className="page-container">
        <div className="page-content flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold mb-6">Discover Your Travel Persona</h1>
          <p className="mb-8 text-center">Let's figure out your yolo travel vibe with rapid-fire questions!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-[#00FF7F] text-black font-bold rounded-lg"
            onClick={() => setModalOpen(true)}
          >
            Start Quiz
          </motion.button>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[rgba(26,42,68,0.95)] text-[#3DB2C2] p-6 rounded-lg max-w-2xl w-full max-h-full overflow-y-auto border border-[#00FFFF]">
                <h2 className="text-2xl font-bold mb-4">Welcome to Flightsnapp!</h2>
                <p className="mb-4">We're thrilled to curate your dream YOLO escape—let's spin some personalized travel magic! Before we dive in:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    <strong>Purpose:</strong> Your Big 5 quiz responses power our hybrid AI curator to deliver hyper-personalized, one-of-a-kind recommendations tailored to your personality (e.g., adventure spins for high Openness or serene retreats for low Neuroticism).
                  </li>
                  <li>
                    <strong>Privacy:</strong> We prioritize your data like a 5-star vault—responses are anonymized, encrypted, and stored securely. No personally identifiable info is collected unless you share it. Dive deeper into our{' '}
                    <a href="/privacy-policy" className="text-blue-400 underline" target="_blank">
                      Privacy Policy
                    </a>
                    .
                  </li>
                  <li>
                    <strong>Consent:</strong> Participating in the quiz is your ticket to fun—required for recommendations; optional for using anonymized data to refine our AI and keep the vibes fresh for everyone.
                  </li>
                  <li>
                    <strong>Disclaimer:</strong> Our snaps are joyful suggestions only—Flightsnapp isn't responsible for trip outcomes, bookings, or real-world adventures. Always verify details with partners like Amadeus or Tiqets.
                  </li>
                </ul>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={termsChecked}
                      onChange={(e) => setTermsChecked(e.target.checked)}
                      className="mr-2"
                    />
                    I agree to the{' '}
                    <a href="/terms-of-service" className="text-blue-400 underline" target="_blank">
                      Terms of Service
                    </a>{' '}
                    and<br />
                    <a href="/privacy-policy" className="text-blue-400 underline" target="_blank">
                      Privacy Policy
                    </a>{' '}
                    (required to unlock your personalized snaps).
                  </label>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Location Consent</h3>
                  <p className="mb-2">Want spot-on recommendations tuned to your corner of the world? Grant us location access for precise, real-time curation!</p>
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="geo-consent"
                      value="yes"
                      checked={geoConsent === 'yes'}
                      onChange={(e) => setGeoConsent(e.target.value)}
                      className="mr-2"
                    />
                    Yes, beam me up precise vibes!
                  </label>
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="geo-consent"
                      value="no"
                      checked={geoConsent === 'no'}
                      onChange={(e) => setGeoConsent(e.target.value)}
                      className="mr-2"
                    />
                    No thanks, keep it global.
                  </label>
                  {geoConsent === 'no' && (
                    <div id="region-select" className="mb-4">
                      <h4 className="text-md font-semibold mb-2">Select your region</h4>
                      {['Canada', 'USA', 'Mexico', 'Europe', 'Africa', 'Australia', 'Asia'].map(r => (
                        <label key={r} className="flex items-center mb-1">
                          <input
                            type="radio"
                            name="region"
                            value={r}
                            checked={region === r}
                            onChange={(e) => setRegion(e.target.value)}
                            className="mr-2"
                          />
                          {r}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-[#00FF7F] text-black font-bold rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
                  disabled={!termsChecked || !geoConsent || (geoConsent === 'no' && !region)}
                  onClick={handleModalProceed}
                >
                  Let's Snap to It!
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (stage === 'core') {
    return (
      <div className="page-container">
        <div className="page-content flex flex-col items-center justify-center text-white relative">
          <ProgressBar />
          <div className="text-center mb-8">
            <p className="text-lg">Question {currentQuestion + 1}/10</p>
            <p className="text-2xl font-bold">{questions[currentQuestion].question}</p>
          </div>
          <Slider
            value={scores[currentQuestion]}
            onChange={handleSliderChange}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          />
          <ParticleBurst visible={!isDragging} />
        </div>
      </div>
    );
  }

  if (stage === 'follow-up') {
    if (!prelimPersona) {
      return (
        <div className="min-h-screen bg-[rgba(26,42,68,0.95)] flex items-center justify-center text-white">
          Analyzing your responses...
        </div>
      );
    }
    const followUpQuestions = personalityQuestions[prelimPersona.name] || [];
    if (currentFollowUp >= followUpQuestions.length) {
      return (
        <div className="min-h-screen bg-[rgba(26,42,68,0.95)] flex items-center justify-center text-white">
          Analyzing your responses...
        </div>
      );
    }
    const currentQuestionItem = followUpQuestions[currentFollowUp];
    return (
      <div className="page-container">
        <div className="page-content flex flex-col items-center justify-center text-white relative">
          <motion.div
            className="w-full h-4 bg-gray-600 rounded-full overflow-hidden mb-4"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-green-600"
              initial={{ width: `${(currentFollowUp / followUpQuestions.length) * 100}%` }}
              animate={{ width: `${((currentFollowUp + 1) / followUpQuestions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
          <div className="text-center mb-8">
            <p className="text-lg">Refinement Question {currentFollowUp + 1}/{followUpQuestions.length}</p>
            <p className="text-2xl font-bold">{currentQuestionItem.question}</p>
          </div>
          <div className="w-full max-w-md mx-auto">
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={followUpScores[currentFollowUp]}
              onChange={(e) => handleFollowUpChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00FF7F 0%, #00FF7F ${
                  (followUpScores[currentFollowUp] - 1) / 4 * 100
                }%, #444 ${(followUpScores[currentFollowUp] - 1) / 4 * 100}%, #444 100%)`
              }}
            />
            <style>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                height: 30px;
                width: 30px;
                border-radius: 50%;
                background: #00FF7F;
                cursor: pointer;
              }
              input[type="range"]::-moz-range-thumb {
                height: 30px;
                width: 30px;
                border-radius: 50%;
                background: #00FF7F;
                cursor: pointer;
                border: none;
              }
            `}</style>
            <div className="flex justify-between mt-2 text-sm">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'reveal') {
    return (
      <div className="page-container">
        <div className="page-content flex flex-col items-center justify-center text-white relative">
          <motion.div
            initial={{ scale: 0.5, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold mb-4">Your Travel Persona:</h2>
            <p className="text-3xl text-[#00FF7F]">{finalPersona!.name}</p>
            <p className="mt-4">{finalPersona!.description}</p>
            <div className="mt-4 flex flex-wrap justify-center">
              {finalPersona!.tags.map(tag => (
                <span key={tag} className="mr-2 mb-2 px-3 py-1 bg-[#00FF7F] text-black rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-16 px-8 py-4 bg-[#00FF7F] text-black font-bold rounded-lg"
            onClick={handleRevealComplete}
          >
            See Results
          </motion.button>
        </div>
      </div>
    );
  }

  return null;
};

export default Quiz;
```