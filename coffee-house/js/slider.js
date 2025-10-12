
async function loadCoffeeSlider() {
    const sliderContainer = document.getElementById("coffee-slides");
    const dotsContainer = document.getElementById("slider-dots");
    
    if (!sliderContainer) return;

    try {
        // In a real app, we would fetch from products.json
        const res = await fetch("data/products.json");
        const products = await res.json();

        // Clear any existing content
        sliderContainer.innerHTML = '';
        dotsContainer.innerHTML = '';

        products.forEach((product, index) => {
            // Create slide
            const slide = document.createElement("div");
            slide.classList.add("coffee-card");
            slide.setAttribute('data-index', index);
            slide.innerHTML = `
                <img src="../assets/images/${product.image}.png"  alt="${product.name}" class="coffee-card__img" />
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
            dot.setAttribute('data-index', index);
            dotsContainer.appendChild(dot);
        });

        // Set up navigation
        setupSliderNavigation();
    } catch (err) {
        console.error("Error loading products:", err);
    }
}
function setupSliderNavigation() {
    const sliderContainer = document.getElementById("coffee-slides");
    const nextBtn = document.querySelector(".slider-btn.next");
    const prevBtn = document.querySelector(".slider-btn.prev");
    const dots = document.querySelectorAll(".slider-dot");
    
    const slideWidth = sliderContainer.querySelector(".coffee-card").offsetWidth + 16; // 16 = gap
    let currentIndex = 0;
    let autoScrollInterval;
    let autoScrollTimeout;
    const AUTO_SCROLL_DELAY = 5000; // 5 seconds
    let remainingTime = AUTO_SCROLL_DELAY;
    let lastStartTime = Date.now();

    // Update active dot
    function updateActiveDot() {
        const scrollPosition = sliderContainer.scrollLeft;
        const newIndex = Math.round(scrollPosition / slideWidth);
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === currentIndex);
            });
        }
    }

    // Scroll to specific slide
    const scrollToSlide = async (index) => {
        const res = await fetch("data/products.json");
        const products = await res.json();
        const maxIndex = products.length - 1;

        if (index > maxIndex) index = 0;
        if (index < 0) index = maxIndex;

        sliderContainer.scrollTo({
            left: index * slideWidth,
            behavior: "smooth",
        });

        currentIndex = index;
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    };

    // Button clicks
    nextBtn.addEventListener("click", () => {
        scrollToSlide(currentIndex + 1);
        restartAutoScroll();
    });

    prevBtn.addEventListener("click", () => {
        scrollToSlide(currentIndex - 1);
        restartAutoScroll();
    });

    // Dot clicks
    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.getAttribute("data-index"));
            scrollToSlide(index);
            restartAutoScroll();
        });
    });

    // Scroll updates
    sliderContainer.addEventListener("scroll", updateActiveDot);

    // --- Auto Scroll Logic ---
    function startAutoScroll(delay = AUTO_SCROLL_DELAY) {
        clearInterval(autoScrollInterval);
        clearTimeout(autoScrollTimeout);
        lastStartTime = Date.now();

        autoScrollTimeout = setTimeout(() => {
            scrollToSlide(currentIndex + 1);
            startAutoScroll(AUTO_SCROLL_DELAY);
        }, delay);
    }

    function pauseAutoScroll() {
        clearTimeout(autoScrollTimeout);
        const elapsed = Date.now() - lastStartTime;
        remainingTime = Math.max(0, AUTO_SCROLL_DELAY - elapsed);
    }

    function resumeAutoScroll() {
        startAutoScroll(remainingTime);
    }

    function restartAutoScroll() {
        startAutoScroll(AUTO_SCROLL_DELAY);
    }

    // --- Pause on hover or touch ---
    sliderContainer.addEventListener("mouseenter", pauseAutoScroll);
    sliderContainer.addEventListener("mouseleave", resumeAutoScroll);

    // For mobile: pause on touch hold
    sliderContainer.addEventListener("touchstart", pauseAutoScroll);
    sliderContainer.addEventListener("touchend", resumeAutoScroll);

    // Start auto scroll
    startAutoScroll();
}


// Load slider when DOM is ready
document.addEventListener('DOMContentLoaded', loadCoffeeSlider);