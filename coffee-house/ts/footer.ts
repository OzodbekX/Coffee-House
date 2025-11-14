interface SocialIcon {
  name: string;
  path: string;
  link: string;
}

export async function injectSocialIcons(containerSelector: string): Promise<void> {
  const container = document.querySelector<HTMLElement>(containerSelector);

  if (!container) {
    console.error(`Container ${containerSelector} not found`);
    return;
  }

  const icons: SocialIcon[] = [
    { name: "twitter", path: "assets/icons/twitter.svg", link: "#" },
    { name: "instagram", path: "assets/icons/instagram.svg", link: "#" },
    { name: "facebook", path: "assets/icons/facebook.svg", link: "#" },
  ];

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
      const error = err instanceof Error ? err.message : String(err);
      console.error(`Error loading ${icon.name}:`, error);
    }
  }
}
