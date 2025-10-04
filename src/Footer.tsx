import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleExternalLink = (path: string) => {
    window.open(`https://flightsnapp.com${path}`, '_blank');
  };

  return (
    <footer className="sticky-footer">
      <a onClick={() => navigate('/privacy-policy')}>{t('footer.privacy_policy')}</a> |{' '}
      <a onClick={() => navigate('/terms-of-service')}>{t('footer.terms_of_service')}</a> |{' '}
      <a onClick={() => navigate('/snapp-stars-policy')}>{t('footer.snapp_stars_policy')}</a> |{' '}
      <a onClick={() => navigate('/personas')}>{t('footer.persona_profiles')}</a> |{' '}
      <a onClick={() => navigate('/vision')}>{t('footer.vision')}</a> |{' '}
      <a onClick={() => navigate('/team')}>{t('footer.team')}</a>
    </footer>
  );
};

export default Footer;
