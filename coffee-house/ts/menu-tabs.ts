import { fetchProducts } from "./api";
import { renderPrice } from "./helpers";
import { showModal } from "./product-modal";
import type { ProductType } from "./types";

/**
 * Loads menu products, handles tab switching, and renders products.
 */
export async function menuProducts(): Promise<void> {
    const productsContainer = document.getElementById("menu-products");
    const tabs = document.querySelectorAll<HTMLButtonElement>(".tab");
    // Exit early if container is missing
    if (!productsContainer) {
        console.error("#menu-products container not found.");
        return;
    }

    let products: ProductType[] = [];
    const loader = document.getElementById("loader");

    // Load product data
    try {
        loader?.classList.remove("hidden");
        productsContainer.classList.add("hidden");
        const res = await fetchProducts();
        products = res.data
        renderProducts("coffee");
    } catch (error) {
        loader?.classList.add("hidden");
        productsContainer.classList.remove("hidden");
        productsContainer.innerHTML = "Something went wrong. Please, refresh the page...";
        console.error("Error loading products:", error);
    } finally {
        setTimeout(() => loader?.classList.add("hidden"), 300);
        setTimeout(() => productsContainer.classList.remove("hidden"), 300);
    }

    // Tab switching logic
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            const category = tab.dataset.category;
            if (!category) return;

            renderProducts(category);

            // Smooth scroll to the menu grid if present
            const menuGrid = productsContainer.querySelector<HTMLElement>(".menu-grid");
            if (menuGrid) {
                menuGrid.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                });
            }
        });
    });

    /**
     * Renders the products for a given category
     */
    function renderProducts(category: string): void {
        if (productsContainer) {
            productsContainer.innerHTML = "";

        };

        const filtered = products.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
        );

        filtered.forEach((prod) => {
            const card = createProductCard(prod);
            if (productsContainer) {
                productsContainer.appendChild(card);

            };
        });
    }

    /**
     * Creates a reusable product card DOM element
     */
    function createProductCard(product: ProductType): HTMLElement {
        const card = document.createElement("div");
        card.classList.add("product-card");

        const priceHtml = renderPrice(product.price, product.discountPrice);

        card.innerHTML = `
          <img src="assets/images/${product.name}.png" alt="${product.name}">
          <div class="card-body">
            <h3 class="heading-3">${product.name}</h3>
            <p class="text-medium">${product.description}</p>
            ${priceHtml}
          </div>
        `;

        // On click — open product modal
        card.addEventListener("click", () => {
            showModal(product);
        });

        return card;
    }
}

// Run automatically on DOM load
document.addEventListener("DOMContentLoaded", () => {
    void menuProducts();
});
