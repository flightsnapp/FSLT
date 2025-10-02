import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { decryptQuizResult, Persona } from './utils/personaCalculator';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [error, setError] = useState<string>('');

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
        setError('Error loading results: ' + (err as Error).message);
      }
    };
    loadResults();
  }, []);

  const handleShareOnX = () => {
    if (!persona) return;
    const text = `I'm a ${persona.name} on @Flightsnapp! Ready for ${persona.tags[0].toLowerCase()} adventures! #TravelPersona #Flightsnapp`;
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
	  {"   "}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-6 py-3 bg-[#00FF7F] text-black font-bold rounded-lg"
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