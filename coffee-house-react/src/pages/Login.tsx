import React, {useState} from "react";
import "../styles/components/_login.scss";
import {LoginPayload, loginUser} from "../assets/api";
import {UserData} from "../assets/types";
import {useNavigate} from "react-router-dom";

const Login: React.FC = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
        text: "",
        type: "",
    });
    const [errors, setErrors] = useState<{ login?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // --- Validation ---
    const validateLoginField = (value: string): string | null => {
        if (value.length < 3) return "Login must be at least 3 characters long.";
        if (!/^[A-Za-z]/.test(value)) return "Login must start with a letter.";
        if (!/^[A-Za-z]+$/.test(value)) return "Only English letters are allowed.";
        return null;
    };

    const validatePasswordField = (value: string): string | null => {
        if (value.length < 6) return "Password must be at least 6 characters long.";
        if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least 1 special character.";
        return null;
    };
    const isFormValid =
        !validateLoginField(login) && !validatePasswordField(password);


    // --- Handlers ---
    const handleBlur = (field: "login" | "password") => {
        const value = field === "login" ? login : password;
        const error =
            field === "login" ? validateLoginField(value) : validatePasswordField(value);
        setErrors((prev) => ({...prev, [field]: error || ""}));
    };

    const handleFocus = (field: "login" | "password") => {
        setErrors((prev) => ({...prev, [field]: ""}));
    };

    const showMessage = (text: string, type: "success" | "error") => {
        setMessage({text, type});
    };

    // --- Submit ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginErr = validateLoginField(login);
        const passErr = validatePasswordField(password);

        if (loginErr || passErr) {
            setErrors({login: loginErr || "", password: passErr || ""});
            showMessage(loginErr || passErr || "Invalid input.", "error");
            return;
        }

        try {
            setLoading(true);
            const payload: LoginPayload = {login, password};
            const res: { data: { access_token: string; user: UserData } } = await loginUser(payload);

            const token = res?.data?.access_token || "";
            if (token) {
                localStorage.setItem("token", token);
            }

            const newUser: UserData = {token, ...res.data.user};
            localStorage.setItem("user", JSON.stringify(newUser));

            showMessage("Signed in successfully!", "success");

            setTimeout(() => navigate("/menu"), 1000);
        } catch (err) {
            console.error(err);
            showMessage("Incorrect login or password", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <div id="header-placeholder"></div>
            <div id="mobile-navbar-placeholder"></div>

            <div className="login-container">
                <h2 className="heading-2 login-title">Sign In</h2>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-row-login">
                        <div className="form-field">
                            <label htmlFor="login" className="text-medium">Login</label>
                            <input
                                type="text"
                                id="login"
                                value={login}
                                placeholder="Placeholder"
                                onChange={(e) => setLogin(e.target.value)}
                                onBlur={() => handleBlur("login")}
                                onFocus={() => handleFocus("login")}
                                required
                                aria-invalid={!!errors.login}
                                style={{
                                    border: errors.login ? "1px solid #b00020" : undefined,
                                    outline: "none",
                                }}
                            />
                            {errors.login && (
                                <div className="text-caption" style={{color: "#b00020", marginTop: "6px"}}>
                                    ❗ {errors.login}
                                </div>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="password" className="text-medium">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                placeholder="Placeholder"
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => handleBlur("password")}
                                onFocus={() => handleFocus("password")}
                                required
                                aria-invalid={!!errors.password}
                                style={{
                                    border: errors.password ? "1px solid #b00020" : undefined,
                                    outline: "none",
                                }}
                            />
                            {errors.password && (
                                <div className="text-caption" style={{color: "#b00020", marginTop: "6px"}}>
                                    ❗ {errors.password}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="button button--secondary"
                            disabled={loading || !isFormValid}  // ⬅️ disable if invalid or loading
                        >
                            {loading ? "Loading..." : "Sign In"}
                        </button>
                    </div>
                </form>

                {message.text && (
                    <div
                        className={`login-message ${message.type}`}
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

export default Login;
