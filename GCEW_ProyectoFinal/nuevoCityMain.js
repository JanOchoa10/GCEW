import * as THREE1 from "./three.module.js"; //Epoca Picapiedra
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js"; //Este el nuevo

import { OrbitControls } from "./OrbitControls.js";
import { FBXLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js";

import { CircleGeometry } from "../three.module.js";

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

async function login() {
  const res = await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      currentUser = user;
      console.log(user);
      writeUserData(user.uid, { x: 0, z: 0 });
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorMessage);
      // ...
    });
}

const buttonLogin = document.getElementById("button-login");
const buttonLogout = document.getElementById("button-logout");

buttonLogin.addEventListener("click", async () => {
  const user = await login();
});

buttonLogout.addEventListener("click", async () => {
  const auth = getAuth(); //ESTA LINEA NO LA COPIO EL PROFE
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      alert("Sign-out successful.");
      console.log("Sign-out successful.");
    })
    .catch((error) => {
      // An error happened.
      alert("An error happened");
      console.log("An error happened");
    });
});

//creamos la escena
const cityScene = new THREE.Scene();
cityScene.background = new THREE.Color("#8E3CB8");

//creamos la camara
const fov = 70;
const aspect = 1920 / 1080;
const near = 1.0;
const far = 1000.0;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(25, 10, 25);
// const camera = new THREE.PerspectiveCamera(
//   60,
//   window.innerWidth / window.innerHeight
// );
//camera.position.set(0, 0, 20);   ELIUD

const terrainTextureLoader = new THREE.TextureLoader();
const terrainTexture = terrainTextureLoader.load("../images/concrete.jpg");
const terrainPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(400, 400, 10, 10),
  new THREE.MeshStandardMaterial({
    map: terrainTexture, //la textura del concreto
    side: THREE.DoubleSide,
    color: 0x2f2f2f, //cambio de color del plano
  })
);
terrainPlane.castShadow = false;
terrainPlane.receiveShadow = true;
terrainPlane.rotation.x = -Math.PI / 2;
cityScene.add(terrainPlane);

// Creamos el renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
/*controls.enableDamping = true
controls.target.set(0, 1, 0)*/

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
// // hemiLight.position.set(0, 20, 0);
// cityScene.add(hemiLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(1, 5, -1);
// directionalLight.castShadow = true;             ELIUD

//creamos una luz direccional
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-100, 100, 100);
directionalLight.target.position.set(0, 0, 0);
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.001;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 700.0;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 700.0;
directionalLight.shadow.camera.left = 300;
directionalLight.shadow.camera.right = -300;
directionalLight.shadow.camera.top = 300;
directionalLight.shadow.camera.bottom = -300;
cityScene.add(directionalLight);

//creamos una luz ambiental
const ambientLight = new THREE.AmbientLight(0x947cfd, 1.0); //Color de la luz e Intensidad
cityScene.add(ambientLight);

//creamos el mixer para la animacion
let animationMixer = [];
//let previosRAF = null;
const clock = new THREE.Clock(); //Agregamos una constante clock para la variable deltaTime

//loadAnimatedModel(); por el momento no utilizar
/*
loadAnimatedModelAndPlay(
  "../resources/people/",
  "Character1.fbx",
  "Character1.fbx",
  new THREE.Vector3(-57, 0, 0)
);
loadAnimatedModelAndPlay(
  "../resources/people/",
  "Character2_P.fbx",
  "Character2_P.fbx",
  new THREE.Vector3(-90, 0, -150)
);
loadAnimatedModelAndPlay(
  "../resources/people/",
  "Character4_P.fbx",
  "Character4_P.fbx",
  new THREE.Vector3(-65, 0, 170)
);*/

//_RAF(previosRAF, renderer, cityScene, camera);

//Esto tiene que ver con el multijugador
const starCountRef = ref(db, "jugador"); //EL PROFE NO LE DEJÓ EL SLASH
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  //updateStarCount(postElement, data);   EL PROFE ELIMINÓ ESTO
  //console.log(data);
  Object.entries(data).forEach(([key, value]) => {
    //console.log(`${key} ${value}`);
    //console.log(key);
    //console.log(value);
    const jugador = cityScene.getObjectByName(key);
    if (!jugador) {
      const loader = new FBXLoader();
      loader.setPath("../resources/taxi/");
      loader.load("taximodel.fbx", (fbx) => {
        fbx.scale.setScalar(0.1);
        fbx.rotateY(Math.PI); // Rotar el objeto 180 grados alrededor del eje Y
        fbx.traverse((c) => {
          c.castShadow = true;
        });
        fbx.position.set(value.x, 0, value.z);
        //fbx.material.color = new THREE.Color(Math.random() * 0xffffff);
        fbx.name = key;
        cityScene.add(fbx);

        const animLoader = new FBXLoader();
        animLoader.setPath("../resources/taxi/");
        animLoader.load("walkTaxi.fbx", (anim) => {
          const mixer = new THREE.AnimationMixer(fbx);
          animationMixer.push(mixer);
          const idleAction = mixer.clipAction(anim.animations[0]);
          idleAction.play();
        });

        // Crear la caja de colisión para el modelo animado
        modelBB = new THREE.Box3().setFromObject(fbx);
      });
    }

    cityScene.getObjectByName(key).position.x = value.x;
    cityScene.getObjectByName(key).position.z = value.z;

    //     // Update the user info div with the user ID and position
    //     if (key == currentUser.uid) {
    //       userInfoDiv.innerText = `User ID: ${key}\nPosition: (${value.x}, ${value.z})`;
    //     }
  });
});

function writeUserData(userId, position) {
  //const db = getDatabase();
  set(ref(db, "jugador/" + userId), {
    x: position.x,
    z: position.z,
  });
}

// // Crea una instancia del cargador FBX para cargar el taxi
// var taxiLoader = new THREE.FBXLoader();

// // Carga el archivo FBX
// taxiLoader.load(
//     'taximodel.fbx',
//     function ( object ) {
//         // Añade el objeto cargado a la escena
//         scene.add( object );
//     },
//     function ( xhr ) {
//         // Función de progreso de carga
//         console.log( ( xhr.loaded / xhr.total * 100 ) + '% cargado' );
//     },
//     function ( error ) {
//         // Función de error de carga
//         console.error( error );
//     }
// );

// const spongebobGeometry = new THREE.BoxGeometry(2, 2, 1);
// const spongebobMaterial = new THREE.MeshPhongMaterial({ color: "yellow" });
// const spongebob = new THREE.Mesh(spongebobGeometry, spongebobMaterial);
// spongebob.position.set(-10, 0, 0);
// spongebob.castShadow = true;

// const spongebobBB = new THREE.Box3();
// console.log(spongebobBB);
// spongebobBB.setFromObject(spongebob);

const patrickGeometry = new THREE.SphereGeometry(1.5);
const patrickMaterial = new THREE.MeshPhongMaterial({ color: "pink" });
const patrick = new THREE.Mesh(patrickGeometry, patrickMaterial);
patrick.position.set(-5, 0.3, 0);

const patrickBB = new THREE.Sphere(patrick.position, 1);

const squidwardGeometry = new THREE.CylinderGeometry(0.7, 0.7, 3.25, 16);
const squidwardMaterial = new THREE.MeshPhongMaterial({ color: "gray" });
const squidward = new THREE.Mesh(squidwardGeometry, squidwardMaterial);
squidward.position.set(0, 0.5, 0);

const squidwardBB = new THREE.Box3();
squidwardBB.setFromObject(squidward);

const mrKrabsGeometry = new THREE.ConeGeometry(2, 2.75, 32);
const mrKrabsMaterial = new THREE.MeshPhongMaterial({ color: "red" });
const mrKrabs = new THREE.Mesh(mrKrabsGeometry, mrKrabsMaterial);
mrKrabs.position.set(6, 0.2, 0);

const mrKrabsBB = new THREE.Box3();
console.log(mrKrabsBB);
mrKrabsBB.setFromObject(mrKrabs);

const planktonGeometry = new THREE1.CapsuleGeometry(0.1, 0.5, 4, 8);
const planktonMaterial = new THREE1.MeshPhongMaterial({ color: "green" });
const plankton = new THREE1.Mesh(planktonGeometry, planktonMaterial);
plankton.position.set(-15, -0.5, 0);

const planktonBB = new THREE1.Box3();
console.log(planktonBB);
planktonBB.setFromObject(plankton);

const sandyGeometry = new THREE1.CapsuleGeometry(0.75, 1, 4, 8);
const sandyMaterial = new THREE1.MeshPhongMaterial({
  color: "white",
  transparent: true,
});
const sandy = new THREE1.Mesh(sandyGeometry, sandyMaterial);
sandy.position.set(12, 0, 0);

const sandyBB = new THREE1.Box3();
console.log(sandyBB);
sandyBB.setFromObject(sandy);

// document.addEventListener("keydown", function (e) {
//   // console.log(e)
//   switch (e.keyCode) {
//     case 65:
//     case 37:
//       spongebob.position.x -= 1;
//       break;
//     case 68:
//     case 39:
//       spongebob.position.x += 1;
//       break;
//     case 87:
//     case 38:
//       spongebob.position.y += 1;
//       break;
//     case 83:
//     case 40:
//       spongebob.position.y -= 1;
//       break;
//   }
// });



//Movimiento WASD
// let wPresionada = false;  // Variable que indica si la tecla W está siendo presionada
// let aPresionada = false;  // Variable que indica si la tecla A está siendo presionada
// let dPresionada = false;  // Variable que indica si la tecla D está siendo presionada

// document.onkeydown = function (e) {
//   if (!currentUser) {
//     return;
//   }
  
//   const jugadorActual = cityScene.getObjectByName(currentUser.uid);

//   if (e.keyCode == 37) {
//     aPresionada = true;
//   }

//   if (e.keyCode == 39) {
//     dPresionada = true;
//   }

//   if (e.keyCode == 87) {
//     wPresionada = true;
//   }

//   writeUserData(currentUser.uid, jugadorActual.position);
// };

// document.onkeyup = function (e) {
//   if (!currentUser) {
//     return;
//   }
//   const jugadorActual = cityScene.getObjectByName(currentUser.uid);

//   if (e.keyCode == 37) {
//     aPresionada = false;
//   }

//   if (e.keyCode == 39) {
//     dPresionada = false;
//   }

//   if (e.keyCode == 87) {
//     wPresionada = false;
//   }

//   writeUserData(currentUser.uid, jugadorActual.position);
// };

// function actualizarJugador() {
//   if (!currentUser) {
//     return;
//   }
//   const jugadorActual = cityScene.getObjectByName(currentUser.uid);

//   const rotationAngle = Math.PI / 2; // Ángulo de rotación en radianes
//   const moveDistance = 0.1; // Distancia de movimiento

//   if (wPresionada) {
//     const angle = jugadorActual.rotation.y;
//     jugadorActual.position.x -= Math.sin(angle) * moveDistance;
//     jugadorActual.position.z -= Math.cos(angle) * moveDistance;
//   }

//   if (aPresionada) {
//     jugadorActual.rotation.y -= rotationAngle;
//   }

//   if (dPresionada) {
//     jugadorActual.rotation.y += rotationAngle;
//   }

//   writeUserData(currentUser.uid, jugadorActual.position);
// }

// document.onkeydown = function (e) {
//   const jugadorActual = cityScene.getObjectByName(currentUser.uid);

//   const rotationAngle = Math.PI / 2; // Ángulo de rotación en radianes
//   const moveDistance = 0.1; // Distancia de movimiento

//   if (e.keyCode === 65) {
//     // Tecla A - Girar 90 grados en sentido contrario a las agujas del reloj
//     jugadorActual.rotation.y -= rotationAngle;
//   }

//   if (e.keyCode === 68) {
//     // Tecla D - Girar 90 grados en sentido de las agujas del reloj
//     jugadorActual.rotation.y += rotationAngle;
//   }

//   if (e.keyCode === 87) {
//     // Tecla W - Avanzar hacia adelante
//     const angle = jugadorActual.rotation.y;
//     jugadorActual.position.x -= Math.sin(angle) * moveDistance;
//     jugadorActual.position.z -= Math.cos(angle) * moveDistance;
//   }

//   if (e.keyCode === 83) {
//     // Tecla S - Retroceder hacia atrás
//     const angle = jugadorActual.rotation.y;
//     jugadorActual.position.x += Math.sin(angle) * moveDistance;
//     jugadorActual.position.z += Math.cos(angle) * moveDistance;
//   }

//   writeUserData(currentUser.uid, jugadorActual.position);
// };

//En caso de flechas
document.onkeydown = function (e) {
  const jugadorActual = cityScene.getObjectByName(currentUser.uid);

  if (e.keyCode == 37) { //flecha izq
    jugadorActual.position.x -= 1;
  }

  if (e.keyCode == 39) { //flecha derecha
    jugadorActual.position.x += 1;
  }

  if (e.keyCode == 38) { //flecha arriba
    jugadorActual.position.z -= 1;
  }

  if (e.keyCode == 40) { //flecha abajo
    jugadorActual.position.z += 1;
  }

  writeUserData(currentUser.uid, jugadorActual.position);

};

cityScene.add(
  //terrainPlane,
  //spongebob,
  patrick,
  squidward,
  mrKrabs,
  plankton,
  sandy
  //hemiLight,
  //directionalLight
);

// Resize Handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

let modelBB = new THREE1.Box3();
let fbx;

function loadAnimatedModelAndPlay() {
  const loader = new FBXLoader();
  loader.setPath("../resources/people/");
  loader.load("Character1.fbx", (loadedfbx) => {
    fbx = loadedfbx;
    fbx.scale.setScalar(0.1);
    fbx.traverse((c) => {
      c.castShadow = true;
    });
    fbx.position.copy(new THREE.Vector3(-57, 0, 0));

    // Crear la caja de colisión para el modelo animado
    modelBB = new THREE.Box3().setFromObject(fbx);

    const animLoader = new FBXLoader();
    animLoader.setPath("../resources/people/");
    animLoader.load("Character1.fbx", (anim) => {
      const mixer = new THREE.AnimationMixer(fbx);
      animationMixer.push(mixer);
      const idleAction = mixer.clipAction(anim.animations[0]);
      idleAction.play();
    });

    cityScene.add(fbx);

    checkCollisions();
  });
}

// Llamar a la función para cargar el modelo animado
loadAnimatedModelAndPlay();

function checkCollisions() {
  // if (spongebobBB.intersectsBox(modelBB)) {
  //   // Acciones a realizar en caso de colisión
  //   console.log("Colisión detectada");
  //   fbx.position.x += 1;
  //   modelBB.min.x += 1; // Ejemplo: incrementar los límites mínimos en el eje x en 1 unidad
  //   modelBB.max.x += 1; // Ejemplo: incrementar los límites máximos en el eje x en 1 unidad
  // }
}

//const cameraControl = new OrbitControls(camera, renderer.domElement);

/*function checkCollisions() {
  if (spongebobBB.intersectsSphere(patrickBB)) {
    patrick.material.wireframe = true;
  } else {
    patrick.material.wireframe = false;
  }
  if (spongebobBB.containsBox(mrKrabsBB)) {
    mrKrabs.scale.y = 2;
  } else {
    mrKrabs.scale.y = 1;
  }
  if (spongebobBB.intersectsBox(mrKrabsBB)) {
    mrKrabs.material.color = new THREE.Color("orange");
  } else {
    mrKrabs.material.color = new THREE.Color("red");
  }

  if (spongebobBB.intersectsBox(squidwardBB)) {
    squidward.position.set(0, 0.5, -2);
  } else {
    squidward.position.set(0, 0.5, 0);
  }

  if (spongebobBB.intersectsBox(modelBB)) {
    // Establecer la posición deseada del modelo animado cuando hay colisión
    fbx.position.set(0, 0.6, 0);
  }

  const sandyIntersection = spongebobBB.intersect(sandyBB);
  if (!sandyIntersection.isEmpty()) {
    sandy.material.opacity = 0.5;
  } else {
    sandy.material.opacity = 1;
  }
}*/

/*function animate() {
  spongebobBB
    .copy(spongebob.geometry.boundingBox)
    .applyMatrix4(spongebob.matrixWorld);
  checkCollisions();
  renderer.render(cityScene, camera);
  requestAnimationFrame(animate);
}

animate();*/
//raf();

/*loadAnimatedModelAndPlay(
  "../resources/people/",
  "Character1.fbx",
  "Character1.fbx",
  new THREE.Vector3(-57, 0, 0)
);*/
//function loadAnimatedModelAndPlay(path, modelFile, animFile, offset)

/*function _RAF(previousRAF, threejs, scene, camera) {
  requestAnimationFrame((t) => {
    if (previousRAF === null) {
      previousRAF = t;
    }

    _RAF(previousRAF, threejs, scene, camera);

    threejs.render(scene, camera);
    _Step(t - previousRAF);
    previousRAF = t;
  });
}*/

/*function _Step(timeElapsed) {
  const timeElapsedS = timeElapsed * 0.001;
  if (mixers) {
    mixers.map((m) => m.update(timeElapsedS));
  }

  if (controls) {
    controls.Update(timeElapsedS);
  }
}*/

function animate() {
  const deltaTime = clock.getDelta();

  // spongebobBB
  //   .copy(spongebob.geometry.boundingBox)
  //   .applyMatrix4(spongebob.matrixWorld);
  checkCollisions();

  for (let i = 0; i < animationMixer.length; i++) {
    animationMixer[i].update(deltaTime);
  }
  //actualizarJugador();
  renderer.render(cityScene, camera);
  requestAnimationFrame(animate);
}

animate();

// function raf() {
//   requestAnimationFrame((t) => {
//     if (previosRAF === null) {
//       previosRAF = t;
//     }

//     raf();

//     renderer.render(cityScene, camera);
//     step(t - previosRAF);
//     previosRAF = t;
//   });
// }

// function step(timeElapsed) {
//   const timeElapsedS = timeElapsed * 0.001;
//   if (animationMixer) {
//     animationMixer.map((m) => m.update(timeElapsedS));
//   }

//   //   if (this._controls) {
//   //     this._controls.Update(timeElapsedS);
//   //   }

//   //this._thirdPersonCamera.Update(timeElapsedS);
// }

// class ThirdPersonCamera {
//   constructor(params) {
//     this._params = params;
//     this._camera = params.camera;

//     this._currentPosition = new THREE.Vector3();
//     this._currentLookat = new THREE.Vector3();
//   }

//   _CalculateIdealOffset() {
//     const idealOffset = new THREE.Vector3(0, 90, -5);
//     //idealOffset.applyQuaternion(this._params.target.Rotation);
//     idealOffset.add(this._params.target.Position);
//     return idealOffset;
//   }

//   _CalculateIdealLookat() {
//     const idealLookat = new THREE.Vector3(0, 0, 0);
//     idealLookat.applyQuaternion(this._params.target.Rotation);
//     idealLookat.add(this._params.target.Position);
//     return idealLookat;
//   }

//   Update(timeElapsed) {
//     const idealOffset = this._CalculateIdealOffset();
//     const idealLookat = this._CalculateIdealLookat();

//     // const t = 0.05;
//     // const t = 4.0 * timeElapsed;
//     const t = 1.0 - Math.pow(0.001, timeElapsed);

//     this._currentPosition.lerp(idealOffset, t);
//     this._currentLookat.lerp(idealLookat, t);

//     this._camera.position.copy(this._currentPosition);
//     this._camera.lookAt(this._currentLookat);
//   }
// }
