import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import "@styles/components/_settings_dropdown.scss";
import { useUser } from "../../context/UserContext";

export const SettingsDropdown: React.FC<{
  setMobileMenuOpen: (b: boolean) => void;
}> = ({ setMobileMenuOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const { mode, updateMode } = useTheme();
  const { language, updateLanguage } = useLanguage();
  const { t } = useTranslation();

  const languages = ["en", "uz"];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changePage = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  return (
    <div className="settings-dropdown" ref={dropdownRef}>
      {/* ⚙️ Settings Icon */}
      <button
        className="settings-icon"
        aria-label="Settings"
        onClick={() => {
          setMobileMenuOpen(false);
          setIsOpen((prev) => !prev);
        }}
      >
        <img
          height={20}
          width={20}
          src="/icons/settings-dropdown.png"
          alt="settigns"
        />
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <div className="dropdown-section">
            <p className="dropdown-title">{t("theme")}</p>
            <div className="radio-group">
              {["light", "dark"].map((m) => (
                <label key={m} className="radio-option">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === m}
                    onChange={() => updateMode(m as "light" | "dark")}
                  />
                  <span>{m === "light" ? t("light") : t("dark")}</span>
                </label>
              ))}
            </div>
          </div>
          <hr />

          {/* Language */}
          <div className="dropdown-section">
            <p className="dropdown-title">{t("language")}</p>
            <div className="radio-grid">
              {languages.map((lang) => (
                <label key={lang} className="radio-option">
                  <input
                    type="radio"
                    name="language"
                    checked={language === lang}
                    onChange={() => updateLanguage(lang)}
                  />
                  <span>{lang}</span>
                </label>
              ))}
            </div>
          </div>

          <hr />

          {/* Orders */}
          <button
            className="dropdown-btn"
            onClick={() => changePage("/orders")}
          >
            {t("orders")}
          </button>
          {/* Orders */}
          <button
            className="dropdown-btn"
            onClick={() => changePage("/support")}
          >
            {t("support")}
          </button>

          {/* Login */}
          {user ? (
            <p className={"user-data"}>{user?.login}</p>
          ) : (
            <button
              className="dropdown-btn"
              onClick={() => changePage("/login")}
            >
              Login
            </button>
          )}
        </div>
      )}
    </div>
  );
};
