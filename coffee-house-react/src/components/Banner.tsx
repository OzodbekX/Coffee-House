import React from "react";
import "../styles/components/_banner.scss";
import { useTranslation } from "react-i18next";

const Banner = () => {
  const { t } = useTranslation();
  return (
    <section className="hero">
      <video className="enjoy-bg-video" autoPlay muted loop playsInline>
        <source
          src="https://www.pexels.com/ru-ru/download/video/2909914/"
          type="video/mp4"
        />
      </video>
      <div className="hero__content">
        <h1
          className="heading-1"
          dangerouslySetInnerHTML={{ __html: t("banner.heading") }}
        ></h1>
        <p className="text-medium">{t("banner.text")}</p>
        <a href="menu" className="button button--primary">
          <span>{t("banner.button")}</span>
          <img loading="lazy" src="./icons/coffee-cup.png" alt="menu"></img>
        </a>
      </div>
    </section>
  );
};

export default Banner;
