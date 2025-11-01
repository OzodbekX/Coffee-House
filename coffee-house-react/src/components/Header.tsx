import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.scss";

const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    return (
        <header className="header">
            <div className="container">
                {/* Logo */}
                <Link to="/" className="logo">
                    <img
                        loading="lazy"
                        src="./logos/logo.png"
                        alt="Coffee House"
                    />
                </Link>

                {/* Navigation */}
                <nav className={`nav ${mobileMenuOpen ? "open" : ""}`}>
                    <ul className="nav-links">
                        <li>
                            <Link className="text-link-button" to="/#coffee-slider">
                                Favorite Coffee
                            </Link>
                        </li>
                        <li>
                            <Link className="text-link-button" to="/#about">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link className="text-link-button" to="/#download-app">
                                Download App
                            </Link>
                        </li>
                        <li>
                            <Link className="text-link-button" to="/#contacts">
                                Contacts
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Right-side buttons */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                    }}
                >
                    <Link to="/cart" className="shopping-cart-link">
                        <img
                            loading="lazy"
                            height={20}
                            width={20}
                            src="./icons/shopping-bag.png"
                            alt="Shopping Cart"
                        />
                        <span className="text-link-button" id="shopping-item-count">
              2
            </span>
                    </Link>

                    <Link to="/menu" className="menu-toggle">
                        <span className="text-link-button">Menu</span>
                        <img
                            loading="lazy"
                            src="./icons/coffee-cup.png"
                            alt="menu"
                        />
                    </Link>
                </div>

                {/* Mobile navbar button */}
                <button
                    className={`mobile-navbar-button ${mobileMenuOpen ? "active" : ""}`}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {/* Closed (hamburger) icon */}
                    <svg
                        className="close"
                        width="18"
                        height="10"
                        viewBox="0 0 18 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1 1H17"
                            stroke="#403F3D"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M1 9H17"
                            stroke="#403F3D"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    {/* Open (X) icon */}
                    <svg
                        className="open"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1.34375 1.34314L12.6575 12.6568"
                            stroke="#403F3D"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M1.34375 12.6568L12.6575 1.34314"
                            stroke="#403F3D"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
