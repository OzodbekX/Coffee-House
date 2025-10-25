import { loginUser, type LoginPayload } from "./api";
import type { UserData } from "./types";
import "../scss/_main.scss";
import "./common-includes"
import "./footer"
const form = document.getElementById("login-form") as HTMLFormElement | null;
const message = document.getElementById("login-message") as HTMLElement | null;

function showMessage(text: string, type: "success" | "error") {
    if (!message) return;
    message.textContent = text;
    message.classList.remove("hidden", "success", "error");
    message.classList.add(type);
}

function ensureErrorElement(id: string, container: HTMLElement): HTMLElement {
    let el = document.getElementById(id) as HTMLElement | null;
    if (!el) {
        el = document.createElement("div");
        el.id = id;
        el.className = "text-caption";
        el.style.color = "#b00020";
        el.style.marginTop = "6px";
        container.appendChild(el);
    }
    return el;
}

function setFieldError(input: HTMLInputElement, errorEl: HTMLElement, text: string) {
    input.style.border = "1px solid #b00020";
    input.style.outline = "none";
    input.setAttribute("aria-invalid", "true");
    errorEl.textContent = `❗ ${text}`;
}

function clearFieldError(input: HTMLInputElement, errorEl: HTMLElement) {
    input.style.border = "";
    input.removeAttribute("aria-invalid");
    errorEl.textContent = "";
}

function validateLoginField(value: string): string | null {
    if (value.length < 3) return "Login must be at least 3 characters long.";
    if (!/^[A-Za-z]/.test(value)) return "Login must start with a letter.";
    if (!/^[A-Za-z]+$/.test(value)) return "Only English letters are allowed.";
    return null;
}

function validatePasswordField(value: string): string | null {
    if (value.length < 6) return "Password must be at least 6 characters long.";
    if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least 1 special character.";
    return null;
}

function updateSubmitState() {
    const loginInput = document.getElementById("login") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;
    const submitBtn = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (!loginInput || !passwordInput || !submitBtn) return;
    // submitBtn.disabled = Boolean(loginErr || passErr);
}

// Attach blur/focus handlers for validation UI
(() => {
    const loginFieldWrap = document.getElementById("login")?.closest(".form-field") as HTMLElement | null;
    const passFieldWrap = document.getElementById("password")?.closest(".form-field") as HTMLElement | null;
    const loginInput = document.getElementById("login") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;
    const submitBtn = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    if (!loginInput || !passwordInput || !loginFieldWrap || !passFieldWrap) return;

    const loginErrEl = ensureErrorElement("login-error", loginFieldWrap);
    const passErrEl = ensureErrorElement("password-error", passFieldWrap);

    // initial
    // if (submitBtn) submitBtn.disabled = true;

    loginInput.addEventListener("blur", () => {
        const err = validateLoginField(loginInput.value.trim());
        if (err) setFieldError(loginInput, loginErrEl, err);
        updateSubmitState();
    });
    loginInput.addEventListener("focus", () => {
        clearFieldError(loginInput, loginErrEl);
    });
    loginInput.addEventListener("input", updateSubmitState);

    passwordInput.addEventListener("blur", () => {
        const err = validatePasswordField(passwordInput.value);
        if (err) setFieldError(passwordInput, passErrEl, err);
        updateSubmitState();
    });
    passwordInput.addEventListener("focus", () => {
        clearFieldError(passwordInput, passErrEl);
    });
    passwordInput.addEventListener("input", updateSubmitState);
})();

form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = (document.getElementById("login") as HTMLInputElement).value.trim();
    const password = (document.getElementById("password") as HTMLInputElement).value;

    const loginErr = validateLoginField(login);
    const passErr = validatePasswordField(password);
    if (loginErr || passErr) {
        showMessage(loginErr || passErr || "Invalid input.", "error");
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const originalText = submitBtn?.textContent || "Sign In";
    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Loading...";
        }

        const payload: LoginPayload = { login, password };
        const res: { data: { access_token: string; user: UserData; } } = await loginUser(payload);
        console.log(res);
        const token: string = (res && (res.data?.access_token)) || "";
        if (token) {
            localStorage.setItem("token", token);
        }
        const newUser: UserData = {
            token: res.data.access_token,
            ...res?.data?.user
        };

        // Persist minimal user snapshot
        localStorage.setItem(
            "user",
            JSON.stringify({ login, token })
        );
        localStorage.setItem("user", JSON.stringify(newUser));

        showMessage("Signed in successfully!", "success");
        window.location.href = "shoppingCart.html";
    } catch (err: unknown) {
        console.log(err);
        showMessage("Incorrect login or password", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
});

