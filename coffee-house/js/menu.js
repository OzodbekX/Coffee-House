
document.addEventListener("DOMContentLoaded", () => {
    fetch("partials/header.html")
        .then(res => res.text())
        .then(data => {
            document.querySelector("#header-placeholder").innerHTML = data;

            // Attach mobile menu toggle logic after header is loaded
            const toggleBtn = document.querySelector(".menu-toggle");


            if (toggleBtn) {
                toggleBtn.addEventListener("click", () => {
                    toggleBtn.classList.toggle("active");
                });
            }
            if (window.location.pathname.endsWith("menu.html")) {
                toggleBtn.classList.add("active");        // make it look active
                toggleBtn.style.pointerEvents = "none";   // make it unclickable
                toggleBtn.style.opacity = "0.6";          // optional visual cue
                toggleBtn.style.cursor = "default";       // disable pointer cursor
            }
        

            const mobileMenuButton = document.querySelector('.mobile-navbar-button');
            const mobileNavbarContainer = document.querySelector('.mobile-navbar-container');

            if (mobileMenuButton) {
                mobileMenuButton.addEventListener('click', () => {
                    mobileMenuButton.classList.toggle('active');
                    if (mobileNavbarContainer) {
                        mobileNavbarContainer.classList.toggle('open');
                    }

                });
            }
        })
        .catch(err => console.error("Error loading header:", err));
});




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
