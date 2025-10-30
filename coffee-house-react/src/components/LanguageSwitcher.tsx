import React from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage("en")}>en EN</button>
      <button onClick={() => changeLanguage("uz")}>uz UZ</button>
    </div>
  );
};
