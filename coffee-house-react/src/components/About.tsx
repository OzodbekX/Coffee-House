import React from 'react';
import {useTranslation} from "react-i18next";
import "../styles/components/_about.scss"

const About = () => {
    const {t} = useTranslation();
    return (
        <section id={"about-section"} className="about">
            <div className="about__content">
                <h2 className="heading-2" dangerouslySetInnerHTML={{__html:t("banner.resource")}}></h2>
                <div className="about-flex">
                    <div className="column">
                        <div className="grid-item"><img loading="lazy" src="./images/about-image-1.png"
                                                        alt="coffee 1"/></div>
                        <div className="grid-item"><img loading="lazy" src="./images/about-image-3.png"
                                                        alt="coffee 3"/></div>
                    </div>
                    <div className="column">
                        <div className="grid-item"><img loading="lazy" src="./images/about-image-2.png"
                                                        alt="coffee 2"/></div>
                        <div className="grid-item"><img loading="lazy" src="./images/about-image-4.png"
                                                        alt="coffee 4"/></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;