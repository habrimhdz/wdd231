  const button = document.getElementById("toggleDark");
  const body = document.body;

  if (button) {
    button.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
    });
  }