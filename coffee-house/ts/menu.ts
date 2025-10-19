import {menuProducts} from "./menu-tabs"
/**
 * Initializes the header and its interactive elements.
 */
async function loadHeaderMenu(): Promise<void> {
  try {
    const res = await fetch("partials/header.html");
    if (!res.ok) throw new Error("Failed to load header.html");

    const html = await res.text();
    const headerPlaceholder = document.querySelector<HTMLElement>("#header-placeholder");
    if (headerPlaceholder) headerPlaceholder.innerHTML = html;

    const toggleBtn = document.querySelector<HTMLButtonElement>(".menu-toggle");
    const mobileMenuButton = document.querySelector<HTMLButtonElement>(".mobile-navbar-button");
    const mobileNavbarContainer = document.querySelector<HTMLElement>(".mobile-navbar-container");

    // Handle main menu toggle
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("active");
      });

      // Detect if we are on the menu page and disable the toggle button
      if (window.location.pathname.endsWith("menu.html")) {
        toggleBtn.classList.add("active");
        toggleBtn.style.pointerEvents = "none";
        toggleBtn.style.opacity = "0.6";
        toggleBtn.style.cursor = "default";
      }
    }

    // Handle mobile menu open/close
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener("click", () => {
        mobileMenuButton.classList.toggle("active");
        if (mobileNavbarContainer) {
          mobileNavbarContainer.classList.toggle("open");
        }
      });
    }
  } catch (err) {
    console.error("Error loading header:", err);
  }
}

/**
 * Loads the product-related sections and initializes functionality.
 */
async function loadProductSections(): Promise<void> {
  try {
    // Load catalog grid
    const res = await fetch("partials/menu-products.html");
    if (!res.ok) throw new Error("Failed to load menu-products.html");

    const html = await res.text();
    const grid = document.querySelector<HTMLElement>("#catalog-grid");

    if (grid) {
      grid.innerHTML = html;
      await menuProducts(); // initialize products
    }

    // Load product modal
    const modalRes = await fetch("partials/product-modal.html");
    if (!modalRes.ok) throw new Error("Failed to load product-modal.html");

    const modalHtml = await modalRes.text();
    const modalContainer = document.querySelector<HTMLElement>("#product-modal-placeholder");
    if (modalContainer) modalContainer.innerHTML = modalHtml;

  } catch (err) {
    console.error("Error loading product sections:", err);
  }
}

// Run everything once DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderMenu();
  await loadProductSections();
});
