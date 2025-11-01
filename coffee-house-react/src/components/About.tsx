import React from 'react';
import "../styles/components/_about.scss"
const About = () => {
    return (
        <section id={"about-section"} className="about">
            <div className="about__content">
                <h2 className="heading-2">
                    Resource is <i className="accent">the perfect and cozy place </i>where you can enjoy a variety of
                    hot beverages,
                    relax, catch up with friends, or get some work done. </h2>
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