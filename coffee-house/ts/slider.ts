import { fetchFavoriteProducts } from "./api";
import type { SliderProduct } from "./types";

/**
 * Loads coffee slider products and sets up interactive navigation.
 */
export async function loadCoffeeSlider(): Promise<void> {
    const loader = document.getElementById("loader");
    const sliderContainer = document.getElementById("coffee-slides");
    const dotsContainer = document.getElementById("slider-dots");
    const coffeeSliderContainer = document.getElementById("coffee-slider");
    const prevBtn = document.getElementById("left-slider-button");
    const nextBtn = document.getElementById("right-slider-button");

    if (!sliderContainer || !dotsContainer) {
        console.log("Slider containers not found.");
        return;
    }
    // Show loader before starting
    loader?.classList.remove("hidden");
    coffeeSliderContainer?.classList.add("hidden")
    dotsContainer?.classList.add("hidden")
    prevBtn?.classList.add("hidden");
    nextBtn?.classList.add("hidden");

    try {
        const products = await fetchFavoriteProducts();

        // Clear existing content
        sliderContainer.innerHTML = "";
        dotsContainer.innerHTML = "";

        // Render slides and dots
        products.data.forEach((product, index) => {
            // Create slide
            const slide = document.createElement("div");
            slide.classList.add("coffee-card");
            slide.dataset.index = String(index);
            slide.innerHTML = `
        <img src="../assets/images/${product.name}.png" alt="${product.name}" class="coffee-card__img" />
        <div class="coffee-card__info">
          <h3 class="heading-3">${product.name}</h3>
          <p class="text-medium">${product.description}</p>
          <span class="heading-3">$${Number(product.price).toFixed(2)}</span>
        </div>
      `;
            sliderContainer.appendChild(slide);

            // Create dot
            const dot = document.createElement("div");
            dot.classList.add("slider-dot");
            if (index === 0) dot.classList.add("active");
            dot.dataset.index = String(index);
            dotsContainer.appendChild(dot);
        });

        // Initialize navigation
        setupSliderNavigation(sliderContainer, dotsContainer, products.data);
    } catch (err) {
        loader?.classList.add("hidden");
        sliderContainer.innerHTML = "";
        const errorMsg = document.createElement("p");
        errorMsg.classList.add("error-message")
        errorMsg.className = "error-message";
        errorMsg.textContent = "Something went wrong. Please, refresh the page.";
        sliderContainer.appendChild(errorMsg);
        prevBtn?.classList.add("error-message");
        nextBtn?.classList.add("error-message");


    } finally {
        setTimeout(() => loader?.classList.add("hidden"), 300);
        setTimeout(() => coffeeSliderContainer?.classList.remove("hidden"), 300);
        setTimeout(() => dotsContainer?.classList.remove("hidden"), 300);
        setTimeout(() => prevBtn?.classList.remove("hidden"), 300);
        setTimeout(() => nextBtn?.classList.remove("hidden"), 300);

    }
}

/**
 * Sets up navigation, auto-scroll, and event listeners for the slider.
 */
function setupSliderNavigation(
    sliderContainer: HTMLElement,
    dotsContainer: HTMLElement,
    products: SliderProduct[]
): void {
    const nextBtn = document.querySelector<HTMLButtonElement>(".slider-btn.next");
    const prevBtn = document.querySelector<HTMLButtonElement>(".slider-btn.prev");
    const dots = dotsContainer.querySelectorAll<HTMLDivElement>(".slider-dot");

    const firstSlide = sliderContainer.querySelector<HTMLDivElement>(".coffee-card");
    if (!firstSlide) return;

    const slideWidth = firstSlide.offsetWidth + 16; // 16 = gap
    let currentIndex = 0;
    let autoScrollTimeout: number | undefined;
    const AUTO_SCROLL_DELAY = 5000; // 5 seconds
    let remainingTime = AUTO_SCROLL_DELAY;
    let lastStartTime = Date.now();

    // --- Scroll behavior ---
    async function scrollToSlide(index: number): Promise<void> {
        const maxIndex = products.length - 1;

        if (index > maxIndex) index = 0;
        if (index < 0) index = maxIndex;

        sliderContainer.scrollTo({
            left: index * slideWidth,
            behavior: "smooth",
        });

        currentIndex = index;
        updateActiveDot();
    }

    // --- Update active dot ---
    function updateActiveDot(): void {
        const scrollPosition = sliderContainer.scrollLeft;
        const newIndex = Math.round(scrollPosition / slideWidth);
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
        }

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    // --- Auto Scroll ---
    function startAutoScroll(delay = AUTO_SCROLL_DELAY): void {
        clearTimeout(autoScrollTimeout);
        lastStartTime = Date.now();

        autoScrollTimeout = window.setTimeout(() => {
            void scrollToSlide(currentIndex + 1);
            startAutoScroll(AUTO_SCROLL_DELAY);
        }, delay);
    }

    function pauseAutoScroll(): void {
        clearTimeout(autoScrollTimeout);
        const elapsed = Date.now() - lastStartTime;
        remainingTime = Math.max(0, AUTO_SCROLL_DELAY - elapsed);
    }

    function resumeAutoScroll(): void {
        startAutoScroll(remainingTime);
    }

    function restartAutoScroll(): void {
        startAutoScroll(AUTO_SCROLL_DELAY);
    }

    // --- Event listeners ---

    // Button clicks
    nextBtn?.addEventListener("click", () => {
        void scrollToSlide(currentIndex + 1);
        restartAutoScroll();
    });

    prevBtn?.addEventListener("click", () => {
        void scrollToSlide(currentIndex - 1);
        restartAutoScroll();
    });

    // Dot clicks
    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.dataset.index ?? "0", 10);
            void scrollToSlide(index);
            restartAutoScroll();
        });
    });

    // Scroll event updates
    sliderContainer.addEventListener("scroll", updateActiveDot);

    // Pause/resume on hover
    sliderContainer.addEventListener("mouseenter", pauseAutoScroll);
    sliderContainer.addEventListener("mouseleave", resumeAutoScroll);

    // For mobile: pause/resume on touch
    sliderContainer.addEventListener("touchstart", pauseAutoScroll);
    sliderContainer.addEventListener("touchend", resumeAutoScroll);

    // --- Start auto-scroll ---
    startAutoScroll();
}

// --- Initialize when DOM is ready ---
document.addEventListener("DOMContentLoaded", () => {
    void loadCoffeeSlider();
});
