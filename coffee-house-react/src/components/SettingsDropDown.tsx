import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/components/_settings_dropdown.scss";
import {UserData} from "../assets/types";
import {getUserData} from "../assets/helpers";

export const SettingsDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"light" | "dark">("light");
    const [language, setLanguage] = useState("EN");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [user] = useState<UserData | null>(getUserData());

    const languages = ["EN", "ES", "DE", "UZ"];

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleModeChange = (newMode: "light" | "dark") => {
        setMode(newMode);
        document.documentElement.classList.toggle("dark", newMode === "dark");
    };

    const goToOrders = () => {
        navigate("/orders");
        setIsOpen(false);
    };

    const handleLogin = () => {
        navigate("/login");
        setIsOpen(false);
    };
    console.log({user})

    return (
        <div className="settings-dropdown" ref={dropdownRef}>
            {/* ⚙️ Settings Icon */}
            <button
                className="settings-icon"
                aria-label="Settings"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <img height={20} width={20} src="/icons/settings-dropdown.png" alt="settigns"/>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="dropdown-content">
                    {/* Theme */}
                    <div className="dropdown-section">
                        <p className="dropdown-title">Theme</p>
                        <div className="radio-group">
                            {["light", "dark"].map((m) => (
                                <label key={m} className="radio-option">
                                    <input
                                        type="radio"
                                        name="mode"
                                        checked={mode === m}
                                        onChange={() => handleModeChange(m as "light" | "dark")}
                                    />
                                    <span>{m === "light" ? "Light" : "Dark"}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <hr/>

                    {/* Language */}
                    <div className="dropdown-section">
                        <p className="dropdown-title">Language</p>
                        <div className="radio-grid">
                            {languages.map((lang) => (
                                <label key={lang} className="radio-option">
                                    <input
                                        type="radio"
                                        name="language"
                                        checked={language === lang}
                                        onChange={() => setLanguage(lang)}
                                    />
                                    <span>{lang}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <hr/>

                    {/* Orders */}
                    <button className="dropdown-btn" onClick={goToOrders}>
                        🧾 Orders List
                    </button>

                    {/* Login */}
                    {user ? <p className={"user-data"}>{user?.login}</p> : <button className="dropdown-btn" onClick={handleLogin}>
                        🔑 Login
                    </button>}
                </div>
            )}
        </div>
    );
};
