//PARA DETECTAR EL MODO OSCURO
document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const isDarkMode = localStorage.getItem("darkMode");

  if (isDarkMode === "true") {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
});

//#7d83f5
