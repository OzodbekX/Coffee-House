import { loginUser, type LoginPayload } from "./api";
import type{ UserData } from "./types";
import "../scss/_main.scss";

const form = document.getElementById("login-form") as HTMLFormElement | null;
const message = document.getElementById("login-message") as HTMLElement | null;

function showMessage(text: string, type: "success" | "error") {
    if (!message) return;
    message.textContent = text;
    message.classList.remove("hidden", "success", "error");
    message.classList.add(type);
}

form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = (document.getElementById("login") as HTMLInputElement).value.trim();
    const password = (document.getElementById("password") as HTMLInputElement).value;

    if (!login || !password) {
        showMessage("Both fields are required.", "error");
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
        const res: any = await loginUser(payload);
        console.log({ res });
        debugger
        const token: string = (res && (res.token || res.data?.token)) || "";
        if (token) {
            localStorage.setItem("token", token);
        }
        const newUser: UserData = {
            login,
            token,
            ...res?.data?.user
        };

        // Persist minimal user snapshot
        localStorage.setItem(
            "user",
            JSON.stringify({ login, token })
        );
        localStorage.setItem("user", JSON.stringify(newUser));

        window.location.href = "shoppingCart.html";

        showMessage("Signed in successfully!", "success");
        window.location.href = "shoppingCart.html";
    } catch (err) {
        alert("Login failed. Please check your credentials and try again.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
});
