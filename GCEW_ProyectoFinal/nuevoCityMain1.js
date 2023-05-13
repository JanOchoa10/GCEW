import * as THREE1 from "./three.module.js";  //Epoca Picapiedra
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";  //Este el nuevo

import { OrbitControls } from "./OrbitControls.js";
import { FBXLoader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js";

import { CircleGeometry } from "../three.module.js";

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

const controls = new OrbitControls(camera, renderer.domElement)
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
const clock = new THREE.Clock();   //Agregamos una constante clock para la variable deltaTime

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

const spongebobGeometry = new THREE.BoxGeometry(2, 2, 1);
const spongebobMaterial = new THREE.MeshPhongMaterial({ color: "yellow" });
const spongebob = new THREE.Mesh(spongebobGeometry, spongebobMaterial);
spongebob.position.set(-10, 0, 0);
spongebob.castShadow = true;

const spongebobBB = new THREE.Box3();
console.log(spongebobBB);
spongebobBB.setFromObject(spongebob);

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

document.addEventListener("keydown", function (e) {
  // console.log(e)
  switch (e.keyCode) {
    case 65:
    case 37:
      spongebob.position.x -= 1;
      break;
    case 68:
    case 39:
      spongebob.position.x += 1;
      break;
    case 87:
    case 38:
      spongebob.position.y += 1;
      break;
    case 83:
    case 40:
      spongebob.position.y -= 1;
      break;
  }
});

cityScene.add(
  //terrainPlane,
  spongebob,
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
    fbx= loadedfbx;
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
  if (spongebobBB.intersectsBox(modelBB)) {
    // Acciones a realizar en caso de colisión
    console.log("Colisión detectada");
    fbx.position.x += 1;
    modelBB.min.x += 1; // Ejemplo: incrementar los límites mínimos en el eje x en 1 unidad
    modelBB.max.x += 1; // Ejemplo: incrementar los límites máximos en el eje x en 1 unidad
  }
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
  
  spongebobBB
    .copy(spongebob.geometry.boundingBox)
    .applyMatrix4(spongebob.matrixWorld);
  checkCollisions();
  
  for (let i = 0; i < animationMixer.length; i++) {
    animationMixer[i].update(deltaTime);
  }
  
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
