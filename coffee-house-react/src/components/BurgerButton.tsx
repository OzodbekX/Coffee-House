import React from "react";
import "@styles/components/_burger-button.scss";

export default function BurgerButton({
  toggleMobileMenu,
  isOpen,
}: {
  isOpen: boolean;
  toggleMobileMenu: (v: boolean) => void;
}) {
  const toggleMenu = () => {
    toggleMobileMenu(!isOpen);
  };

  return (
    <div className="burger-container">
      <button
        className={`burger-button ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="burger-icon">
          <span className="stick top"></span>
          <span className="stick bottom"></span>
        </div>
      </button>

      {/*<p className="status-text">{isOpen ? "Close" : "Menu"}</p>*/}
    </div>
  );
}
