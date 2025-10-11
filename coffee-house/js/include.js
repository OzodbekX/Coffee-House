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

// Load Hero
fetch("partials/banner.html")
    .then(res => res.text())
    .then(data => {
        document.querySelector("#banner-placeholder").innerHTML = data;
    });



// Load Cofee slider
fetch("partials/coffee-slider.html")
    .then(res => res.text())
    .then(async data => {
        document.querySelector("#coffee-slider").innerHTML = data;
        await loadCoffeeSlider();

    });
// Load About
fetch("partials/about.html")
    .then(res => res.text())
    .then(async data => {
        document.querySelector("#about").innerHTML = data;
    });

// Load Contacts
fetch("partials/download-app.html")
    .then(res => res.text())
    .then(async data => {
        document.querySelector("#download-app").innerHTML = data;
        await appDownloadButton()
    });
