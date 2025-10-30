import React from "react";
import "./index.scss";
import "./i18n";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

function App() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <LanguageSwitcher />
      <p>{t("change_language")}</p>
    </div>
  );
}

export default App;
