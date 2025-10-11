
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

// Mobile Navbar
fetch("partials/mobile-navbar.html")
    .then(res => res.text())
    .then(data => {
        document.querySelector("#mobile-navbar-placeholder").innerHTML = data;
        const mobileMenuButtons = document.querySelectorAll('.mobile-menu-buttons');

        if (mobileMenuButtons.length > 0) {
            mobileMenuButtons.forEach((mobileMenuButton) => {
                mobileMenuButton.addEventListener('click', () => {
                    // Toggle 'active' class for the clicked button
                    mobileMenuButton.classList.toggle('active');
                    const openButton = document.querySelector('.mobile-navbar-button');
                    if (openButton) {
                        openButton.classList.remove('active')
                    }

                    // Find the mobile navbar container
                    const mobileNavbarContainer = document.querySelector('.mobile-navbar-container');

                    // If it exists, remove the 'open' class
                    if (mobileNavbarContainer) {
                        mobileNavbarContainer.classList.remove('open');
                    }
                });
            });
        }

    });




    // Load footer
fetch("partials/contacts.html")
.then(res => res.text())
.then(async data => {
    document.querySelector("#contacts").innerHTML = data;
    await injectSocialIcons('.social-icons')
}).catch(err => console.error("Error loading footer:", err));



