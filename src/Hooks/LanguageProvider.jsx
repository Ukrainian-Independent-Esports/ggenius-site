import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageProvider = () => {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const lang = searchParams.get('lang') || 'uk';
    i18n.changeLanguage(lang);
  }, [i18n, searchParams]);

  return null;
};

export default LanguageProvider;
