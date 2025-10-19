export async function appDownloadButton(): Promise<void> {
    // Select all elements with the class "app-btn"
    const buttons = document.querySelectorAll<HTMLButtonElement>(".app-btn");

    buttons.forEach((btn) => {
        // Ensure dataset.type exists
        const type = btn.dataset.type as "ios" | "android" | undefined;

        let icon: string;
        let iconLight: string;
        let smallText: string;
        let bigText: string;

        if (type === "ios") {
            icon = "../assets/icons/ios-dark.png";
            iconLight = "../assets/icons/ios-light.png";
            smallText = "Available on the";
            bigText = "App Store";
        } else if (type === "android") {
            icon = "../assets/icons/google-play-dark.png";
            iconLight = "../assets/icons/google-play-light.png";
            smallText = "Available on";
            bigText = "Google Play";
        } else {
            console.warn("Unknown app-btn type:", type);
            return;
        }

        // Assign formatted inner HTML
        btn.innerHTML = `
      <img src="${icon}" class="dark" alt="${bigText}" />
      <img src="${iconLight}" class="light" alt="${bigText}" />
      <span class="text-caption">${smallText}<br>
        <strong class="text-link-button">${bigText}</strong>
      </span>
    `;
    });
}

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    void appDownloadButton();
});
