// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js"; // AQUI PUEDE IR LA 9.19.1
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAD00YWnfCKIg_taz8Qsd3S5vKZDhObImE",
  authDomain: "coordenadas-cf28f.firebaseapp.com",
  databaseURL: "https://coordenadas-cf28f-default-rtdb.firebaseio.com",
  projectId: "coordenadas-cf28f",
  storageBucket: "coordenadas-cf28f.appspot.com",
  messagingSenderId: "638534802606",
  appId: "1:638534802606:web:faa80ee102ba93cbe9213f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(); //LE QUITO EL PARAMETRO APP PORQUE SE BASÓ PARA LO DE REGISTRAR USUARIOS
//const auth = getAuth();
auth.languageCode = "es";
const provider = new GoogleAuthProvider();

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(); //EL PROFE NO TIENE EL PARAMETRO APP
let currentUser;
let puntuacion = 0; //La puntuación del jugador
const jugadoresArray = [];
const jugadoresCountRef = ref(db, "jugador");
onValue(jugadoresCountRef, (snapshot) => {
  jugadoresArray.splice(0); // Borra el contenido anterior del array
  const data = snapshot.val();
  Object.entries(data).forEach(([key, value]) => {
    const peaton = {
      id: key,
      nombre: value.nombre,
      imagen: value.imagen,
      email: value.email,
      puntuacion: value.puntos
    };
    jugadoresArray.push(peaton);
  });
  console.log('Peatones obtenidos desde Firebase:', jugadoresArray);

  // Ordenar jugadores por puntuación de mayor a menor
  jugadoresArray.sort((a, b) => b.puntuacion - a.puntuacion);

  actualizarTabla(); // Llama a la función para actualizar la tabla después de obtener los datos
  botones();
});

// Obtener los parámetros de la URL
const params = new URLSearchParams(window.location.search);

// Obtener el valor del parámetro 'usuario'
const usuario = params.get('usuario');

function actualizarTabla() {
  const bodyTabla = document.getElementById('bodyDeMiTabla');

  // Eliminar filas anteriores de la tabla
  while (bodyTabla.firstChild) {
    bodyTabla.removeChild(bodyTabla.firstChild);
  }

  // Crear una fila por cada elemento en el array
  jugadoresArray.forEach((jugador, index) => {
    // Crear una nueva fila
    const fila = document.createElement('tr');

    // Crear celdas y asignar valores
    const numeroCelda = document.createElement('td');
    numeroCelda.textContent = index + 1;

    const nombreCelda = document.createElement('td');
    const nombreDiv = document.createElement('div');

    // Crear imagen del jugador
    const imagenJugador = document.createElement('img');
    imagenJugador.src = jugador.imagen;
    imagenJugador.style.borderRadius = '5px';
    nombreDiv.textContent = jugador.nombre;

    // Establecer estilo "display" del nombreDiv como "block"
    nombreDiv.style.display = 'block';

    // Agregar imagen y nombre al contenedor
    nombreCelda.appendChild(imagenJugador);
    nombreCelda.appendChild(nombreDiv);


    const puntuacionCelda = document.createElement('td');
    puntuacionCelda.textContent = jugador.puntuacion;


    // Aplicar estilo para centrar verticalmente las celdas
    numeroCelda.style.verticalAlign = 'middle';
    nombreCelda.style.verticalAlign = 'middle';
    puntuacionCelda.style.verticalAlign = 'middle';

    // Agregar las celdas a la fila
    fila.appendChild(numeroCelda);
    fila.appendChild(nombreCelda);
    fila.appendChild(puntuacionCelda);

    if (usuario != undefined) {
      if (jugador.id !== usuario) {
        const enviarMensajeCelda = document.createElement('td');
        const enviarMensajeBoton = document.createElement('button');
        enviarMensajeBoton.classList.add('btn', 'btn-orange', 'btn-mandar-mensaje');
        enviarMensajeBoton.innerHTML = '<i class="fas fa-envelope"></i> Enviar mensaje';
        enviarMensajeBoton.value = jugador.id;
        enviarMensajeCelda.appendChild(enviarMensajeBoton);
        enviarMensajeCelda.style.verticalAlign = 'middle';
        fila.appendChild(enviarMensajeCelda);
      } else {
        const enviarMensajeCelda = document.createElement('td');
        const enviarMensajeBoton = document.createElement('button');
        enviarMensajeBoton.classList.add('btn', 'btn-secondary');
        enviarMensajeBoton.disabled = true; // Deshabilitar el botón
        enviarMensajeBoton.innerHTML = '<i class="fas fa-user"></i> Usuario actual';
        enviarMensajeCelda.appendChild(enviarMensajeBoton);
        enviarMensajeCelda.style.verticalAlign = 'middle';
        fila.appendChild(enviarMensajeCelda);
      }
    } else {
      const enviarMensajeCelda = document.createElement('td');
      const enviarMensajeBoton = document.createElement('button');
      enviarMensajeBoton.classList.add('btn', 'btn-secondary', 'btn-no-disponible');
      // enviarMensajeBoton.disabled = true; // Deshabilitar el botón
      enviarMensajeBoton.innerHTML = '<i class="fas fa-envelope"></i> No disponible';
      enviarMensajeCelda.appendChild(enviarMensajeBoton);
      enviarMensajeCelda.style.verticalAlign = 'middle';
      fila.appendChild(enviarMensajeCelda);
    }

    // Agregar la fila al cuerpo de la tabla
    bodyTabla.appendChild(fila);
  });
}

function botones() {
  // Seleccionar el botón "No disponible" utilizando la clase de jQuery
  var buttonNoDisponible = $('.btn-no-disponible');
  var buttonMandarMensaje = $('.btn-mandar-mensaje');

  // Agregar el evento click al botón
  buttonNoDisponible.on('click', mostrarNoDisponible);
  buttonMandarMensaje.on('click', mandamosMensaje);

  function mostrarNoDisponible() {
    console.log('asdasd')
    Swal.fire({
      icon: 'info',
      title: 'No puedes enviar mensajes',
      text: 'Debes jugar para poder contactar a tus amigos',
      // showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: 'Aceptar'
      // denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      // if (result.isConfirmed) {
      //   Swal.fire('Saved!', '', 'success')
      // } else if (result.isDenied) {
      //   Swal.fire('Changes are not saved', '', 'info')
      // }
    })
  }

  function mandamosMensaje() {
    var idAContactar = $(this).val();
    // console.log(idAContactar)

    var nombreCreador = "";
    var imagenCreador = "";
    var emailCreador = "";

    var nombreAContactar = "";
    var imagenAContactar = "";
    var emailAContactar = "";

    jugadoresArray.forEach((jugador, index) => {

      if (jugador.id == usuario) {
        nombreCreador = jugador.nombre;
        imagenCreador = jugador.imagen;
        emailCreador = jugador.email;
      }

      if (jugador.id == idAContactar) {
        nombreAContactar = jugador.nombre;
        imagenAContactar = jugador.imagen;
        emailAContactar = jugador.email;
      }

    });



    // Obtener los datos del formulario y enviarlos a través de una solicitud AJAX
    const formData = new FormData();
    formData.append("idCreador", usuario);
    formData.append("idAContactar", idAContactar);

    formData.append("nombreCreador", nombreCreador);
    formData.append("imagenCreador", imagenCreador);
    formData.append("emailCreador", emailCreador);

    formData.append("nombreAContactar", nombreAContactar);
    formData.append("imagenAContactar", imagenAContactar);
    formData.append("emailAContactar", emailAContactar);


    formData.append("btnCrearChat", "submit");
    $.ajax({
      type: 'POST',
      url: 'controllers/crear-chat.php',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function (result) {
        // alert(result)
        console.log(result)
        // Si la respuesta es verdadera, redirigir al usuario a la página de usuario
        if (result == true) {
          // window.location.href = 'user-page';
          window.location.href = 'mensajes.php';

        } else {
          // Si la respuesta es falsa, mostrar un mensaje de error al usuario
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            text: result,
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
          });
        }
      },
      error: function (error) {
        console.error('Error en la solicitud AJAX:', error);
        // Aquí se puede agregar código para manejar errores de comunicación con el servidor
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo completar la solicitud. Por favor, inténtalo de nuevo más tarde.',
          allowOutsideClick: false
        });
      }
    });

  }
}