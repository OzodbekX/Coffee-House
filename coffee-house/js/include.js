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
    // Load footer
    fetch("partials/footer.html")
    .then(res => res.text())
    .then(data => {
      document.querySelector("#footer-placeholder").innerHTML = data;
    }).catch(err => console.error("Error loading footer:", err));;

  