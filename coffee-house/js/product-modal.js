function showModal(product) {
  const modal = document.getElementById("product-modal");
  const img = modal.querySelector(".modal-image");
  const title = modal.querySelector(".modal-title");
  const desc = modal.querySelector(".modal-description");
  const sizesContainer = modal.querySelector(".sizes");
  const additivesContainer = modal.querySelector(".additives");
  const priceEl = modal.querySelector(".price");
  const closeBtn = modal.querySelector(".close-btn");

  let basePrice = parseFloat(product.price);
  let selectedSize = null;
  let selectedAdditives = new Set();
  console.log({product})


  // Fill static content
  img.src = product.image_url;
  img.alt = product.name;
  title.textContent = product.name;
  desc.textContent = product.description;

  // Render sizes
  sizesContainer.innerHTML = "";
  let firstSizeBtn = null;
  for (const [key, size] of Object.entries(product.sizes)) {
    const btn = document.createElement("button");
    btn.innerHTML = `
    <div class="size-key text-link-button">${key.toUpperCase()}</div>
    <div class="text-link-button">${size.size}</div>
  `;

    btn.addEventListener("click", () => {
      sizesContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = parseFloat(size["add-price"]);
      updateTotal();
    });
    if (!firstSizeBtn) {
      firstSizeBtn = btn;
      firstSizeAddPrice = parseFloat(size["add-price"]);
    }
    sizesContainer.appendChild(btn);
  }
  if (firstSizeBtn) {
    firstSizeBtn.classList.add("active");
    selectedSize = firstSizeAddPrice;
  }
  

  // Render additives
  additivesContainer.innerHTML = "";
  let index=0
  product.additives.forEach(add => {
    const btn = document.createElement("button");
    index++
    btn.innerHTML = `
    <div class="size-key text-link-button">${index}</div>
    <div class="text-link-button">${add.name}</div>
  `;
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      if (selectedAdditives.has(add)) selectedAdditives.delete(add);
      else selectedAdditives.add(add);
      updateTotal();
    });
    additivesContainer.appendChild(btn);
  });

  // Update total price
  function updateTotal() {
    let total = basePrice;
    if (selectedSize) total += selectedSize;
    selectedAdditives.forEach(a => (total += parseFloat(a["add-price"])));
    priceEl.textContent = `$${total.toFixed(2)}`;
  }

  // Show modal
  modal.classList.remove("hidden");

  // Close modal
  closeBtn.onclick = () => modal.classList.add("hidden");
  modal.onclick = e => { if (e.target === modal) modal.classList.add("hidden"); };

  // Initialize default
  updateTotal();
}
