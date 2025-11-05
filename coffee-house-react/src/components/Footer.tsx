import React, { useEffect, useState } from "react";
import "../styles/components/_contacts.scss";
import { useTranslation } from "react-i18next";

interface SocialIcon {
    name: string;
    path: string;
    link: string;
}

const socialIcons: SocialIcon[] = [
    { name: "twitter", path: "/icons/twitter.svg", link: "#" },
    { name: "instagram", path: "/icons/instagram.svg", link: "#" },
    { name: "facebook", path: "/icons/facebook.svg", link: "#" },
];

export const Footer: React.FC = () => {
    const [svgs, setSvgs] = useState<Record<string, string>>({});
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            const results: Record<string, string> = {};
            for (const icon of socialIcons) {
                try {
                    const res = await fetch(icon.path);
                    const svgText = await res.text();
                    results[icon.name] = svgText;
                } catch (err) {
                    console.error(`Failed to load ${icon.name}:`, err);
                }
            }
            setSvgs(results);
        })();
    }, []);

    const writeSocialIcons = () =>
        socialIcons.map((icon) => (
            <a
                key={icon.name}
                href={icon.link}
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={icon.name}
                dangerouslySetInnerHTML={{ __html: svgs[icon.name] ?? "" }}
            ></a>
        ));

    return (
        <footer className="footer" id="contacts-section">
            <div className="footer-content">
                {/* Left side */}
                <div className="footer-left">
                    <h2
                        className="heading-2"
                        dangerouslySetInnerHTML={{ __html: t("footer.title") }}
                    />
                    <div className="social-icons">{writeSocialIcons()}</div>
                </div>

                {/* Right side */}
                <div className="footer-right">
                    <h3 className="heading-3">{t("footer.contactUs")}</h3>
                    <ul>
                        <li className="text-link-button">
                            <a
                                href="https://www.google.com/maps?q=85384+Green+Blvd,+LA"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    loading="lazy"
                                    width={20}
                                    height={20}
                                    src="./icons/pin.png"
                                    alt="Location pin"
                                />
                                {t("footer.address")}
                            </a>
                        </li>

                        <li className="text-link-button">
                            <a href="tel:+18035500123">
                                <img
                                    loading="lazy"
                                    width={20}
                                    height={20}
                                    src="./icons/phone.png"
                                    alt="Phone"
                                />
                                {t("footer.phone")}
                            </a>
                        </li>

                        <li className="text-link-button">
                            <img
                                loading="lazy"
                                width={20}
                                height={20}
                                src="./icons/clock.png"
                                alt="Clock"
                            />
                            {t("footer.workTime")}
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};
