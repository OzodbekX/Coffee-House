async function injectSocialIcons(containerSelector, icons) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Container ${containerSelector} not found`);
        return;
    }

    for (const icon of icons) {
        try {
            const res = await fetch(icon.path);
            if (!res.ok) throw new Error(`Failed to load ${icon.path}`);
            const svg = await res.text();

            const a = document.createElement("a");
            a.classList.add("social-icon");
            a.href = icon.link || "#";
            a.innerHTML = svg;

            container.appendChild(a);
        } catch (err) {
            console.error(`Error loading ${icon.name}:`, err);
        }
    }
}
