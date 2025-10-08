
async function appDownloadButton(){
    const buttons = document.querySelectorAll(".app-btn");
    console.log("buttons",buttons)
  
    buttons.forEach((btn) => {
      const type = btn.dataset.type;
      let icon = "";
      let iconLight = "";
      let smallText = "";
      let bigText = "";
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
  
      btn.innerHTML = `
        <img src="${icon}" class="dark" alt="${bigText}" />
        <img src="${iconLight}" class="light" alt="${bigText}" />
        <span class="text-caption">${smallText}<br><strong class="text-link-button">${bigText}</strong></span>
      `;
    });
}
appDownloadButton()
// document.addEventListener("DOMContentLoaded", () => {
//     const buttons = document.querySelectorAll(".app-btn");
//     console.log("buttons",buttons)
  
//     buttons.forEach((btn) => {
//       const type = btn.dataset.type;
//       let icon = "";
//       let smallText = "";
//       let bigText = "";
//       if (type === "ios") {
//         icon = "../assets/icons/app-store.svg";
//         smallText = "Available on the";
//         bigText = "App Store";
//       } else if (type === "android") {
//         icon = "../assets/icons/google-play.svg";
//         smallText = "Available on";
//         bigText = "Google Play";
//       } else {
//         console.warn("Unknown app-btn type:", type);
//         return;
//       }
  
//       btn.innerHTML = `
//         <img src="${icon}" alt="${bigText}" />
//         <span>${smallText}<br><strong>${bigText}</strong></span>
//       `;
//     });
//   });
  