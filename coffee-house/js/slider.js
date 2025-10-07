async function loadCoffeeSlider() {
    const sliderContainer = document.getElementById("coffee-slides");
    if (!sliderContainer) return;

    try {
        const res = await fetch("data/products.json");
        const products = await res.json();

        products.forEach((product) => {
            const slide = document.createElement("div");
            slide.classList.add("coffee-card");
            slide.innerHTML = `
        <img src="../assets/images/${product.image}.png" alt="${product.name}" class="coffee-card__img" />
        <div class="coffee-card__info">
          <h3 class="heading-3">${product.name}</h3>
          <p class="text-medium">${product.description}</p>
          <span class="coffee-card__price">$${Number(product.price).toFixed(2)}</span>
        </div>
      `;
            sliderContainer.appendChild(slide);
        });

        // Simple next/prev scrolling
        const nextBtn = document.querySelector(".slider-btn.next");
        const prevBtn = document.querySelector(".slider-btn.prev");

        const slideWidth = sliderContainer.querySelector(".coffee-card").offsetWidth + 16; // 16 = gap

        nextBtn.addEventListener("click", () => {
            sliderContainer.scrollBy({ left: slideWidth, behavior: "smooth" });
        });

        prevBtn.addEventListener("click", () => {
            sliderContainer.scrollBy({ left: -slideWidth, behavior: "smooth" });
        });
    } catch (err) {
        console.error("Error loading products:", err);
    }
}

// Load slider
loadCoffeeSlider();
