import React, {FunctionComponent, ReactComponentElement, SVGProps, useEffect, useState} from "react";
import "../styles/components/_contacts.scss";

interface SocialIcon {
    name: string;
    path: string;
    link: string;
}

const socialIcons: SocialIcon[] = [
    { name: "twitter", path: "../../public/icons/twitter.svg", link: "#" },
    { name: "instagram", path: "../../public/icons/instagram.svg", link: "#" },
    { name: "facebook", path: "../../public/icons/facebook.svg", link: "#" },
];

export const Footer: React.FC = () => {
    const [svgs, setSvgs] = useState<Record<string, string>>({});

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
    const writeSocialIcons=()=>{

        return socialIcons.map(  (icon) => {

            return <a
                key={icon.name}
                href={icon.link}
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={icon.name}
                dangerouslySetInnerHTML={{ __html: svgs[icon.name] ?? "" }}

            >
                {/*{svg}*/}
                {/* Inline SVG load */}
                {/*<img*/}
                {/*    src={icon.path}*/}
                {/*    alt={`${icon.name} icon`}*/}
                {/*    width={24}*/}
                {/*    height={24}*/}
                {/*    loading="lazy"*/}
                {/*/>*/}
            </a>
        })
    }
    return (
        <footer className="footer" id="contacts-section">
            <div className="footer-content">
                {/* Left side */}
                <div className="footer-left">
                    <h2 className="heading-2">
                        Sip, Savor, Smile. <i className="accent">It's coffee time!</i>
                    </h2>

                    <div className="social-icons">
                        {writeSocialIcons()}
                    </div>
                </div>

                {/* Right side */}
                <div className="footer-right">
                    <h3 className="heading-3">Contact us</h3>
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
                                85384 Green Blvd, LA
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
                                +1 (803) 550-0123
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
                            Mon–Sat: 9:00 AM – 23:00 PM
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};
