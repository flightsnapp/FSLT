import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsOfService: React.FC = () => {
  const { t, ready } = useTranslation();

  if (!ready) return <div>Loading translations...</div>;

  return (
    <div className="page-container">
      <main className="page-content">
        <h1>{t('terms.title')}</h1>
        <hr />
        <p>
          <strong>{t('terms.effective_date_label')}</strong> {t('terms.effective_date')}
        </p>
      <section className="policy-section">
        <h2>
          <i className="fas fa-handshake"></i> {t('terms.agreement.title')}
        </h2>
        <p>
          {t('terms.agreement.description')}
        </p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-globe"></i> {t('terms.use.title')}
        </h2>
        <p>
          {t('terms.use.description')}
        </p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-user"></i> {t('terms.responsibilities.title')}
        </h2>
        <p>
          {t('terms.responsibilities.description')}
        </p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-rocket"></i> {t('terms.snappstars.title')}
        </h2>
        <p>
          {t('terms.snappstars.description')}
        </p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-exclamation-triangle"></i> {t('terms.liability.title')}
        </h2>
        <p>
          {t('terms.liability.description')}
        </p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-shield-alt"></i> {t('terms.ip.title')}
        </h2>
        <p>
          {t('terms.ip.description')}
        </p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-gavel"></i> {t('terms.law.title')}
        </h2>
        <p>
          {t('terms.law.description')}
        </p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-sync-alt"></i> {t('terms.changes.title')}
        </h2>
        <p>
          {t('terms.changes.description')}
        </p>
      </section>
      </main>
    </div>
  );
};

export default TermsOfService;
