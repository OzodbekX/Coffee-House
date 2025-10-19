/**
 * Displays the product details modal and handles interactive selections.
 */
export function showModal(product) {
    const modal = document.getElementById("product-modal");
    if (!modal) {
        console.error("#product-modal not found");
        return;
    }
    const img = modal.querySelector(".modal-image");
    const title = modal.querySelector(".modal-title");
    const desc = modal.querySelector(".modal-description");
    const sizesContainer = modal.querySelector(".sizes");
    const additivesContainer = modal.querySelector(".additives");
    const priceEl = modal.querySelector(".price");
    const closeBtn = modal.querySelector(".close-btn");
    if (!img || !title || !desc || !sizesContainer || !additivesContainer || !priceEl || !closeBtn) {
        console.error("Modal elements missing. Please check modal structure.");
        return;
    }
    // --- Base state ---
    const basePrice = parseFloat(product.price);
    let selectedSize = 0;
    const selectedAdditives = new Set();
    let firstSizeAddPrice = 0;
    // --- Fill static content ---
    img.src = product.image_url;
    img.alt = product.name;
    title.textContent = product.name;
    desc.textContent = product.description;
    // --- Render sizes ---
    sizesContainer.innerHTML = "";
    let firstSizeBtn = null;
    for (const [key, size] of Object.entries(product.sizes)) {
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
    for (const add of product.additives) {
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
            }
            else {
                selectedAdditives.add(add);
            }
            updateTotal();
        });
        additivesContainer.appendChild(btn);
    }
    // --- Update total price ---
    function updateTotal() {
        let total = basePrice;
        if (selectedSize)
            total += selectedSize;
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
        if (e.target === modal)
            modal.classList.add("hidden");
    });
    // Initialize default total
    updateTotal();
}
//# sourceMappingURL=product-modal.js.map