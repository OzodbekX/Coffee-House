async function menuProducts() {
    const productsContainer = document.getElementById("menu-products");
    const tabs = document.querySelectorAll(".tab");

    let products = [];

    // Load product data
    try {
        const res = await fetch("data/menu-products.json");
        products = await res.json();
        renderProducts("coffee");
    } catch (error) {
        console.error("Error loading products:", error);
    }

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const category = tab.dataset.category;
            renderProducts(category);

            // Smooth scroll to product grid
            productsContainer.querySelector(".menu-grid").scrollIntoView({
                behavior: "smooth",
                inline: "center", // makes it scroll horizontally to center the element
                block: "nearest", // prevents vertical scroll
              });

            });
    });

    // Render product cards
    function renderProducts(category) {
        productsContainer.innerHTML = "";
        const filtered = products.filter(p => p.category.toLowerCase() === category);

        filtered.forEach(prod => {
            const card = createProductCard(prod);
            productsContainer.appendChild(card);
        });
    }

    // Reusable product card component
    function createProductCard(product) {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}">
      <div class="card-body">
        <h3 class="heading-3">${product.name}</h3>
        <p class="text-medium">${product.description}</p>
        <h3 class="price heading-3">$${parseFloat(product.price).toFixed(2)}</div>
      </div>
    `;

        // On click — open modal (later implemented)
        card.addEventListener("click", () => {
            console.log(`Open modal for ${product.name}`);
            // showModal(product);
        });

        return card;
    }
}