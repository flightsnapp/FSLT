import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PERSONAS } from './utils/personaCalculator';

const Personas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPersona = () => {
    setCurrentIndex((prev) => (prev + 1) % PERSONAS.length);
  };

  const prevPersona = () => {
    setCurrentIndex((prev) => (prev - 1 + PERSONAS.length) % PERSONAS.length);
  };

  const persona = PERSONAS[currentIndex];

  return (
    <div className="page-container">
      <main className="page-content flex flex-col items-center">
        <h1>Discover Your Traveler Persona</h1>
        <p className="mb-8">Explore the 25 unique travel personas crafted by FlightSnapp!</p>

        <div className="relative w-full max-w-2xl">
          <button
            onClick={prevPersona}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-full shadow-lg z-10"
          >
            ❮
          </button>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1A2A44] bg-opacity-95 rounded-lg p-6 text-white"
          >
            <img src="/images/placeholder.png" alt={persona.name} className="w-24 h-24 object-cover rounded-full mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-center mb-4">{persona.name}</h2>
            <p className="text-center mb-4">{persona.description}</p>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {persona.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[#00FF7F] text-black rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Example Trips:</h3>
              <ul className="list-disc pl-5">
                {persona.example_trips.map((trip, idx) => (
                  <li key={idx}>{trip}</li>
                ))}
              </ul>
            </div>
          </motion.div>

          <button
            onClick={nextPersona}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-full shadow-lg z-10"
          >
            ❯
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-300">{currentIndex + 1} / {PERSONAS.length}</p>
        </div>
      </main>
    </div>
  );
};

export default Personas;
