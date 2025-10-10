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
// product-modal
fetch("partials/product-modal.html")
    .then(res => res.text())
    .then(async data => {
        document.querySelector("#product-modal-placeholder").innerHTML = data;
    });
// Load footer
fetch("partials/contacts.html")
    .then(res => res.text())
    .then(async data => {
        document.querySelector("#contacts").innerHTML = data;
        await injectSocialIcons('.social-icons')
    }).catch(err => console.error("Error loading footer:", err));



