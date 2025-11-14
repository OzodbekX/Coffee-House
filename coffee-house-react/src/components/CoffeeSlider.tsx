import React, { useEffect, useRef, useState } from "react";
import { fetchFavoriteProducts } from "@assets/api";
import type { ProductType } from "@assets/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "@styles/components/_coffee-slider.scss";

export const CoffeeSlider: React.FC = React.memo(() => {
  const AUTO_SCROLL_DELAY = 5000;
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoScrollTimeout = useRef<number | undefined>(undefined);
  const lastStartTime = useRef<number>(Date.now());
  const remainingTime = useRef<number>(AUTO_SCROLL_DELAY);
  const navigate = useNavigate();
  const GAP = 16;

  const { t } = useTranslation();

  const loadProducts = async () => {
    try {
      const res = await fetchFavoriteProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch products ---
  useEffect(() => {
    loadProducts();
  }, []);

  // --- Auto-scroll ---
  const startAutoScroll = (delay = AUTO_SCROLL_DELAY) => {
    clearTimeout(autoScrollTimeout.current);
    lastStartTime.current = Date.now();
    autoScrollTimeout.current = window.setTimeout(() => {
      scrollToSlide(currentIndex + 1);
      startAutoScroll(AUTO_SCROLL_DELAY);
    }, delay);
  };

  const pauseAutoScroll = () => {
    clearTimeout(autoScrollTimeout.current);
    const elapsed = Date.now() - lastStartTime.current;
    remainingTime.current = Math.max(0, AUTO_SCROLL_DELAY - elapsed);
  };

  const resumeAutoScroll = () => startAutoScroll(remainingTime.current);
  const restartAutoScroll = () => startAutoScroll(AUTO_SCROLL_DELAY);

  // --- Scroll to slide ---
  const scrollToSlide = (index: number) => {
    if (!sliderRef.current || products.length === 0) return;

    const slideWidth =
      sliderRef.current.querySelector<HTMLDivElement>(".coffee-card")
        ?.offsetWidth || 0;
    const maxIndex = products.length - 1;

    if (index > maxIndex) index = 0;
    if (index < 0) index = maxIndex;

    sliderRef.current.scrollTo({
      left: index * (slideWidth + GAP),
      behavior: "smooth",
    });

    setCurrentIndex(index);
  };

  // --- Update active dot on scroll ---
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const slideWidth =
      sliderRef.current.querySelector<HTMLDivElement>(".coffee-card")
        ?.offsetWidth || 0;
    const newIndex = Math.round(
      sliderRef.current.scrollLeft / (slideWidth + GAP),
    );
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  // --- Start auto scroll on mount ---
  useEffect(() => {
    if (products.length > 0) startAutoScroll();
    return () => clearTimeout(autoScrollTimeout.current);
  }, [products]);

  // --- Render states ---
  if (loading) {
    return (
      <section id="coffee-slider-container" className="coffee-slider-container">
        <h2
          className="heading-2"
          dangerouslySetInnerHTML={{ __html: t("coffeeSlider.title") }}
        />
        <div id="loader-placeholder" className="loader">
          {t("coffeeSlider.loading")}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="coffee-slider-container" className="coffee-slider-container">
        <h2
          className="heading-2"
          dangerouslySetInnerHTML={{ __html: t("coffeeSlider.title") }}
        />
        <p className="error-message">{t("coffeeSlider.error")}</p>
      </section>
    );
  }

  return (
    <section id="coffee-slider-container" className="coffee-slider-container">
      <h2
        className="heading-2"
        dangerouslySetInnerHTML={{ __html: t("coffeeSlider.title") }}
      />

      <div
        id="coffee-slider"
        className="coffee-slider"
        onMouseEnter={pauseAutoScroll}
        onMouseLeave={resumeAutoScroll}
        onTouchStart={pauseAutoScroll}
        onTouchEnd={resumeAutoScroll}
      >
        <button
          className="slider-btn prev"
          onClick={() => {
            scrollToSlide(currentIndex - 1);
            restartAutoScroll();
          }}
        >
          &larr;
        </button>

        <div className="coffee-slides" ref={sliderRef} onScroll={handleScroll}>
          {products.map((product, index) => (
            <div
              key={index}
              onClick={() => navigate("menu")}
              className="coffee-card"
            >
              <img
                loading="lazy"
                src={`./images/${product.name}.png`}
                alt={product.name}
                className="coffee-card__img"
              />
              <div className="coffee-card__info">
                <h3 className="heading-3">{product.name}</h3>
                <p className="text-medium">{product.description}</p>
                <span className="heading-3">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          className="slider-btn next"
          onClick={() => {
            scrollToSlide(currentIndex + 1);
            restartAutoScroll();
          }}
        >
          &rarr;
        </button>
      </div>

      <div id="slider-dots" className="slider-dots">
        {products.map((_, index) => (
          <div
            key={index}
            className={`slider-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => {
              scrollToSlide(index);
              restartAutoScroll();
            }}
          ></div>
        ))}
      </div>
    </section>
  );
});
