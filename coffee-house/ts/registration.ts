import type {UserData} from "./types";
import {type RegisterPayload, registerUser} from "./api";
import "../scss/_main.scss"
import "./common-includes"
import "./footer"


const form = document.getElementById("register-form") as HTMLFormElement;
const message = document.getElementById("register-message") as HTMLElement;

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

function showMessage(text: string, type: "success" | "error") {
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

function setFieldError(input: HTMLInputElement | HTMLSelectElement, errorEl: HTMLElement, text: string) {
    (input as HTMLElement).style.border = "1px solid #b00020";
    input.setAttribute("aria-invalid", "true");
    errorEl.textContent = `❗ ${text}`;
    input.classList.add("error");
}

function clearFieldError(input: HTMLInputElement | HTMLSelectElement, errorEl: HTMLElement) {
    (input as HTMLElement).style.border = "";
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

function validateConfirmPassword(pass: string, confirm: string): string | null {
    const base = validatePasswordField(confirm);
    if (base) return base;
    if (pass !== confirm) return "Passwords do not match.";
    return null;
}

function validateHouseNumber(value: string): string | null {
    const n = Number(value);
    if (!Number.isFinite(n)) return "House number must be a number.";
    if (n <= 1) return "House number must be greater than 1.";
    return null;
}

function populateCitiesAndStreets() {
    const citySel = document.getElementById("city") as HTMLSelectElement | null;
    const streetSel = document.getElementById("street") as HTMLSelectElement | null;
    if (!citySel || !streetSel) return;
    citySel.innerHTML = cities.map(c => `<option value="${c}">${c}</option>`).join("");
    const setStreets = (city: string) => {
        const list = cityStreets[city] || [];
        streetSel.innerHTML = list.map(s => `<option value="${s}">${s}</option>`).join("");
    };
    setStreets(citySel.value || cities[0]);
    citySel.addEventListener("change", () => setStreets(citySel.value));
}

function updateSubmitState() {
    const loginInput = document.getElementById("login-register") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password-register") as HTMLInputElement | null;
    const confirmInput = document.getElementById("confirm") as HTMLInputElement | null;
    const citySel = document.getElementById("city") as HTMLSelectElement | null;
    const streetSel = document.getElementById("street") as HTMLSelectElement | null;
    const houseInput = document.getElementById("houseNumber") as HTMLInputElement | null;
    const submitBtn = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (!loginInput || !passwordInput || !confirmInput || !citySel || !streetSel || !houseInput || !submitBtn) return;

    const loginErr = validateLoginField(loginInput.value.trim());
    const passErr = validatePasswordField(passwordInput.value);
    const confirmErr = validateConfirmPassword(passwordInput.value, confirmInput.value);
    const houseErr = validateHouseNumber(houseInput.value.trim());
    const cityValid = Boolean(citySel.value);
    const streetValid = Boolean(streetSel.value);
    submitBtn.disabled = Boolean(loginErr || passErr || confirmErr || houseErr || !cityValid || !streetValid);
}

// Attach validation handlers
(() => {
    populateCitiesAndStreets();
    const loginFieldWrap = document.getElementById("login-register")?.closest(".form-field") as HTMLElement | null;
    const passFieldWrap = document.getElementById("password-register")?.closest(".form-field") as HTMLElement | null;
    const confirmFieldWrap = document.getElementById("confirm")?.closest(".form-field") as HTMLElement | null;
    const cityFieldWrap = document.getElementById("city")?.closest(".form-field") as HTMLElement | null;
    const streetFieldWrap = document.getElementById("street")?.closest(".form-field") as HTMLElement | null;
    const houseFieldWrap = document.getElementById("houseNumber")?.closest(".form-field") as HTMLElement | null;

    const loginInput = document.getElementById("login-register") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password-register") as HTMLInputElement | null;
    const confirmInput = document.getElementById("confirm") as HTMLInputElement | null;
    const citySel = document.getElementById("city") as HTMLSelectElement | null;
    const streetSel = document.getElementById("street") as HTMLSelectElement | null;
    const houseInput = document.getElementById("houseNumber") as HTMLInputElement | null;
    const submitBtn = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    if (!loginFieldWrap || !passFieldWrap || !confirmFieldWrap || !cityFieldWrap || !streetFieldWrap || !houseFieldWrap || !loginInput || !passwordInput || !confirmInput || !citySel || !streetSel || !houseInput) return;

    const loginErrEl = ensureErrorElement("register-login-error", loginFieldWrap);
    const passErrEl = ensureErrorElement("register-password-error", passFieldWrap);
    const confirmErrEl = ensureErrorElement("register-confirm-error", confirmFieldWrap);
    const cityErrEl = ensureErrorElement("register-city-error", cityFieldWrap);
    const streetErrEl = ensureErrorElement("register-street-error", streetFieldWrap);
    const houseErrEl = ensureErrorElement("register-house-error", houseFieldWrap);

    if (submitBtn) submitBtn.disabled = true;

    loginInput.addEventListener("blur", () => {
        const err = validateLoginField(loginInput.value.trim());
        if (err) setFieldError(loginInput, loginErrEl, err);
        updateSubmitState();
    });
    loginInput.addEventListener("focus", () => clearFieldError(loginInput, loginErrEl));
    loginInput.addEventListener("input", updateSubmitState);

    passwordInput.addEventListener("blur", () => {
        const err = validatePasswordField(passwordInput.value);
        if (err) setFieldError(passwordInput, passErrEl, err);
        updateSubmitState();
    });
    passwordInput.addEventListener("focus", () => clearFieldError(passwordInput, passErrEl));
    passwordInput.addEventListener("input", () => {
        // also revalidate confirm when password changes
        const cerr = validateConfirmPassword(passwordInput.value, confirmInput.value);
        if (!cerr) clearFieldError(confirmInput, confirmErrEl);
        updateSubmitState();
    });

    confirmInput.addEventListener("blur", () => {
        const err = validateConfirmPassword(passwordInput.value, confirmInput.value);
        if (err) setFieldError(confirmInput, confirmErrEl, err);
        updateSubmitState();
    });
    confirmInput.addEventListener("focus", () => clearFieldError(confirmInput, confirmErrEl));
    confirmInput.addEventListener("input", updateSubmitState);

    citySel.addEventListener("blur", () => {
        if (!citySel.value) setFieldError(citySel, cityErrEl, "Please select a city.");
        updateSubmitState();
    });
    citySel.addEventListener("focus", () => clearFieldError(citySel, cityErrEl));
    citySel.addEventListener("change", () => {
        clearFieldError(citySel, cityErrEl);
        // re-populated streets handled in populateCitiesAndStreets by change handler
        clearFieldError(streetSel, streetErrEl);
        updateSubmitState();
    });

    streetSel.addEventListener("blur", () => {
        if (!streetSel.value) setFieldError(streetSel, streetErrEl, "Please select a street.");
        updateSubmitState();
    });
    streetSel.addEventListener("focus", () => clearFieldError(streetSel, streetErrEl));
    streetSel.addEventListener("change", updateSubmitState);

    houseInput.addEventListener("blur", () => {
        const err = validateHouseNumber(houseInput.value.trim());
        if (err) setFieldError(houseInput, houseErrEl, err);
        updateSubmitState();
    });
    houseInput.addEventListener("focus", () => clearFieldError(houseInput, houseErrEl));
    houseInput.addEventListener("input", updateSubmitState);
})();

async function validateForm(e: Event) {
    e.preventDefault();
    debugger
    const login = (document.getElementById("login-register") as HTMLInputElement).value.trim();
    const password = (document.getElementById("password-register") as HTMLInputElement).value;
    const confirm = (document.getElementById("confirm") as HTMLInputElement).value;
    const city = (document.getElementById("city") as HTMLSelectElement).value;
    const street = (document.getElementById("street") as HTMLSelectElement).value;
    const houseNumber = (document.getElementById("houseNumber") as HTMLInputElement).value.trim();
    const payByRaw = (
        document.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement
    )?.value;

    const loginErr = validateLoginField(login);
    const passErr = validatePasswordField(password);
    const confirmErr = validateConfirmPassword(password, confirm);
    const houseErr = validateHouseNumber(houseNumber);
    if (loginErr || passErr || confirmErr || houseErr || !city || !street) {
        showMessage(loginErr || passErr || confirmErr || houseErr || "Please fill all fields correctly.", "error");
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const originalText = submitBtn?.textContent || "Registration";
    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Loading...";
        }

        const payload: RegisterPayload = {
            login,
            password,
            confirmPassword: confirm,
            city,
            street,
            houseNumber: Number(houseNumber),
            paymentMethod: (payByRaw || "cash").toLowerCase() as RegisterPayload["paymentMethod"],
        };

        const res: { data: { access_token: string, user: UserData } } = await registerUser(payload);

        const token: string = (res && (res.data.access_token)) || "";
        if (token) {
            localStorage.setItem("token", token);
        }

        const newUser: UserData = {
            login,
            token,
            city,
            street,
            houseNumber: Number(houseNumber),
            paymentMethod: payload.paymentMethod,
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        showMessage("Registration successful!", "success");
        window.location.href = "shoppingCart.html";
    } catch (err: unknown) {
        console.error(err);
        showMessage("Registration failed. Please try again.", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

form?.addEventListener("submit", async (e) => {

    await validateForm(e)
});
