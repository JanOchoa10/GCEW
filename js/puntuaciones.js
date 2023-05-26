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
      puntuacion: value.puntos
    };
    jugadoresArray.push(peaton);
  });
  console.log('Peatones obtenidos desde Firebase:', jugadoresArray);

   // Ordenar jugadores por puntuación de mayor a menor
   jugadoresArray.sort((a, b) => b.puntuacion - a.puntuacion);

  actualizarTabla(); // Llama a la función para actualizar la tabla después de obtener los datos
});

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
    nombreCelda.textContent = jugador.nombre;

    const puntuacionCelda = document.createElement('td');
    puntuacionCelda.textContent = jugador.puntuacion;

    // Agregar las celdas a la fila
    fila.appendChild(numeroCelda);
    fila.appendChild(nombreCelda);
    fila.appendChild(puntuacionCelda);

    // Agregar la fila al cuerpo de la tabla
    bodyTabla.appendChild(fila);
  });
}
