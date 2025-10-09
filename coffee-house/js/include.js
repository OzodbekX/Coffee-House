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

// Load Hero
fetch("partials/hero.html")
    .then(res => res.text())
    .then(data => {
        document.querySelector("#hero-placeholder").innerHTML = data;
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
fetch("partials/contacts.html")
    .then(res => res.text())
    .then(async data => {
        document.querySelector("#contacts").innerHTML = data;
        await appDownloadButton()
    });
// Load footer
fetch("partials/footer.html")
    .then(res => res.text())
    .then(async data => {
        document.querySelector("#footer-placeholder").innerHTML = data;
        await injectSocialIcons()
    }).catch(err => console.error("Error loading footer:", err));



