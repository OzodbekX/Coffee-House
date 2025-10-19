import { injectSocialIcons } from "./footer";
// Helper function to safely fetch and insert HTML into a container


async function loadHTML(selector: string, url: string): Promise<void> {
  try {
    const res = await fetch(url);
    const data = await res.text();
    const container = document.querySelector<HTMLElement>(selector);
    if (container) container.innerHTML = data;
  } catch (err) {
    console.error(`Error loading ${url}:`, err);
  }
}

// Helper function to handle mobile menu toggle
function setupMobileMenuToggle(): void {
  const toggleBtn = document.querySelector<HTMLButtonElement>(".menu-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      toggleBtn.classList.toggle("active");
    });
  }

  const mobileMenuButton = document.querySelector<HTMLButtonElement>(".mobile-navbar-button");
  const mobileNavbarContainer = document.querySelector<HTMLElement>(".mobile-navbar-container");

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenuButton.classList.toggle("active");
      if (mobileNavbarContainer) {
        mobileNavbarContainer.classList.toggle("open");
      }
    });
  }
}

// Load header and attach behavior
document.addEventListener("DOMContentLoaded", async () => {
  await loadHTML("#header-placeholder", "partials/header.html");
  setupMobileMenuToggle();
});

// Load mobile navbar
(async () => {
  try {
    const res = await fetch("partials/mobile-navbar.html");
    const data = await res.text();
    const navbarContainer = document.querySelector<HTMLElement>("#mobile-navbar-placeholder");
    if (navbarContainer) navbarContainer.innerHTML = data;

    const mobileMenuButtons = document.querySelectorAll<HTMLButtonElement>(".mobile-menu-buttons");
    mobileMenuButtons.forEach((mobileMenuButton) => {
      mobileMenuButton.addEventListener("click", () => {
        mobileMenuButton.classList.toggle("active");

        const openButton = document.querySelector<HTMLButtonElement>(".mobile-navbar-button");
        if (openButton) openButton.classList.remove("active");

        const mobileNavbarContainer = document.querySelector<HTMLElement>(".mobile-navbar-container");
        if (mobileNavbarContainer) mobileNavbarContainer.classList.remove("open");
      });
    });
  } catch (err) {
    console.error("Error loading mobile navbar:", err);
  }
})();

// Load footer and inject social icons (assuming injectSocialIcons exists globally)
(async () => {
  try {
    const res = await fetch("partials/contacts.html");
    const data = await res.text();
    const contactsContainer = document.querySelector<HTMLElement>("#contacts");
    if (contactsContainer) {
      contactsContainer.innerHTML = data;
      // Assuming injectSocialIcons is a globally defined async function
      if (typeof injectSocialIcons === "function") {
        await injectSocialIcons(".social-icons");
      }
    }
  } catch (err) {
    console.error("Error loading footer:", err);
  }
})();
