import type { UserData } from "./types";
import { registerUser, type RegisterPayload } from "./api";
import "../scss/_main.scss";


const form = document.getElementById("register-form") as HTMLFormElement;
const message = document.getElementById("register-message") as HTMLElement;

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const login = (document.getElementById("login") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value;
  const confirm = (document.getElementById("confirm") as HTMLInputElement).value;
  const city = (document.getElementById("city") as HTMLInputElement).value.trim();
  const street = (document.getElementById("street") as HTMLInputElement).value.trim();
  const houseNumber = (document.getElementById("houseNumber") as HTMLInputElement).value.trim();
  const payByRaw = (
    document.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement
  )?.value;

  if (!login || !password || !confirm || !city || !street || !houseNumber) {
    showMessage("All fields are required.", "error");
    return;
  }

  if (password !== confirm) {
    showMessage("Passwords do not match.", "error");
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

    const res: any = await registerUser(payload);

    const token: string = (res && (res.token || res.data?.token)) || "";
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
  } catch (err) {
    alert("Registration failed. Please try again.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
});

function showMessage(text: string, type: "success" | "error") {
  message.textContent = text;
  message.classList.remove("hidden", "success", "error");
  message.classList.add(type);
}
