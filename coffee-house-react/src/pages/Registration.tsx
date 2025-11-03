import React, { useState, useEffect } from "react";
import "../styles/components/_registration.scss";
import { registerUser, type RegisterPayload } from "../assets/api";
import type { UserData } from "../assets/types";
import { useNavigate } from "react-router-dom";

// --- Dropdown data ---
const cities = ["New York", "Los Angeles", "Chicago"];
const cityStreets: Record<string, string[]> = {
    "New York": [
        "Broadway", "Wall Street", "Fifth Avenue", "Madison Ave", "Lexington Ave",
        "Park Ave", "Canal Street", "Houston Street", "Mulberry St", "Bleeker St"
    ],
    "Los Angeles": [
        "Sunset Blvd", "Hollywood Blvd", "Rodeo Drive", "Wilshire Blvd", "Melrose Ave",
        "Ventura Blvd", "Sepulveda Blvd", "Santa Monica Blvd", "La Brea Ave", "Fairfax Ave"
    ],
    "Chicago": [
        "Michigan Ave", "State Street", "Lake Shore Dr", "Wacker Dr", "Clark St",
        "Randolph St", "Madison St", "Monroe St", "Dearborn St", "LaSalle St"
    ]
};

const Registration: React.FC = () => {
    const navigate = useNavigate();

    // --- Form state ---
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [city, setCity] = useState(cities[0]);
    const [street, setStreet] = useState(cityStreets[cities[0]][0]);
    const [houseNumber, setHouseNumber] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
        text: "",
        type: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // --- Validation functions ---
    const validateLogin = (v: string): string | null => {
        if (v.length < 3) return "Login must be at least 3 characters long.";
        if (!/^[A-Za-z]/.test(v)) return "Login must start with a letter.";
        if (!/^[A-Za-z]+$/.test(v)) return "Only English letters are allowed.";
        return null;
    };

    const validatePassword = (v: string): string | null => {
        if (v.length < 6) return "Password must be at least 6 characters long.";
        if (!/[^A-Za-z0-9]/.test(v)) return "Password must contain at least 1 special character.";
        return null;
    };

    const validateConfirmPassword = (pass: string, confirm: string): string | null => {
        const base = validatePassword(confirm);
        if (base) return base;
        if (pass !== confirm) return "Passwords do not match.";
        return null;
    };

    const validateHouseNumber = (v: string): string | null => {
        const n = Number(v);
        if (!Number.isFinite(n)) return "House number must be a number.";
        if (n <= 1) return "House number must be greater than 1.";
        return null;
    };

    // --- Derived validity state ---
    const isFormValid =
        !validateLogin(login) &&
        !validatePassword(password) &&
        !validateConfirmPassword(password, confirm) &&
        !validateHouseNumber(houseNumber) &&
        Boolean(city) &&
        Boolean(street);

    // --- Auto-update street options when city changes ---
    useEffect(() => {
        const streets = cityStreets[city] || [];
        setStreet(streets[0]);
    }, [city]);

    const showMessage = (text: string, type: "success" | "error") => {
        setMessage({ text, type });
    };

    // --- onBlur validation handler ---  // NEW
    const handleBlur = (field: string) => {
        let error = "";
        switch (field) {
            case "login":
                error = validateLogin(login) || "";
                break;
            case "password":
                error = validatePassword(password) || "";
                break;
            case "confirm":
                error = validateConfirmPassword(password, confirm) || "";
                break;
            case "houseNumber":
                error = validateHouseNumber(houseNumber) || "";
                break;
            default:
                break;
        }
        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleFocus = (field: string) => {   // NEW
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    // --- Submit handler ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginErr = validateLogin(login);
        const passErr = validatePassword(password);
        const confirmErr = validateConfirmPassword(password, confirm);
        const houseErr = validateHouseNumber(houseNumber);

        if (loginErr || passErr || confirmErr || houseErr) {
            setErrors({
                login: loginErr || "",
                password: passErr || "",
                confirm: confirmErr || "",
                houseNumber: houseErr || "",
            });
            showMessage("Please fix the highlighted errors.", "error");
            return;
        }

        try {
            setLoading(true);

            const payload: RegisterPayload = {
                login,
                password,
                confirmPassword: confirm,
                city,
                street,
                houseNumber: Number(houseNumber),
                paymentMethod,
            };

            const res: { data: { access_token: string; user: UserData } } =
                await registerUser(payload);

            const token = res?.data?.access_token || "";
            if (token) localStorage.setItem("token", token);

            const newUser: UserData = {
                login,
                token,
                city,
                street,
                houseNumber: Number(houseNumber),
                paymentMethod,
            };

            localStorage.setItem("user", JSON.stringify(newUser));
            showMessage("Registration successful!", "success");
            setTimeout(() => navigate("/menu"), 1200);
        } catch (err) {
            console.error(err);
            showMessage("Registration failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <div id="header-placeholder"></div>
            <div id="mobile-navbar-placeholder"></div>

            <div className="registration-container">
                <h2 className="heading-2 registration-title">Registration</h2>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="login-register" className="text-medium">Login</label>
                            <input
                                id="login-register"
                                value={login}
                                placeholder="Placeholder"
                                onChange={(e) => setLogin(e.target.value)}
                                onBlur={() => handleBlur("login")}     // NEW
                                onFocus={() => handleFocus("login")}   // NEW
                                required
                                style={{
                                    border: errors.login ? "1px solid #b00020" : undefined,
                                }}
                            />
                            {errors.login && <div className="text-caption" style={{ color: "#b00020" }}>❗ {errors.login}</div>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="password-register" className="text-medium">Password</label>
                            <input
                                id="password-register"
                                type="password"
                                value={password}
                                placeholder="Placeholder"
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => handleBlur("password")}   // NEW
                                onFocus={() => handleFocus("password")} // NEW
                                required
                                style={{
                                    border: errors.password ? "1px solid #b00020" : undefined,
                                }}
                            />
                            {errors.password && <div className="text-caption" style={{ color: "#b00020" }}>❗ {errors.password}</div>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="confirm" className="text-medium">Confirm Password</label>
                            <input
                                id="confirm"
                                type="password"
                                value={confirm}
                                placeholder="Placeholder"
                                onChange={(e) => setConfirm(e.target.value)}
                                onBlur={() => handleBlur("confirm")}   // NEW
                                onFocus={() => handleFocus("confirm")} // NEW
                                required
                                style={{
                                    border: errors.confirm ? "1px solid #b00020" : undefined,
                                }}
                            />
                            {errors.confirm && <div className="text-caption" style={{ color: "#b00020" }}>❗ {errors.confirm}</div>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="city" className="text-medium">City</label>
                            <select id="city" value={city} onChange={(e) => setCity(e.target.value)} required>
                                {cities.map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="street" className="text-medium">Street</label>
                            <select id="street" value={street} onChange={(e) => setStreet(e.target.value)} required>
                                {(cityStreets[city] || []).map((s) => <option key={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="houseNumber" className="text-medium">House number</label>
                            <input
                                id="houseNumber"
                                type="number"
                                value={houseNumber}
                                placeholder="Placeholder"
                                onChange={(e) => setHouseNumber(e.target.value)}
                                onBlur={() => handleBlur("houseNumber")}  // NEW
                                onFocus={() => handleFocus("houseNumber")} // NEW
                                required
                                style={{
                                    border: errors.houseNumber ? "1px solid #b00020" : undefined,
                                }}
                            />
                            {errors.houseNumber && <div className="text-caption" style={{ color: "#b00020" }}>❗ {errors.houseNumber}</div>}
                        </div>

                        <div className="form-field payby-field">
                            <label className="text-medium">Pay by</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={paymentMethod === "cash"}
                                        onChange={() => setPaymentMethod("cash")}
                                    /> Cash
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === "card"}
                                        onChange={() => setPaymentMethod("card")}
                                    /> Card
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="button button--secondary"
                            disabled={loading || !isFormValid}
                        >
                            {loading ? "Loading..." : "Registration"}
                        </button>
                    </div>
                </form>

                {message.text && (
                    <div
                        className={`register-message ${message.type}`}
                        style={{
                            marginTop: "12px",
                            color: message.type === "error" ? "#b00020" : "green",
                        }}
                    >
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Registration;
