const { calculateTraitScores, getPersona } = require('./utils/personaCalculator.js');

// 10 questions data для simulation
const questions = [
  { trait: "openness", direction: "direct" },
  { trait: "openness", direction: "reverse" },
  { trait: "conscientiousness", direction: "direct" },
  { trait: "conscientiousness", direction: "reverse" },
  { trait: "extraversion", direction: "direct" },
  { trait: "extraversion", direction: "reverse" },
  { trait: "agreeableness", direction: "direct" },
  { trait: "agreeableness", direction: "reverse" },
  { trait: "neuroticism", direction: "direct" },
  { trait: "neuroticism", direction: "reverse" }
];

// Function to generate random score 1-5
function randomScore() {
  return Math.floor(Math.random() * 5) + 1;
}

// Function to run a single test
function runTest() {
  const scores = Array.from({length: 10}, randomScore);

  // Sanitize and adjust for reverse
  const sanitized = scores.map(s => s);
  const adjustedScores = sanitized.map((score, idx) =>
    questions[idx].direction === 'reverse' ? 6 - score : score
  );

  const traitScores = calculateTraitScores(adjustedScores);
  const persona = getPersona(traitScores);
  return persona.name;
}

// Run 100 tests and count occurrences
const results = {};
for (let i = 0; i < 100; i++) {
  const name = runTest();
  results[name] = (results[name] || 0) + 1;
}

// Sort by count descending
const sorted = Object.entries(results)
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => `${name}: ${count}`);

console.log('Persona distribution over 100 random tests:');
sorted.forEach(line => console.log(line));
console.log(`Total personas returned: ${Object.keys(results).length} out of 25`);
