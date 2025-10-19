import { loadCoffeeSlider } from "./slider.js";
import { appDownloadButton } from "./app-buttons.js";
/**
 * Safely loads HTML from a partial file into a container.
 */
async function loadPartial(selector, url) {
    try {
        const res = await fetch(url);
        if (!res.ok)
            throw new Error(`Failed to load ${url}`);
        const data = await res.text();
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = data;
        }
        else {
            console.warn(`Container ${selector} not found`);
        }
    }
    catch (err) {
        console.error(`Error loading partial ${url}:`, err);
    }
}
/**
 * Handles header loading and interactive behaviors.
 */
async function loadHeaderIndex() {
    try {
        const res = await fetch("partials/header.html");
        const data = await res.text();
        const headerContainer = document.querySelector("#header-placeholder");
        if (headerContainer) {
            headerContainer.innerHTML = data;
        }
        // Attach header interaction logic
        const toggleBtn = document.querySelector(".menu-toggle");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                toggleBtn.classList.toggle("active");
            });
        }
        const mobileMenuButton = document.querySelector(".mobile-navbar-button");
        const mobileNavbarContainer = document.querySelector(".mobile-navbar-container");
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener("click", () => {
                mobileMenuButton.classList.toggle("active");
                if (mobileNavbarContainer) {
                    mobileNavbarContainer.classList.toggle("open");
                }
            });
        }
    }
    catch (err) {
        console.error("Error loading header:", err);
    }
}
// Initialize after DOM loads
document.addEventListener("DOMContentLoaded", async () => {
    await loadHeaderIndex();
    // Hero section
    await loadPartial("#banner-placeholder", "partials/banner.html");
    // Coffee slider
    try {
        const res = await fetch("partials/coffee-slider.html");
        if (!res.ok)
            throw new Error("Failed to load coffee-slider.html");
        const data = await res.text();
        const sliderContainer = document.querySelector("#coffee-slider");
        if (sliderContainer)
            sliderContainer.innerHTML = data;
        // Run the coffee slider setup function (assumed to be global)
        await loadCoffeeSlider();
    }
    catch (err) {
        console.error("Error loading coffee slider:", err);
    }
    // About section
    await loadPartial("#about", "partials/about.html");
    // Download App section
    try {
        const res = await fetch("partials/download-app.html");
        if (!res.ok)
            throw new Error("Failed to load download-app.html");
        const data = await res.text();
        const appContainer = document.querySelector("#download-app");
        if (appContainer) {
            appContainer.innerHTML = data;
            await appDownloadButton(); // initialize app buttons after loading
        }
    }
    catch (err) {
        console.error("Error loading app download section:", err);
    }
});
//# sourceMappingURL=include.js.map