// Define the product data structure (matches your JSON)
interface Product {
    name: string;
    description: string;
    price: string | number;
    image: string;
}

/**
 * Loads coffee slider products and sets up interactive navigation.
 */
export async function loadCoffeeSlider(): Promise<void> {
    const sliderContainer = document.getElementById("coffee-slides");
    const dotsContainer = document.getElementById("slider-dots");
    console.log({sliderContainer,dotsContainer});
    if (!sliderContainer || !dotsContainer) {
        console.error("Slider containers not found.");
        return;
    }

    try {
        const res = await fetch("data/products.json");
        if (!res.ok) throw new Error("Failed to load products.json");
        console.log("res", res);

        const products: Product[] = await res.json();

        // Clear existing content
        sliderContainer.innerHTML = "";
        dotsContainer.innerHTML = "";

        // Render slides and dots
        products.forEach((product, index) => {
            // Create slide
            const slide = document.createElement("div");
            slide.classList.add("coffee-card");
            slide.dataset.index = String(index);
            slide.innerHTML = `
        <img src="../assets/images/${product.image}.png" alt="${product.name}" class="coffee-card__img" />
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
        setupSliderNavigation(sliderContainer, dotsContainer, products);
    } catch (err) {
        console.error("Error loading products:", err);
    }
}

/**
 * Sets up navigation, auto-scroll, and event listeners for the slider.
 */
function setupSliderNavigation(
    sliderContainer: HTMLElement,
    dotsContainer: HTMLElement,
    products: Product[]
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
