// Define the structure of your product data (you already used similar in menu.ts)
import {fetchProductById} from "./api";
import {
    calculatePrice,
    producAdditives,
    productSizes,
    productSizesDesert,
    renderPrice,
    setShoppingItemCount,
    writePriceWithDiscount
} from "./helpers";

import type {ProductType} from "./types"


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


    const sizesMap = product.category === "dessert" ? productSizesDesert : productSizes;

    for (const [key, size] of Object.entries(sizesMap)) {
        const btn = document.createElement("button");
        btn.innerHTML = `
      <div class="size-key text-link-button">${key.toUpperCase()}</div>
      <div class="text-link-button">${size.size}</div>
    `;

        // --- Hover tooltip ---
        btn.addEventListener("mouseenter", (e) => showTooltip(e, size["add-price"], "size"));
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


    for (const add of producAdditives) {
        index++;
        const btn = document.createElement("button");
        btn.innerHTML = `
      <div class="size-key text-link-button">${index}</div>
      <div class="text-link-button">${add.name}</div>
    `;

        // --- Hover tooltip ---
        btn.addEventListener("mouseenter", (e) => showTooltip(e, add["add-price"], "additive", add));
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
        selectedAdditives.forEach((a) => (total += parseFloat(a["add-price"])));
        if (priceEl) {
            const {total, discounted} = calculatePrice({
                product: {price: product.price, discountPrice: product.discountPrice},
                size: selectedSize,
                additives: Array.from(selectedAdditives)
            });
            priceEl.innerHTML = renderPrice(total, discounted);
        }
    }

    // --- Tooltip Handlers ---
    function showTooltip(
        e: MouseEvent,
        addPrice: string,
        kind: "size" | "additive",
        hoveredAdd?: { name: string; "add-price": string }
    ) {
        let sizeAddon = 0;
        let additivesForCalc: Array<{ [key: string]: string }> = Array.from(selectedAdditives);

        if (kind === "size") {
            // Use hovered size only; exclude currently selected size
            sizeAddon = Number(addPrice || 0);
        } else {
            // kind === "additive": include selected size + hovered additive (if not already selected)
            sizeAddon = Number(selectedSize) || 0;
            if (hoveredAdd && !selectedAdditives.has(hoveredAdd)) {
                additivesForCalc = [...additivesForCalc, hoveredAdd];
            }
        }

        const {total, discounted} = calculatePrice({
            product: {price: product.price, discountPrice: product.discountPrice},
            size: sizeAddon,
            additives: additivesForCalc
        });
        const isAuthed = Boolean(localStorage.getItem("user"));
        let totalHtml = "";
        if (isAuthed) {
            totalHtml = writePriceWithDiscount(total.toFixed(2), discounted.toFixed(2));
        } else {
            totalHtml = writePriceWithDiscount(total.toFixed(2));
        }

        tooltip.innerHTML = totalHtml
        tooltip.classList.remove("hidden");
        tooltip.style.left = `${e.pageX + 15}px`;
        tooltip.style.top = `${e.pageY + 15}px`;
    }

    function hideTooltip() {
        tooltip.classList.add("hidden");
    }

    // --- Show modal ---
    modal.classList.remove("hidden");

    // --- Close modal logic ---
    function addToCart(id: number): void {
        const raw = localStorage.getItem("selectedItems");
        type CartItem = { id: number; size?: number; additives?: Array<{ name: string; "add-price": string }> };
        let items: CartItem[] = [];
        try {
            const parsed = raw ? JSON.parse(raw) : [];
            items = Array.isArray(parsed) ? parsed : [];
        } catch {
            items = [];
        }

        const entry: CartItem = {
            id,
            size: Number(selectedSize) || 0,
            additives: Array.from(selectedAdditives)
        };

        items.push(entry);
        localStorage.setItem("selectedItems", JSON.stringify(items));
        setShoppingItemCount()

    }

    function handleCloseClick() {
        addToCart(product.id);
        modal.classList.add("hidden");
    }

    closeBtn.removeEventListener("click", handleCloseClick);

    closeBtn.addEventListener("click", handleCloseClick);

    modal.addEventListener("click", (e) => {
        closeBtn.removeEventListener("click", handleCloseClick);
        if (e.target === modal) modal.classList.add("hidden");
    });

    // --- Close on ESC key ---
    function handleEscClose(e: KeyboardEvent) {
        if (e.key === "Escape" || e.key === "Esc") {
            closeBtn?.removeEventListener("click", handleCloseClick);
            modal.classList.add("hidden");
            document.removeEventListener("keydown", handleEscClose);
        }
    }

    // Add listener only once when modal opens
    document.addEventListener("keydown", handleEscClose);

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