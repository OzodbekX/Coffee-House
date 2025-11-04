import React from 'react';
import "../styles/components/_banner.scss"
const Banner = () => {
    return (
        <section className="hero">
            <video className="enjoy-bg-video" autoPlay muted loop playsInline>
                <source src="https://www.pexels.com/ru-ru/download/video/2909914/" type="video/mp4"/>
            </video>
            <div className="hero__content">
                <h1 className="heading-1">
                    <i className="accent">Enjoy</i> premium coffee at our charming cafe
                </h1>
                <p className="text-medium">
                    With its inviting atmosphere and delicious coffee options, the Coffee House Resource is a popular
                    destination for coffee lovers and those seeking a warm and inviting space to enjoy their favorite
                    beverage.
                </p>
                <a href="menu" className="button button--primary">
                    <span>Menu</span>
                    <img loading="lazy" src="./icons/coffee-cup.png" alt="menu"></img>
                </a>
            </div>
        </section>
    );
};

export default Banner;