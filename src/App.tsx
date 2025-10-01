import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Quiz from './Quiz';
import Results from './Results';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import SnappStarsPolicy from './SnappStarsPolicy';
import Vision from './Vision';
import Team from './Team';
import Personas from './Personas';
import Header from './Header';
import Footer from './Footer';

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