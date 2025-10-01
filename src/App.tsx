import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Quiz from './Quiz.tsx';
import Results from './Results.tsx';
import PrivacyPolicy from './PrivacyPolicy.tsx';
import TermsOfService from './TermsOfService.tsx';
import SnappStarsPolicy from './SnappStarsPolicy.tsx';
import Vision from './Vision.tsx';
import Team from './Team.tsx';
import Personas from './Personas.tsx';
import Header from './Header.tsx';
import Footer from './Footer.tsx';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/snapp-stars-policy" element={<SnappStarsPolicy />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/team" element={<Team />} />
          <Route path="/personas" element={<Personas />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;