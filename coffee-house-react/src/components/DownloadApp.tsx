import React from "react";
import "../styles/components/_download-app.scss";

interface AppButtonProps {
    type: "ios" | "android";
}

const AppButton: React.FC<AppButtonProps> = ({ type }) => {
    const isIOS = type === "ios";

    const icon = isIOS
        ? "./icons/ios-dark.png"
        : "./icons/google-play-dark.png";
    const iconLight = isIOS
        ? "./icons/ios-light.png"
        : "./icons/google-play-light.png";

    const smallText = isIOS ? "Available on the" : "Available on";
    const bigText = isIOS ? "App Store" : "Google Play";

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
    return (
        <section id="download-app-section" className="download-app">
            <div className="download-app-container">
                <div className="download-app-content">
                    <h2 className="heading-2">
                        <span className="accent">Download</span> our apps to start ordering
                    </h2>
                    <p className="text-medium">
                        Download the Resource app today and experience the comfort of
                        ordering your favorite coffee from wherever you are.
                    </p>

                    <div className="app-buttons">
                        <AppButton type="ios" />
                        <AppButton type="android" />
                    </div>
                </div>

                <div className="download-app-images">
                    <img
                        loading="lazy"
                        src="./images/contacts-mobile-phones.png"
                        alt="App preview 1"
                        className="phone"
                    />
                </div>
            </div>
        </section>
    );
};
