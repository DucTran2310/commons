import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="w-32 mr-4">
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`w-full border dark:bg-dark-background dark:border-dark-divider dark:text-dark-text bg-light-background border-light-divider text-light-text`}>
          <SelectValue placeholder={i18n.t('language')} />
        </SelectTrigger>
        <SelectContent className={`border dark:bg-dark-background dark:border-dark-divider bg-light-background border-light-divider`}>
          {["en", "vi"].map((lang, index) => (
            <SelectItem 
              key={index} 
              value={lang} 
              className={'dark:text-white dark:hover:bg-dark-hoverBg hover:bg-light-hoverBg'}
            >
              {lang === "en" ? "English" : "Tiếng Việt"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}