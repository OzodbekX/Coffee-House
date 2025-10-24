// Define the structure of your product data (you already used similar in menu.ts)
import { fetchProductById } from "./api";
import type { ProductType } from "./types"


/**
 * Displays the product details modal and handles interactive selections.
 */
export async function showModal(product: ProductType): Promise<void> {
  const modal = document.getElementById("product-modal") as HTMLElement | null;
  if (!modal) {
    console.error("#product-modal not found");
    return;
  }
  modal.classList.remove("hidden")
  const loader = modal.querySelector("#loader") as HTMLElement | null;
  const modalContent = modal.querySelector(".modal-content") as HTMLElement | null;

  try {
    modalContent?.classList.add("hidden")
    loader?.classList.remove("hidden")
    const res = await fetchProductById(product.id);
    const data = res?.data;
    fillModal(modal, data)

  } catch (error) {
    modal.classList.add("hidden")
    modalContent?.classList.remove("hidden")
    loader?.classList.add("hidden")
    errorAlert(error as string)

  } finally {
    modalContent?.classList.remove("hidden")
    loader?.classList.add("hidden")


  }
}
function fillModal(modal: HTMLElement, product: ProductType) {
  const img = modal.querySelector<HTMLImageElement>(".modal-image");
  const title = modal.querySelector<HTMLElement>(".modal-title");
  const desc = modal.querySelector<HTMLElement>(".modal-description");
  const sizesContainer = modal.querySelector<HTMLElement>(".sizes");
  const additivesContainer = modal.querySelector<HTMLElement>(".additives");
  const priceEl = modal.querySelector<HTMLElement>(".price");
  const closeBtn = modal.querySelector<HTMLButtonElement>(".close-btn");

  if (!img || !title || !desc || !sizesContainer || !additivesContainer || !priceEl || !closeBtn) {
    console.error("Modal elements missing. Please check modal structure.");
    return;
  }

  // --- Base state ---
  const basePrice = parseFloat(product.price);
  const discountPrice = parseFloat(product.discountPrice || product.discountPrice || product.price);
  let selectedSize = 0;
  const selectedAdditives = new Set<{ name: string; "add-price": string }>();
  let firstSizeAddPrice = 0;

  // --- Tooltip element ---
  const tooltip = document.createElement("div");
  tooltip.className = "price-tooltip hidden";
  document.body.appendChild(tooltip);

  // --- Fill static content ---
  img.src = `assets/images/${product.name}.png`;
  img.alt = product.name;
  title.textContent = product.name;
  desc.textContent = product.description;

  // --- Render sizes ---
  sizesContainer.innerHTML = "";
  let firstSizeBtn: HTMLButtonElement | null = null;
  const productSizes = {
    s: { size: "200 ml", "add-price": "0.00" },
    m: { size: "300 ml", "add-price": "0.50" },
    l: { size: "400 ml", "add-price": "1.00" },
  };

  for (const [key, size] of Object.entries(productSizes)) {
    const btn = document.createElement("button");
    btn.innerHTML = `
      <div class="size-key text-link-button">${key.toUpperCase()}</div>
      <div class="text-link-button">${size.size}</div>
    `;

    // --- Hover tooltip ---
    btn.addEventListener("mouseenter", (e) => showTooltip(e, size["add-price"]));
    btn.addEventListener("mouseleave", hideTooltip);

    btn.addEventListener("click", () => {
      sizesContainer.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = parseFloat(size["add-price"]);
      updateTotal();
    });

    if (!firstSizeBtn) {
      firstSizeBtn = btn;
      firstSizeAddPrice = parseFloat(size["add-price"]);
    }

    sizesContainer.appendChild(btn);
  }

  if (firstSizeBtn) {
    firstSizeBtn.classList.add("active");
    selectedSize = firstSizeAddPrice;
  }

  // --- Render additives ---
  additivesContainer.innerHTML = "";
  let index = 0;
  const producAdditives = [
    { name: "Sugar", "add-price": "0.50" },
    { name: "Cinnamon", "add-price": "0.50" },
    { name: "Syrup", "add-price": "0.50" },
  ];

  for (const add of producAdditives) {
    index++;
    const btn = document.createElement("button");
    btn.innerHTML = `
      <div class="size-key text-link-button">${index}</div>
      <div class="text-link-button">${add.name}</div>
    `;

    // --- Hover tooltip ---
    btn.addEventListener("mouseenter", (e) => showTooltip(e, add["add-price"]));
    btn.addEventListener("mouseleave", hideTooltip);

    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      if (selectedAdditives.has(add)) selectedAdditives.delete(add);
      else selectedAdditives.add(add);
      updateTotal();
    });

    additivesContainer.appendChild(btn);
  }

  // --- Update total price ---
  function updateTotal(): void {
    let total = basePrice;
    if (selectedSize) total += selectedSize;
    selectedAdditives.forEach((a) => (total += parseFloat(a["add-price"])));
    if (priceEl) {
      priceEl.textContent = `$${total.toFixed(2)}`;

    }
  }

  // --- Tooltip Handlers ---
  function showTooltip(e: MouseEvent, addPrice: string) {
    console.log("33333333333333333",e.pageY)
    const total = basePrice + parseFloat(addPrice || "0") + selectedSize;
    const discounted = total - (basePrice - discountPrice);
    tooltip.innerHTML = `
      <div><strong>Total:</strong> $${total.toFixed(2)}</div>
      <div><strong>With discount:</strong> $${discounted.toFixed(2)}</div>
    `;
    tooltip.classList.remove("hidden");
    tooltip.style.left = `${e.pageX + 15}px`;
    tooltip.style.top = `${e.pageY + 15}px`;
  }

  function hideTooltip() {
    console.log("44444444444444444")
    tooltip.classList.add("hidden");
  }

  // --- Show modal ---
  modal.classList.remove("hidden");

  // --- Close modal logic ---
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  updateTotal();
}



function errorAlert(error: string) {
  console.error("Error loading products:", error);

  // Remove existing alert if any
  const existingAlert = document.getElementById("error-alert");
  if (existingAlert) existingAlert.remove();

  // Create alert element
  const alert = document.createElement("div");
  alert.id = "error-alert";
  alert.textContent = "Something went wrong. Please, try again";

  // Inline styles
  alert.style.position = "fixed";
  alert.style.top = "0";
  alert.style.left = "50%";
  alert.style.transform = "translateX(-50%)";
  alert.style.backgroundColor = "#b00020";
  alert.style.color = "white";
  alert.style.padding = "1rem 2rem";
  alert.style.borderRadius = "0 0 12px 12px";
  alert.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
  alert.style.fontSize = "1rem";
  alert.style.fontWeight = "500";
  alert.style.zIndex = "2000";
  alert.style.opacity = "0";
  alert.style.transition = "opacity 0.4s ease, top 0.4s ease";

  document.body.appendChild(alert);

  // Animate in
  setTimeout(() => {
    alert.style.top = "0px";
    alert.style.opacity = "1";
  }, 50);

  // Auto-hide after 4 seconds
  setTimeout(() => {
    alert.style.opacity = "0";
    alert.style.top = "-100px";
    setTimeout(() => alert.remove(), 400);
  }, 4000);
}