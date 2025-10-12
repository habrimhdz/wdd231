export function setupHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navmenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.textContent = hamburger.textContent === "☰" ? "✖" : "☰";
    });
  }
}