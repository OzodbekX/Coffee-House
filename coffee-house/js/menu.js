document.addEventListener("DOMContentLoaded", () => {
    fetch("partials/header.html")
        .then(res => res.text())
        .then(data => {
            document.querySelector("#header-placeholder").innerHTML = data;

            // Attach mobile menu toggle logic after header is loaded
            const toggleBtn = document.querySelector(".menu-toggle");
            const nav = document.querySelector(".nav-links");

            if (toggleBtn) {
                toggleBtn.addEventListener("click", () => {
                    nav.classList.toggle("active");
                });
            }
        })
        .catch(err => console.error("Error loading header:", err));
});
// main-tabs
fetch("partials/menu-products.html")
    .then(res => res.text())
    .then(async data => {
        document.querySelector("#catalog-grid").innerHTML = data;
        await menuProducts()
    });
// Load footer
fetch("partials/contacts.html")
    .then(res => res.text())
    .then(async data => {
        document.querySelector("#contacts").innerHTML = data;
        await injectSocialIcons('.social-icons')
    }).catch(err => console.error("Error loading footer:", err));




// document.addEventListener("DOMContentLoaded", () => {
//     const menuGrid = document.querySelector(".menu-grid");
//     if (!menuGrid) return;
  
//     // Example menu items (you can load from JSON later)
//     const menuItems = [
//       { name: "Espresso", description: "Strong and bold", img: "assets/images/espresso.jpg" },
//       { name: "Cappuccino", description: "Creamy with milk foam", img: "assets/images/cappuccino.jpg" },
//       { name: "Latte", description: "Smooth and mellow", img: "assets/images/latte.jpg" },
//       { name: "Mocha", description: "Rich chocolate blend", img: "assets/images/mocha.jpg" }
//     ];
  
//     // Render menu cards
//     menuItems.forEach(item => {
//       const card = document.createElement("div");
//       card.classList.add("card");
//       card.innerHTML = `
//         <img src="${item.img}" alt="${item.name}">
//         <h3>${item.name}</h3>
//         <p>${item.description}</p>
//       `;
//       menuGrid.appendChild(card);
//     });
//   });
  