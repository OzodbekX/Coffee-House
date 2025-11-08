import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SettingsDropdown } from "./SettingsDropDown";
import { useManagerState } from "../../context/CartContext";
import BurgerButton from "./BurgerButton";
import "../styles/components/_header.scss";
import { MobileMenu } from "./MobileMenu";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCount } = useManagerState();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);

    if (location.pathname !== "/") {
      // If on a different page, navigate to home with hash
      navigate(`/#${id}`);
    } else {
      // Already on home, update hash manually
      window.location.hash = id;
    }
  };

  interface NavLinkItem {
    id: string;
    label: string;
  }

  const navLinks: NavLinkItem[] = [
    {
      id: "coffee-slider-container",
      label: t("header.navLinks.favoriteCoffee"),
    },
    { id: "about-section", label: t("header.navLinks.about") },
    { id: "download-app-section", label: t("header.navLinks.downloadApp") },
    { id: "contacts-section", label: t("header.navLinks.contacts") },
  ];

  return (
    <header className="header">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img loading="lazy" src="./logos/logo.png" alt="Coffee House" />
        </Link>

        {/* Navigation */}
        <nav className={`nav ${mobileMenuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <span
                  className="text-link-button pointer"
                  onClick={() => handleScrollTo(link.id)}
                >
                  {link.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right-side buttons */}
        <div className={"right-side-buttons"}>
          <SettingsDropdown setMobileMenuOpen={setMobileMenuOpen} />
          {totalCount > 0 ? (
            <Link to="/cart" className="shopping-cart-link">
              <img
                loading="lazy"
                height={20}
                width={20}
                src="./icons/shopping-bag.png"
                alt="Shopping Cart"
              />
              <span className="text-link-button" id="shopping-item-count">
                {totalCount}
              </span>
            </Link>
          ) : null}

          <Link to="/menu" className="menu-toggle">
            <span className="text-link-button">{t("header.menu")}</span>
            <img loading="lazy" src="./icons/coffee-cup.png" alt="menu" />
          </Link>
          <BurgerButton
            toggleMobileMenu={toggleMobileMenu}
            isOpen={mobileMenuOpen}
          />
        </div>
      </div>
      <MobileMenu
        navLinks={navLinks}
        isOpen={mobileMenuOpen}
        handleScrollTo={handleScrollTo}
        toggleMobileMenu={toggleMobileMenu}
      />
    </header>
  );
};

export default Header;
