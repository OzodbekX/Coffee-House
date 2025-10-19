import { showModal } from "./product-modal";
import { MenuProduct } from "./types";

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

    let products: MenuProduct[] = [];

    // Load product data
    try {
        const res = await fetch("data/menu-products.json");
        if (!res.ok) throw new Error("Failed to load menu-products.json");
        products = await res.json();
        renderProducts("coffee");
    } catch (error) {
        console.error("Error loading products:", error);
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
    function createProductCard(product: MenuProduct): HTMLElement {
        const card = document.createElement("div");
        card.classList.add("product-card");

        const price = typeof product.price === "number"
            ? product.price.toFixed(2)
            : parseFloat(product.price).toFixed(2);

        card.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}">
      <div class="card-body">
        <h3 class="heading-3">${product.name}</h3>
        <p class="text-medium">${product.description}</p>
        <h3 class="price heading-3">$${price}</h3>
      </div>
    `;

        // On click — open product modal
        card.addEventListener("click", () => {
            console.log(`Open modal for ${product.name}`);
            showModal(product);
        });

        return card;
    }
}

// Run automatically on DOM load
document.addEventListener("DOMContentLoaded", () => {
    void menuProducts();
});
