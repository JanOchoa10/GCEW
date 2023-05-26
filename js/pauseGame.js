// Obtener el botón y el modal por su ID
var button = document.getElementById("button-pause");
var modal = document.getElementById("modal");

// Cuando se hace clic en el botón, mostrar el modal
button.addEventListener("click", function () {
  modal.style.display = "block";
});

// Cuando se hace clic en el botón de cerrar, ocultar el modal
var closeButton = document.getElementsByClassName("close")[0];
closeButton.addEventListener("click", function () {
  modal.style.display = "none";
});

// Cuando se hace clic fuera del modal, también ocultarlo
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

// Obtener el botón de regresar por su ID
var regresarButton = document.getElementById("button-regresar");

// Cuando se hace clic en el botón de regresar, cerrar el modal
regresarButton.addEventListener("click", function () {
  modal.style.display = "none";
});
