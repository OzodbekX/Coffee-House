// Define the structure of your product data (you already used similar in menu.ts)
import type {MenuProduct, ProductAdditive} from "./types"


/**
 * Displays the product details modal and handles interactive selections.
 */
export function showModal(product: MenuProduct): void {
    const modal = document.getElementById("product-modal") as HTMLElement | null;
    if (!modal) {
        console.error("#product-modal not found");
        return;
    }

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
    const basePrice = parseFloat(product.price as string);
    let selectedSize = 0;
    const selectedAdditives = new Set<ProductAdditive>();
    let firstSizeAddPrice = 0;

    // --- Fill static content ---
    img.src =`assets/images/${product.name}.png`;
    img.alt = product.name;
    title.textContent = product.name;
    desc.textContent = product.description;

    // --- Render sizes ---
    sizesContainer.innerHTML = "";
    let firstSizeBtn: HTMLButtonElement | null = null;
    const productSizes={
      "s": {
        "size": "200 ml",
        "add-price": "0.00"
      },
      "m": {
        "size": "300 ml",
        "add-price": "0.50"
      },
      "l": {
        "size": "400 ml",
        "add-price": "1.00"
      }
    }

    for (const [key, size] of Object.entries(productSizes)) {
        const btn = document.createElement("button");
        btn.innerHTML = `
      <div class="size-key text-link-button">${key.toUpperCase()}</div>
      <div class="text-link-button">${size.size}</div>
    `;

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
    const producAdditives=[
      {
        "name": "Sugar",
        "add-price": "0.50"
      },
      {
        "name": "Cinnamon",
        "add-price": "0.50"
      },
      {
        "name": "Syrup",
        "add-price": "0.50"
      }
    ]
    for (const add of producAdditives) {
        index++;
        const btn = document.createElement("button");
        btn.innerHTML = `
      <div class="size-key text-link-button">${index}</div>
      <div class="text-link-button">${add.name}</div>
    `;

        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
            if (selectedAdditives.has(add)) {
                selectedAdditives.delete(add);
            } else {
                selectedAdditives.add(add);
            }
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
        ;
    }

    // --- Show modal ---
    modal.classList.remove("hidden");

    // --- Close modal logic ---
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    // Initialize default total
    updateTotal();
}
