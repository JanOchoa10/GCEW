const toggleSwitch = document.getElementById("togg-1");
const body = document.body;
const tips = document.getElementById("tips");

// Verificar si ya hay una preferencia de modo oscuro guardada en el almacenamiento local
const isDarkMode = localStorage.getItem("darkMode");

// Aplicar la preferencia guardada al cargar la página
if (isDarkMode === "true") {
  body.classList.add("dark-mode");
  body.style.backgroundColor = "#111";
  toggleSwitch.checked = true;
  tips.style.color = "#111";
}

toggleSwitch.addEventListener("change", function () {
  if (this.checked) {
    body.classList.add("dark-mode");
    body.style.backgroundColor = "#111";
    tips.style.color = "#fff";
    localStorage.setItem("darkMode", "true"); // Guardar preferencia de modo oscuro en almacenamiento local
  } else {
    body.classList.remove("dark-mode");
    body.style.backgroundColor = "#7d83f5";
    localStorage.setItem("darkMode", "false"); // Guardar preferencia de modo claro en almacenamiento local
    tips.style.color = "#000";
  }
});

//PARA EL MODAL DE LOS TIPS
// Obtener el modal y el elemento del botón
var modal = document.getElementById("modal");
var mostrarTips = document.getElementById("togg-3");

// Obtener el elemento de cierre del modal
var cerrar = document.getElementsByClassName("close")[0];

// Abrir el modal al hacer clic en el botón
// Obtener el modal y el elemento del botón
var modal = document.getElementById("modal");
var mostrarTips = document.getElementById("togg-3");

// Obtener el elemento de cierre del modal
var cerrar = document.getElementsByClassName("close")[0];

// Abrir el modal al hacer clic en el botón
mostrarTips.addEventListener("click", function () {
  if (mostrarTips.checked) {
    modal.style.display = "block";
  } else {
    modal.style.display = "none";
  }
});

// Cerrar el modal al hacer clic en el elemento de cierre
cerrar.addEventListener("click", function () {
  modal.style.display = "none";
  mostrarTips.checked = false; // Desmarcar el botón
});

// Cerrar el modal al hacer clic fuera del área del modal
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    mostrarTips.checked = false; // Desmarcar el botón
  }
});

function changeResolution(resolution) {
  // Obtener todos los elementos de radio
  var radios = document.getElementsByName("Filter");

  // Recorrer todos los elementos de radio
  for (var i = 0; i < radios.length; i++) {
    var radio = radios[i];

    // Verificar si el radio está seleccionado
    if (radio.checked) {
      // Obtener el span asociado al radio
      var span = radio.nextElementSibling;

      // Obtener el contenedor padre del span
      var div = span.parentNode;

      // Actualizar la clase CSS para resaltar la resolución seleccionada
      div.classList.add("selected");

      // Aquí puedes agregar la lógica adicional necesaria para cambiar la resolución
      // Por ejemplo, puedes guardar la resolución seleccionada en una variable global
      // y utilizarla en otras partes de tu aplicación
      var selectedResolution = resolution;
      console.log("Resolución seleccionada: " + selectedResolution);

      // También puedes llamar a una función específica para realizar la acción correspondiente al cambio de resolución
      // Por ejemplo, si estás construyendo una aplicación de video, puedes llamar a una función para ajustar el tamaño del reproductor de video
      //adjustVideoResolution(selectedResolution);
    } else {
      // Si el radio no está seleccionado, eliminar la clase CSS de resaltado
      var span = radio.nextElementSibling;
      var div = span.parentNode;
      div.classList.remove("selected");
    }
  }
}

