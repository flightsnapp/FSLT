import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy: React.FC = () => {
  const { t, ready } = useTranslation();
  console.log('PrivacyPage: ready=', ready)
  console.log('Privacy title:', t('privacy.title'))

  if (!ready) return <div>Loading translations...</div>;

  return (
    <div className="page-container">
      <main className="page-content">
      <h1>{t('privacy.title')}</h1>
      <hr />
      <p>
        <strong>{t('privacy.effective_date_label')}</strong> {t('privacy.effective_date')}
      </p>
      <section className="policy-section">
        <h2>
          <i className="fas fa-lock"></i> {t('privacy.commitment.title')}
        </h2>
        <p>
          {t('privacy.commitment.description1')}{' '}
          <a href="/privacy-policy" target="_blank">
            {t('privacy.commitment.link_text')}
          </a>
          {t('privacy.commitment.description2')}
        </p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-info-circle"></i> {t('privacy.collect.title')}
        </h2>
        <p>{t('privacy.collect.intro')}</p>
        <ul>
          <li>
            <strong>{t('privacy.collect.quiz_label')}</strong> {t('privacy.collect.quiz')}
          </li>
          <li>
            <strong>{t('privacy.collect.tech_label')}</strong> {t('privacy.collect.tech')}
          </li>
        </ul>
        <p>{t('privacy.collect.skip')}</p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-cogs"></i> {t('privacy.use.title')}
        </h2>
        <p>{t('privacy.use.description')}</p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-share-alt"></i> {t('privacy.share.title')}
        </h2>
        <p>{t('privacy.share.description')}</p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-shield-alt"></i> {t('privacy.security.title')}
        </h2>
        <p>{t('privacy.security.description')}</p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-user-shield"></i> {t('privacy.rights.title')}
        </h2>
        <p>
          {t('privacy.rights.description1')}{' '}
          <a href="mailto:flightsnapp@gmail.com">{t('privacy.rights.contact_email')}</a>{' '}
          {t('privacy.rights.description2')}
        </p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-clock"></i> {t('privacy.retention.title')}
        </h2>
        <p>{t('privacy.retention.description')}</p>
      </section>
      <section className="policy-section">
        <h2>
          <i className="fas fa-sync-alt"></i> {t('privacy.updates.title')}
        </h2>
        <p>{t('privacy.updates.description')}</p>
      </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
