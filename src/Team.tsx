```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Team: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <main className="page-content">
        <h1>Meet the Flightsnapp Dream Team</h1>
        <hr />
        <p>
          Discover the visionaries seamlessly blending psychology and technology into our magical AI-powered experience for one-of-a-kind, tailored, spontaneous escapes!
        </p>
        <section className="policy-section team-member">
          <img
            src="/images/placeholder.png"
            alt="Director 1"
            className="w-24 h-24 object-cover rounded-full mx-auto"
          />
          <h2>Director 1</h2>
          <p>Director 1 bio placeholder.</p>
        </section>
        <section className="policy-section team-member">
          <img
            src="/images/placeholder.png"
            alt="Director 2"
            className="w-24 h-24 object-cover rounded-full mx-auto"
          />
          <h2>Director 2</h2>
          <p>Director 2 bio placeholder.</p>
        </section>
        <section className="policy-section team-member">
          <img
            src="/images/placeholder.png"
            alt="Director 3"
            className="w-24 h-24 object-cover rounded-full mx-auto"
          />
          <h2>Director 3</h2>
          <p>Director 3 bio placeholder.</p>
        </section>
      </main>
    </div>
  );
};

export default Team;
```