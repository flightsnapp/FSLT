import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    console.log('Change triggered for', lng);
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${i18n.language === lang.code
              ? 'bg-[#00FF7F] text-black'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          title={`Switch to ${lang.name}`}
        >
          <span className="mr-2">{lang.flag}</span>
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
