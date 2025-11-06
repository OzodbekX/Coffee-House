import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/components/_download-app.scss";

interface AppButtonProps {
  type: "ios" | "android";
}

const AppButton: React.FC<AppButtonProps> = ({ type }) => {
  const { t } = useTranslation();

  const isIOS = type === "ios";

  const icon = isIOS ? "./icons/ios-dark.png" : "./icons/google-play-dark.png";
  const iconLight = isIOS
    ? "./icons/ios-light.png"
    : "./icons/google-play-light.png";

  const smallText = isIOS
    ? t("downloadApp.ios.smallText")
    : t("downloadApp.android.smallText");

  const bigText = isIOS
    ? t("downloadApp.ios.bigText")
    : t("downloadApp.android.bigText");

  return (
    <button className="app-btn" data-type={type}>
      <img loading="lazy" src={icon} className="dark" alt={bigText} />
      <img loading="lazy" src={iconLight} className="light" alt={bigText} />
      <span className="text-caption">
        {smallText}
        <br />
        <strong className="text-link-button">{bigText}</strong>
      </span>
    </button>
  );
};

export const AppDownloadSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="download-app-section" className="download-app">
      <div className="download-app-container">
        <div className="download-app-content">
          <h2
            className="heading-2"
            dangerouslySetInnerHTML={{ __html: t("downloadApp.title") }}
          />
          <p className="text-medium">{t("downloadApp.description")}</p>

          <div className="app-buttons">
            <AppButton type="ios" />
            <AppButton type="android" />
          </div>
        </div>

        <div className="download-app-images">
          <img
            loading="lazy"
            src="./images/contacts-mobile-phones.png"
            alt={t("downloadApp.imageAlt")}
            className="phone"
          />
        </div>
      </div>
    </section>
  );
};
