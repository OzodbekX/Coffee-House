import type{ UserData } from "./types";
import "../scss/_main.scss"


const form = document.getElementById("register-form") as HTMLFormElement;
const message = document.getElementById("register-message") as HTMLElement;

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const login = (document.getElementById("login") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value;
  const confirm = (document.getElementById("confirm") as HTMLInputElement).value;
  const city = (document.getElementById("city") as HTMLInputElement).value.trim();
  const street = (document.getElementById("street") as HTMLInputElement).value.trim();
  const house = (document.getElementById("house") as HTMLInputElement).value.trim();
  const payBy = (
    document.querySelector('input[name="payBy"]:checked') as HTMLInputElement
  )?.value;

  if (!login || !password || !confirm || !city || !street || !house) {
    showMessage("All fields are required.", "error");
    return;
  }

  if (password !== confirm) {
    showMessage("Passwords do not match.", "error");
    return;
  }

  // Mock token creation
  const token = crypto.randomUUID();

  const newUser: UserData = {
    login,
    token,
    city,
    street,
    house,
    payBy,
  };

  // Save to localStorage
  localStorage.setItem("user", JSON.stringify(newUser));

  showMessage("Registration successful!", "success");

  setTimeout(() => {
    window.location.href = "cart.html"; // redirect to cart
  }, 1500);
});

function showMessage(text: string, type: "success" | "error") {
  message.textContent = text;
  message.classList.remove("hidden", "success", "error");
  message.classList.add(type);
}
