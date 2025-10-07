// async function loadCoffeeSlider() {
//     const sliderContainer = document.getElementById("coffee-slides");
//     if (!sliderContainer) return;

//     try {
//         const res = await fetch("data/products.json");
//         const products = await res.json();

//         products.forEach((product) => {
//             const slide = document.createElement("div");
//             slide.classList.add("coffee-card");
//             slide.innerHTML = `
//         <img src="../assets/images/${product.image}.png" alt="${product.name}" class="coffee-card__img" />
//         <div class="coffee-card__info">
//           <h3 class="heading-3">${product.name}</h3>
//           <p class="text-medium">${product.description}</p>
//           <span class="coffee-card__price">$${Number(product.price).toFixed(2)}</span>
//         </div>
//       `;
//             sliderContainer.appendChild(slide);
//         });

//         // Simple next/prev scrolling
//         const nextBtn = document.querySelector(".slider-btn.next");
//         const prevBtn = document.querySelector(".slider-btn.prev");

//         const slideWidth = sliderContainer.querySelector(".coffee-card").offsetWidth + 16; // 16 = gap

//         nextBtn.addEventListener("click", () => {
//             sliderContainer.scrollBy({ left: slideWidth, behavior: "smooth" });
//         });

//         prevBtn.addEventListener("click", () => {
//             sliderContainer.scrollBy({ left: -slideWidth, behavior: "smooth" });
//         });
//     } catch (err) {
//         console.error("Error loading products:", err);
//     }
// }

// // Load slider
// loadCoffeeSlider();







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

    // Update active dot based on scroll position
    function updateActiveDot() {
        const scrollPosition = sliderContainer.scrollLeft;
        const newIndex = Math.round(scrollPosition / slideWidth);
        
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });
        }
    }
    

    // Scroll to specific slide
    const scrollToSlide=async(index)=> {
        const res = await fetch("data/products.json");
        const products = await res.json();
        
        const maxIndex = products.length - 1;
        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;
        
        sliderContainer.scrollTo({
            left: index * slideWidth,
            behavior: "smooth"
        });
        
        currentIndex = index;
        
        // Update active dot
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    // Next button click
    nextBtn.addEventListener("click", () => {
        scrollToSlide(currentIndex + 1);
    });

    // Previous button click
    prevBtn.addEventListener("click", () => {
        scrollToSlide(currentIndex - 1);
    });

    // Dot click events
    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.getAttribute('data-index'));
            scrollToSlide(index);
        });
    });

    // Update dots on scroll
    sliderContainer.addEventListener("scroll", updateActiveDot);
}

// Load slider when DOM is ready
document.addEventListener('DOMContentLoaded', loadCoffeeSlider);