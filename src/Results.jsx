import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { decryptQuizResult } from './utils/personaCalculator';

const Results = () => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('quizResult');
    if (stored) {
      decryptQuizResult(stored).then(setResult).catch(() => navigate('/'));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!result) return <div>Loading...</div>;

  const { persona, scores, date } = result;

  const shareOnTwitter = () => {
    const text = `My Travel Persona: ${persona.name}! Find yours at flightsnapp.com #TravelPersonaQuiz`;
    const url = `https://twitter.com/share?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = 'https://www.facebook.com/sharer/sharer.php?u=https://flightsnapp.com&quote=My%20Travel%20Persona:%20' + encodeURIComponent(persona.name);
    window.open(url, '_blank');
  };

  const shareOnInstagram = () => {
    // Instagram share requires different approach; for now, copy to clipboard
    navigator.clipboard.writeText(`My Travel Persona: ${persona.name}! Find yours at flightsnapp.com`);
    alert('Copied to clipboard! Share on Instagram manually.');
  };

  const unlockBeta = () => {
    // Mock Stripe link; replace with actual Stripe checkout URL
    window.open('https://checkout.stripe.com/pay/cs_test_...mock...', '_blank');
  };

  return (
    <div className="min-h-screen bg-[rgba(26,42,68,0.95)] flex flex-col items-center justify-center text-white p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full bg-gray-800 rounded-lg p-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-[#00FF7F]">Your Travel Persona</h1>
        <h2 className="text-3xl font-semibold mb-4">{persona.name}</h2>
        <p className="mb-6">{persona.description}</p>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Your Tags:</h3>
          <div className="flex flex-wrap justify-center">
            {persona.tags.map(tag => (
              <span key={tag} className="mr-2 mb-2 px-3 py-1 bg-[#00FF7F] text-black rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">AI Curated Travel Recommendations</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {persona.example_trips.map((trip, idx) => (
              <div key={idx} className="bg-gray-700 p-4 rounded">
                <p className="text-sm">{trip}</p>
                <button className="mt-2 px-4 py-2 bg-[#00FF7F] text-black rounded">Book Now</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Share Your Persona</h3>
          <div className="flex justify-center space-x-4">
            <button onClick={shareOnTwitter} className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share on X
            </button>
            <button onClick={shareOnFacebook} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">Facebook</button>
            <button onClick={shareOnInstagram} className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded">Instagram</button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Unlock Flightsnapp Beta</h3>
          <p className="mb-4">Get early access to personalized travel planning powered by AI!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={unlockBeta}
            className="px-8 py-4 bg-[#00FF7F] text-black font-bold rounded-lg"
          >
            Subscribe Now - $9.99/month
          </motion.button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded"
        >
          Retake Quiz
        </button>
      </motion.div>
    </div>
  );
};

export default Results;
