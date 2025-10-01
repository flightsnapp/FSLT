```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SnappStarsPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <main className="page-content">
        <h1>SnappStars Program Agreement</h1>
        <hr />
        <p>
          <strong>Version 1.1 | Effective Date:</strong> August 26, 2025
        </p>
        <p>
          <strong>Prepared by:</strong> Flightsnapp Legal & Strategy Team
        </p>
        <section className="policy-section">
          <h2>
            <i className="fas fa-handshake"></i> Introduction
          </h2>
          <p>
            This Agreement outlines the terms and conditions for participation in the SnappStars program ("Program"), operated by Flightsnapp, Inc. ("Flightsnapp"). The Program enables qualified Stars to list unique properties and experiences, integrating them into Flightsnapp's AI-powered travel curation platform. By participating, Stars agree to these terms, which are designed to foster profitable, scalable partnerships while delivering hyper-personalized, one-of-a-kind travel experiences for Millennials and Gen Z users.
          </p>
          <p>
            Flightsnapp's vision is to empower intuitive, joyful travel like a vacation playlist—curating spontaneous, 5-star trips reflecting users' personalities via Big 5 psychology quizzes, hybrid AI curation (rule-based filters for budgets/dates and ML for persona matching), random "slot machine" spins for deals, and group packages for similar vibes. SnappStars fuels this by providing exclusive listings blended with affiliates (e.g., Amadeus flights, Tiqets activities) for seamless, one-tap "Snaps."
          </p>
          <p>
            This Agreement is binding upon approval of a Star's application. Flightsnapp reserves the right to amend terms with 15 days' notice. Consult legal counsel for personalized advice.
          </p>
        </section>
        <section className="policy-section">
          <h2>
            <i className="fas fa-info-circle"></i> 1. Program Overview
          </h2>
          <h3>Program Description</h3>
          <p>
            SnappStars allows individuals, influencers, and small operators ("Stars") to apply and list exclusive properties and experiences on Flightsnapp. Listings must be unique and verified, such as off-grid cabins for conscientious budgeters or urban adventures for extraverts. These integrate into Flightsnapp's hybrid curator, matching to user personas (e.g., relaxed vibes for low Neuroticism, adventure for high Openness) via Big 5 quiz results, with features like random spins for spontaneity and group packages for persona similarity.
          </p>
          <h3>Purpose</h3>
          <p>
            The Program enhances Flightsnapp's one-stop shop for YOLO-style escapes, driving viral growth through high-quality, personalized curation. Stars benefit from exposure to tech-savvy users, automated bookings, and competitive payouts, while Flightsnapp monetizes via commissions and subscriptions.
          </p>
          <h3>Eligibility Criteria</h3>
          <ul>
            <li>
              <strong>Unique Listings:</strong> Exclusive, non-generic properties/experiences with Big 5-inspired vibe tags (e.g., "High Openness: Exploratory hikes included").
            </li>
            <li>
              <strong>Star Qualifications:</strong> Must be 18+; provide proof of ownership/rights, background check, and valid business license if applicable.
            </li>
            <li>
              <strong>Standards:</strong> Listings must meet 4-star potential; no discriminatory, illegal, or commodity offerings.
            </li>
            <li>
              <strong>Verification:</strong> All listings undergo review for authenticity and alignment with Flightsnapp's niche focus on custom, joyful travel.
            </li>
          </ul>
        </section>
        <section className="policy-section">
          <h2>
            <i className="fas fa-dollar-sign"></i> 2. Commission Structure
          </h2>
          <p>
            Flightsnapp's structure ensures profitability and competitiveness, benchmarked against industry leaders (e.g., Airbnb's 14-16% host fees, VRBO's 8%). Commissions apply to the total booking value (excluding taxes/refunds and flights, handled separately via Amadeus markups).
          </p>
          <h3>Flightsnapp Commission</h3>
          <ul>
            <li>
              <strong>Base Rate:</strong> 12% per booking (range: 10-15%, adjustable for market conditions).
            </li>
            <li>
              <strong>Tiered Adjustments:</strong> Reduced to 10% for high-volume Stars (50+ bookings/year) to incentivize loyalty; optional 2% add-on for premium features (e.g., priority in AI curation).
            </li>
          </ul>
          <h3>Star Payout</h3>
          <ul>
            <li>
              <strong>Base Payout:</strong> 83% of booking value (after Flightsnapp's commission and ~2-3% payment processing fees via Stripe).
            </li>
            <li>
              <strong>Performance Incentives:</strong> +2% for 90%+ 5-star ratings; +1% for successful referrals.
            </li>
            <li>
              <strong>Maximum Cap:</strong> Payouts not to exceed 85% to maintain platform sustainability.
            </li>
          </ul>
          <h3>Additional Fees</h3>
          <ul>
            <li>
              <strong>Premium Subscription:</strong> Optional $19.99/month for enhanced visibility (e.g., featured in random spins or group packages).
            </li>
            <li>
              <strong>Transparency:</strong> No hidden fees; Stars receive detailed breakdowns pre-payout.
            </li>
          </ul>
          <h3>Example Calculation</h3>
          <p>For a $500 snap (stay + experiences):</p>
          <ul>
            <li>Total: $500</li>
            <li>Flightsnapp Commission (12%): $60</li>
            <li>Processing (~3%): $15</li>
            <li>Star Payout (83% net): $415</li>
            <li>Scalability: At 1,000 bookings/month, generates $60,000 in platform revenue.</li>
          </ul>
        </section>
        <section className="policy-section">
          <h2>
            <i className="fas fa-cogs"></i> 3. Application and Operations
          </h2>
          <h3>Application Process</h3>
          <ul>
            <li>
              <strong>Submission:</strong> Via Flightsnapp's website form, including property details, psych vibe alignment (Big 5 tags), photos/videos, availability, pricing, and references. Application is free; $50 one-time verification fee (waived for beta participants).
            </li>
            <li>
              <strong>Review:</strong> Combination of manual assessment and AI scan (via Grok API) for uniqueness and fit; decisions within 7 days.
            </li>
          </ul>
          <h3>Operational Integration</h3>
          <ul>
            <li>
              <strong>Curator Feed:</strong> Approved listings integrate into Flightsnapp's hybrid system—rule-based for constraints (budget under $500 or unlimited, flexible dates within a week, layovers) and ML for personalization (e.g., matching high Extraversion to social experiences).
            </li>
            <li>
              <strong>Booking Flow:</strong> Users book via one-tap "Snaps"; payments handled with Stripe and Afterpay for flexibility.
            </li>
            <li>
              <strong>Payouts:</strong> Automated via Stripe Connect post-booking; 7-day hold for refunds/cancellations. Stars responsible for taxes; Flightsnapp provides 1099 forms.
            </li>
          </ul>
          <h3>Legal Terms</h3>
          <ul>
            <li>
              <strong>Liability:</strong> Flightsnapp is not liable for disputes, damages, or listing inaccuracies. Stars indemnify Flightsnapp against claims related to their offerings. Liability capped at booking value.
            </li>
            <li>
              <strong>Data Usage:</strong> Stars grant a non-exclusive license for anonymized data (e.g., trends) to improve curation and enable B2B insights. Compliant with GDPR/CCPA; no personal data shared without consent.
            </li>
            <li>
              <strong>Intellectual Property:</strong> Stars retain ownership; grant Flightsnapp a perpetual, royalty-free license for promotional use (e.g., on platform/social media). No infringing content permitted.
            </li>
            <li>
              <strong>Termination:</strong> 30 days' notice by either party; immediate for violations (e.g., low ratings or breaches).
            </li>
            <li>
              <strong>Dispute Resolution:</strong> Binding arbitration per ADRIC rules in Alberta, Canada.
            </li>
            <li>
              <strong>Governing Law:</strong> Alberta, Canada; includes force majeure provisions.
            </li>
          </ul>
        </section>
        <section className="policy-section">
          <h2>
            <i className="fas fa-rocket"></i> 4. Growth and Scalability for Stars
          </h2>
          <ul>
            <li>
              <strong>Targets:</strong> Aim for 500 active Stars by Q1 2026 MVP launch; 20% conversion from snaps to bookings to drive mutual growth.
            </li>
            <li>
              <strong>Growth Drivers:</strong> Referral bonuses ($50 per recruit); integration with Flightsnapp+ subs ($9.99/month) and beta access ($5 one-time) for enhanced visibility and viral marketing (TikTok ads, influencer collabs, gamification badges).
            </li>
            <li>
              <strong>Risk Management:</strong> Diversified revenue from affiliates and data insights ensures sustainable partnerships; 15% buffer for market fluctuations.
            </li>
          </ul>
          <p>
            By signing this Agreement, Stars acknowledge understanding and acceptance of all terms. For questions, contact{' '}
            <a href="mailto:support@flightsnapp.com">support@flightsnapp.com</a>. Let's create magical, persona-driven escapes together! 🚀
          </p>
        </section>
      </main>
    </div>
  );
};

export default SnappStarsPolicy;
```