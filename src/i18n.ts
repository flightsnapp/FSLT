import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Quiz.tsx
          "quiz.welcome": "Welcome to Flightsnapp! Take the quiz to discover your travel persona.",
          "quiz.question1": "If someone dares me to try something ridiculous, I'm already halfway in.",
          "quiz.question1.feedback1": "Classic-comfort connoisseur—predictable can be perfect.",
          // Results.tsx
          "results.retake_quiz": "Retake Quiz",
          "results.share_on_x": "Share on X",
          "results.unlock_beta": "UNLOCK BETA Q1 2026",
          "results.error_no_results": "No quiz results found. Please take the quiz first.",
          // personaCalculator.ts (example for one persona)
          "persona.wild_trailblazer.teaser": "Crave uncharted paths? Blaze your own trail with random spins!",
          // Stripe
          "stripe.product_name": "Unlock Beta Access for {persona}",
          // Add ~450 more strings (questions, feedback, descriptions, etc.)
        },
      },
      es: {
        translation: {
          "quiz.welcome": "¡Bienvenido a Flightsnapp! Toma el cuestionario para descubrir tu personalidad de viaje.",
          "quiz.question1": "Si alguien me reta a probar algo ridículo, ya estoy a medio camino.",
          "quiz.question1.feedback1": "Amante del confort clásico—lo predecible puede ser perfecto.",
          "results.retake_quiz": "Volver a tomar el cuestionario",
          "results.share_on_x": "Compartir en X",
          "results.unlock_beta": "Desbloquear Beta Q1 2026",
          "results.error_no_results": "No se encontraron resultados del cuestionario. Por favor, toma el cuestionario primero.",
          "persona.wild_trailblazer.teaser": "¿Ansías caminos inexplorados? ¡Traza tu propia ruta con giros aleatorios!",
          "stripe.product_name": "Desbloquear acceso Beta para {persona}",
        },
      },
    },
    fallbackLng: 'en',
    detection: { order: ['navigator'] },
  });

export default i18n;