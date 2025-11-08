import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useManagerState } from "../../context/CartContext";
import "../styles/components/_mobile-menu.scss";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: { id: string; label: string }[];
  toggleMobileMenu: () => void;
  handleScrollTo: (id: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navLinks,
  handleScrollTo,
  toggleMobileMenu,
}) => {
  const { totalCount } = useManagerState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const changePage = (path: string) => {
    navigate(path);
    toggleMobileMenu();
  };
  return (
    <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
      <div className="mobile-menu__content">
        {/*<div className="mobile-menu__header">*/}
        {/*  <div onClick={() => changePage("/")} className="logo">*/}
        {/*    <img loading="lazy" src="./logos/logo.png" alt="Coffee House" />*/}
        {/*  </div>*/}
        {/*  <BurgerButton toggleMobileMenu={toggleMobileMenu} isOpen={isOpen} />*/}
        {/*</div>*/}

        <ul className="mobile-menu__list">
          {navLinks?.map((link) => (
            <li
              onClick={() => handleScrollTo(link.id)}
              key={link.id + "mobile"}
            >
              {link.label}
            </li>
          ))}
          <li
            className={"mobile-menu-with-icon"}
            key={"menu-mobile"}
            onClick={() => changePage("/menu")}
          >
            <span className="text-link-button">{t("header.menu")}</span>
            <img
              height={20}
              width={20}
              loading="lazy"
              src="./icons/coffee-cup.png"
              alt="menu"
            />
          </li>
          {totalCount > 0 ? (
            <li
              className={"mobile-menu-with-icon"}
              key={"menu-mobile"}
              onClick={() => changePage("/cart")}
            >
              <p>{t("cartPage.title")}</p>
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
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
};
