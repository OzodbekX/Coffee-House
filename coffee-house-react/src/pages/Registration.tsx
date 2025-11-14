import React, { useEffect, useState } from "react";
import { type RegisterPayload, registerUser } from "@assets/api";
import type { UserData } from "@assets/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ⬅️ Import i18n
import "@styles/components/_registration.scss";
import { useUser } from "../../context/UserContext";

// --- Dropdown data ---
const cities = ["New York", "Los Angeles", "Chicago"];
const cityStreets: Record<string, string[]> = {
  "New York": [
    "Broadway",
    "Wall Street",
    "Fifth Avenue",
    "Madison Ave",
    "Lexington Ave",
    "Park Ave",
    "Canal Street",
    "Houston Street",
    "Mulberry St",
    "Bleeker St",
  ],
  "Los Angeles": [
    "Sunset Blvd",
    "Hollywood Blvd",
    "Rodeo Drive",
    "Wilshire Blvd",
    "Melrose Ave",
    "Ventura Blvd",
    "Sepulveda Blvd",
    "Santa Monica Blvd",
    "La Brea Ave",
    "Fairfax Ave",
  ],
  Chicago: [
    "Michigan Ave",
    "State Street",
    "Lake Shore Dr",
    "Wacker Dr",
    "Clark St",
    "Randolph St",
    "Madison St",
    "Monroe St",
    "Dearborn St",
    "LaSalle St",
  ],
};

const Registration: React.FC = () => {
  const { t } = useTranslation(); // ⬅️ i18n hook
  const navigate = useNavigate();
  const { setUser } = useUser();
  // --- Form state ---
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [city, setCity] = useState(cities[0]);
  const [street, setStreet] = useState(cityStreets[cities[0]][0]);
  const [houseNumber, setHouseNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // --- Validation functions ---
  const validateLogin = (v: string): string | null => {
    if (v.length < 3) return t("login.validation.loginTooShort");
    if (!/^[A-Za-z]/.test(v)) return t("login.validation.loginStartLetter");
    if (!/^[A-Za-z]+$/.test(v))
      return t("registration.validation.loginEnglish");
    return null;
  };

  const validatePassword = (v: string): string | null => {
    if (v.length < 6) return t("registration.validation.passwordTooShort");
    if (!/[^A-Za-z0-9]/.test(v))
      return t("registration.validation.passwordSpecial");
    return null;
  };

  const validateConfirmPassword = (
    pass: string,
    confirm: string,
  ): string | null => {
    const base = validatePassword(confirm);
    if (base) return base;
    if (pass !== confirm) return t("registration.validation.passwordMismatch");
    return null;
  };

  const validateHouseNumber = (v: string): string | null => {
    const n = Number(v);
    if (!Number.isFinite(n))
      return t("registration.validation.houseNumberNumeric");
    if (n <= 1) return t("registration.validation.houseNumberPositive");
    return null;
  };

  const isFormValid =
    !validateLogin(login) &&
    !validatePassword(password) &&
    !validateConfirmPassword(password, confirm) &&
    !validateHouseNumber(houseNumber) &&
    Boolean(city) &&
    Boolean(street);

  useEffect(() => {
    const streets = cityStreets[city] || [];
    setStreet(streets[0]);
  }, [city]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
  };

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

  const handleFocus = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

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
      showMessage(t("registration.messages.fixErrors"), "error");
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
      setUser(newUser);
      showMessage(t("registration.messages.success"), "success");
      setTimeout(() => navigate("/menu"), 1200);
    } catch (err) {
      console.error(err);
      showMessage(t("registration.messages.error"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div id="header-placeholder"></div>
      <div id="mobile-navbar-placeholder"></div>

      <div className="registration-container">
        <h2 className="heading-2 registration-title">
          {t("registration.title")}
        </h2>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            {/* Login */}
            <div className="form-field">
              <label htmlFor="login-register" className="text-medium">
                {t("registration.labels.login")}
              </label>
              <input
                id="login-register"
                value={login}
                placeholder={t("registration.placeholder")}
                onChange={(e) => setLogin(e.target.value)}
                onBlur={() => handleBlur("login")}
                onFocus={() => handleFocus("login")}
                required
                style={{
                  border: errors.login ? "1px solid #b00020" : undefined,
                }}
              />
              {errors.login && (
                <div className="text-caption" style={{ color: "#b00020" }}>
                  ❗ {errors.login}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="form-field">
              <label htmlFor="password-register" className="text-medium">
                {t("registration.labels.password")}
              </label>
              <input
                id="password-register"
                type="password"
                value={password}
                placeholder={t("registration.placeholder")}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                onFocus={() => handleFocus("password")}
                required
                style={{
                  border: errors.password ? "1px solid #b00020" : undefined,
                }}
              />
              {errors.password && (
                <div className="text-caption" style={{ color: "#b00020" }}>
                  ❗ {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-field">
              <label htmlFor="confirm" className="text-medium">
                {t("registration.labels.confirmPassword")}
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                placeholder={t("registration.placeholder")}
                onChange={(e) => setConfirm(e.target.value)}
                onBlur={() => handleBlur("confirm")}
                onFocus={() => handleFocus("confirm")}
                required
                style={{
                  border: errors.confirm ? "1px solid #b00020" : undefined,
                }}
              />
              {errors.confirm && (
                <div className="text-caption" style={{ color: "#b00020" }}>
                  ❗ {errors.confirm}
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            {/* City */}
            <div className="form-field">
              <label htmlFor="city" className="text-medium">
                {t("registration.labels.city")}
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Street */}
            <div className="form-field">
              <label htmlFor="street" className="text-medium">
                {t("registration.labels.street")}
              </label>
              <select
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              >
                {(cityStreets[city] || []).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* House Number */}
            <div className="form-field">
              <label htmlFor="houseNumber" className="text-medium">
                {t("registration.labels.houseNumber")}
              </label>
              <input
                id="houseNumber"
                type="number"
                value={houseNumber}
                placeholder={t("registration.placeholder")}
                onChange={(e) => setHouseNumber(e.target.value)}
                onBlur={() => handleBlur("houseNumber")}
                onFocus={() => handleFocus("houseNumber")}
                required
                style={{
                  border: errors.houseNumber ? "1px solid #b00020" : undefined,
                }}
              />
              {errors.houseNumber && (
                <div className="text-caption" style={{ color: "#b00020" }}>
                  ❗ {errors.houseNumber}
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="form-field payby-field">
              <label className="text-medium">
                {t("registration.labels.payBy")}
              </label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />{" "}
                  {t("registration.labels.cash")}
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  {t("registration.labels.card")}
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
              {loading
                ? t("registration.button.loading")
                : t("registration.button.register")}
            </button>
          </div>
        </form>

        {message.text ? (
          <div
            className={`register-message ${message.type}`}
            style={{
              marginTop: "12px",
              color: message.type === "error" ? "#b00020" : "green",
            }}
          >
            {message.text}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Registration;
