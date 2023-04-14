import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpRLFxLUF6YMdOpTKzMWkPkNOk8JVzJAM",
  authDomain: "proyecto-gcw.firebaseapp.com",
  databaseURL: "https://proyecto-gcw-default-rtdb.firebaseio.com",
  projectId: "proyecto-gcw",
  storageBucket: "proyecto-gcw.appspot.com",
  messagingSenderId: "836388542619",
  appId: "1:836388542619:web:af778c42c62043faf9ce3e"
};

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js";   // AQUI PUEDE IR LA 9.19.1
// import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAD00YWnfCKIg_taz8Qsd3S5vKZDhObImE",
//   authDomain: "coordenadas-cf28f.firebaseapp.com",
//   databaseURL: "https://coordenadas-cf28f-default-rtdb.firebaseio.com",
//   projectId: "coordenadas-cf28f",
//   storageBucket: "coordenadas-cf28f.appspot.com",
//   messagingSenderId: "638534802606",
//   appId: "1:638534802606:web:faa80ee102ba93cbe9213f"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();     //LE QUITO EL PARAMETRO APP PORQUE SE BASÓ PARA LO DE REGISTRAR USUARIOS
//const auth = getAuth();
auth.languageCode = "es";
const provider = new GoogleAuthProvider();

// Initialize Realtime Database and get a reference to the service
const db = getDatabase();  //EL PROFE NO TIENE EL PARAMETRO APP
let currentUser;
let self; // declarar una variable self y asignarle el valor de this

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
    }).catch((error) => {
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
  const user = auth.currentUser;
  if (user) {
    // el usuario está autenticado, podemos cerrar la sesión
    signOut(auth).then(() => {
      // Sign-out successful.
      currentUser = undefined;
      alert("Sign-out successful.");
      console.log("Sign-out successful.");
    }).catch((error) => {
      // An error happened.
      alert("An error happened");
      console.log("An error happened");
    });
  } else {
    // el usuario no está autenticado, no hay sesión que cerrar
    console.log('No user currently logged in');
  }
});


//     // Update the user info div with the user ID and position
//     if (key == currentUser.uid) {
//       userInfoDiv.innerText = `User ID: ${key}\nPosition: (${value.x}, ${value.z})`;
//     }

//   });
// });

var misParams;

class BasicCharacterControllerProxy {
  constructor(animations) {
    this._animations = animations;
  }

  get animations() {
    return this._animations;
  }
};


class BasicCharacterController {

  constructor(params) {
    this._Init(params);
  }

  _Init(params) {

    this._params = params;
    this._decceleration = new THREE.Vector3(-0.0004, -0.0001, -3.5);
    this._acceleration = new THREE.Vector3(4, 0.08, 85.0);  //Velocidad Normal, Rotación, Nitro
    this._velocity = new THREE.Vector3(0, 0, 0);
    this._position = new THREE.Vector3();

    this._animations = {};
    this._input = new BasicCharacterControllerInput(params, this);
    this._stateMachine = new CharacterFSM(
      new BasicCharacterControllerProxy(this._animations));

    // this._LoadModels();

  }

  _LoadModels(key, posX, posZ) {
    self = this;
    const loader = new FBXLoader();
    loader.setPath('./resources/taxi/');
    loader.load('taximodel.fbx', (fbx) => {     //pose t
      fbx.name = key;
      fbx.position.set(posX, 0, posZ);
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });

      this._target = fbx;
      this._params.scene.add(this._target);

      this._mixer = new THREE.AnimationMixer(this._target);

      this._manager = new THREE.LoadingManager();
      this._manager.onLoad = () => {
        this._stateMachine.SetState('idle');
      };

      const _OnLoad = (animName, anim) => {
        const clip = anim.animations[0];
        const action = this._mixer.clipAction(clip);

        this._animations[animName] = {
          clip: clip,
          action: action,
        };
      };

      const loader = new FBXLoader(this._manager);
      loader.setPath('./resources/taxi/');
      loader.load('walkTaxi.fbx', (a) => { _OnLoad('walk', a); });
      loader.load('runTaxi.fbx', (a) => { _OnLoad('run', a); });
      loader.load('idleTaxi.fbx', (a) => { _OnLoad('idle', a); });
      loader.load('jumpTaxi.fbx', (a) => { _OnLoad('dance', a); });
    });
  }

  get Position() {
    return this._position;
  }

  set Position(pos) {
    this._position = pos;
    // Actualizar la posición del target aquí, si lo necesitas
    if (this._target) {
      this._target.position.copy(pos);
    }
  }

  get Rotation() {
    if (!this._target) {
      return new THREE.Quaternion();
    }
    return this._target.quaternion;
  }

  Update(timeInSeconds) {
    // console.log(this._position)
    if (!this._stateMachine._currentState) {
      return;
    }

    this._stateMachine.Update(timeInSeconds, this._input);

    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
      velocity.x * this._decceleration.x,
      velocity.y * this._decceleration.y,
      velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
      Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this._target;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = this._acceleration.clone();
    if (this._input._keys.shift) {
      acc.multiplyScalar(2.0);
    }

    if (this._stateMachine._currentState.Name == 'dance') {
      acc.multiplyScalar(0.0);
    }

    if (this._input._keys.forward) {
      velocity.z += acc.z * timeInSeconds;
    }
    if (this._input._keys.backward) {
      velocity.z -= acc.z * timeInSeconds;
    }
    if (this._input._keys.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }
    if (this._input._keys.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * timeInSeconds);
    forward.multiplyScalar(velocity.z * timeInSeconds);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    this._position.copy(controlObject.position);

    if (this._mixer) {
      this._mixer.update(timeInSeconds);
    }
  }
};

// const characterController = new BasicCharacterController(misParams);
// const position = characterController.Position;
const controllers = [];
class BasicCharacterControllerInput {
  constructor(params, controller) {
    this._params = params;
    this._controller = controller;
    this._Init();
  }

  _Init() {

    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };
    // this._characterController = new BasicCharacterController(params);
    // this._position = this._characterController.Position;
    // this._movingForward = true
    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  // document.onkeydown = function(e){
  //   const jugadorActual = scene.getObjectByName(currentUser.uid);
  //   if (e.keycode = 37){
  //     jugadorActual.position.x -= 15;
  //   }
  //   if (e.keycode = 39){
  //     jugadorActual.position.x += 15;
  //   }
  //   if (e.keycode = 38){
  //     jugadorActual.position.z -= 15;
  //   }
  //   if (e.keycode = 40){
  //     jugadorActual.position.z += 15;
  //   }
  //   writeUserData(currentUser.uid, jugadorActual.position);
  // }

  _onKeyDown(event) {
    // try {
    // existing code
    const position = this._controller.Position;
    const jugadorActual = scene.getObjectByName(currentUser.uid);

    scene.traverse(obj => {
      if (obj.name.endsWith("VXPyY82") || obj.name.endsWith("RABi2") || obj.name.endsWith("cUyP2")) {
        console.log(obj.name);
      }
    });



    console.log(jugadorActual)
    jugadorActual.position.x = position.x;
    jugadorActual.position.z = position.z;
    switch (event.keyCode) {
      case 87: // w
        this._keys.forward = true;
        console.log(this._keys.forward)
        position.z += 1;
        console.log("Mi posicion: " + position.x, ",", position.z);
        // console.log("Mi posicion JA: " + jugadorActual.position.x, ",", jugadorActual.position.z);
        break;
      case 65: // a
        this._keys.left = true;
        break;
      case 83: // s
        this._keys.backward = true;
        break;
      case 68: // d
        this._keys.right = true;
        break;
      case 32: // SPACE
        this._keys.space = true;
        break;
      case 16: // SHIFT
        this._keys.shift = true;
        break;
    }
    writeUserData(currentUser.uid, jugadorActual.position);
    // } catch (error) {
    //   // alert("Por favor, inicia sesión");
    //   console.log("Por favor, inicia sesión")
    //   console.error(error);
    // }

  }

  _onKeyUp(event) {
    // try {
    // existing code
    // const position = this._controller.Position;
    // const jugadorActual = scene.getObjectByName(currentUser.uid);

    // jugadorActual.position.x = position.x;
    // jugadorActual.position.z = position.z;
    switch (event.keyCode) {
      case 87: // w
        this._keys.forward = false;
        break;
      case 65: // a
        this._keys.left = false;
        break;
      case 83: // s
        this._keys.backward = false;
        break;
      case 68: // d
        this._keys.right = false;
        break;
      case 32: // SPACE
        this._keys.space = false;
        break;
      case 16: // SHIFT
        this._keys.shift = false;
        break;
    }
    // writeUserData(currentUser.uid, jugadorActual.position);
    // } catch (error) {
    //   console.log("Por favor, inicia sesión")
    //   // console.error(error);
    // }

  }
};


// const _escena = new ThirdPersonCameraDemo();  
// const _Scene = _escena._scene;
const scene = new THREE.Scene();   //PARA INICIAR LA ESCENA Y YA NADAMAS PASARSELA AL CONSTRUCTOR

const starCountRef = ref(db, "jugador");   //EL PROFE NO LE DEJÓ EL SLASH
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  //updateStarCount(postElement, data);   EL PROFE ELIMINÓ ESTO
  //console.log(data);
  Object.entries(data).forEach(([key, value]) => {
    //console.log(`${key} ${value}`);
    //console.log(key);
    //console.log(value);
    const jugador = scene.getObjectByName(key);
    // scene.traverse(obj => {
    //   console.log(obj.name);
    // });
    if (!jugador) {
      //this._LoadModels();

      // const car = new BasicCharacterController();
      // car._LoadModels();

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(value.x, 0, value.z);
      mesh.material.color = new THREE.Color(Math.random() * 0xffffff);
      mesh.name = "cube" + key;
      scene.add(mesh);


      const controller = new BasicCharacterController(misParams);
      controller._LoadModels(key, value.x, value.z);
      // console.log(controller.Position)

      // controller.Position = new THREE.Vector3(0, 0, 0);
      // console.log(controller.Position)

      // const controllerObj = {
      //   key: key,
      //   controller: controller
      // };

      // controllers.push(controllerObj);
      // scene.getObjectByName(key).position.set(value.x, 0, value.z);
    }

    // const jugadorCuboActual = scene.getObjectByName("cube" + currentUser.uid);

    // if (!jugadorCuboActual) {
    //   const geometry = new THREE.BoxGeometry(1, 1, 1);
    //   const material = new THREE.MeshPhongMaterial();
    //   const mesh = new THREE.Mesh(geometry, material);
    //   mesh.position.set(value.x, 0, value.z);
    //   mesh.material.color = new THREE.Color(Math.random() * 0xffffff);
    //   mesh.name = "cube" + currentUser.uid;
    //   scene.add(mesh);
    // }

    scene.getObjectByName("cube" + key).position.set(value.x, 0, value.z);
    // scene.getObjectByName(key).Position = (3,0,3)
    // if (scene.getObjectByName("cube" + key)) {
    //   console.log("Existe: " + "cube" + key)
    // }
    // if (scene.getObjectByName(key)) {
    //   console.log("Existe: " + key)
    // } else {
    // console.log("No existe: ", key)  
    // }
    // scene.getObjectByName(key).position.set(value.x, 0, value.z);

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
    z: position.z
  });
}

class FiniteStateMachine {
  constructor() {
    this._states = {};
    this._currentState = null;
  }

  _AddState(name, type) {
    this._states[name] = type;
  }

  SetState(name) {
    const prevState = this._currentState;

    if (prevState) {
      if (prevState.Name == name) {
        return;
      }
      prevState.Exit();
    }

    const state = new this._states[name](this);

    this._currentState = state;
    state.Enter(prevState);
  }

  Update(timeElapsed, input) {
    if (this._currentState) {
      this._currentState.Update(timeElapsed, input);
    }
  }
};


class CharacterFSM extends FiniteStateMachine {
  constructor(proxy) {
    super();
    this._proxy = proxy;
    this._Init();
  }

  _Init() {
    this._AddState('idle', IdleState);
    this._AddState('walk', WalkState);
    this._AddState('run', RunState);
    this._AddState('dance', DanceState);
  }
};


class State {
  constructor(parent) {
    this._parent = parent;
  }

  Enter() { }
  Exit() { }
  Update() { }
};


class DanceState extends State {
  constructor(parent) {
    super(parent);

    this._FinishedCallback = () => {
      this._Finished();
    }
  }

  get Name() {
    return 'dance';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['dance'].action;
    const mixer = curAction.getMixer();
    mixer.addEventListener('finished', this._FinishedCallback);

    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.reset();
      curAction.setLoop(THREE.LoopOnce, 1);
      curAction.clampWhenFinished = true;
      curAction.crossFadeFrom(prevAction, 0.2, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  _Finished() {
    this._Cleanup();
    this._parent.SetState('idle');
  }

  _Cleanup() {
    const action = this._parent._proxy._animations['dance'].action;

    action.getMixer().removeEventListener('finished', this._CleanupCallback);
  }

  Exit() {
    this._Cleanup();
  }

  Update(_) {
  }
};


class WalkState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'walk';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['walk'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.enabled = true;

      if (prevState.Name == 'run') {
        const ratio = curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input._keys.forward || input._keys.backward) {
      if (input._keys.shift) {
        this._parent.SetState('run');
      }
      return;
    }

    this._parent.SetState('idle');
  }
};


class RunState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'run';
  }

  Enter(prevState) {
    const curAction = this._parent._proxy._animations['run'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;

      curAction.enabled = true;

      if (prevState.Name == 'walk') {
        const ratio = curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input._keys.forward || input._keys.backward) {
      if (!input._keys.shift) {
        this._parent.SetState('walk');
      }
      return;
    }

    this._parent.SetState('idle');
  }
};


class IdleState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'idle';
  }

  Enter(prevState) {
    const idleAction = this._parent._proxy._animations['idle'].action;
    if (prevState) {
      const prevAction = this._parent._proxy._animations[prevState.Name].action;
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.5, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  }

  Exit() {
  }

  Update(_, input) {
    if (input._keys.forward || input._keys.backward) {
      this._parent.SetState('walk');
    } else if (input._keys.space) {
      this._parent.SetState('dance');
    }
  }
};


class ThirdPersonCamera {
  constructor(params) {
    this._params = params;
    this._camera = params.camera;

    this._currentPosition = new THREE.Vector3();
    this._currentLookat = new THREE.Vector3();
  }

  _CalculateIdealOffset() {
    const idealOffset = new THREE.Vector3(0, 90, -5);
    //idealOffset.applyQuaternion(this._params.target.Rotation);
    idealOffset.add(this._params.target.Position);
    return idealOffset;
  }

  _CalculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 0, 0);
    idealLookat.applyQuaternion(this._params.target.Rotation);
    idealLookat.add(this._params.target.Position);
    return idealLookat;
  }

  Update(timeElapsed) {
    const idealOffset = this._CalculateIdealOffset();
    const idealLookat = this._CalculateIdealLookat();

    // const t = 0.05;
    // const t = 4.0 * timeElapsed;
    const t = 1.0 - Math.pow(0.001, timeElapsed);

    this._currentPosition.lerp(idealOffset, t);
    this._currentLookat.lerp(idealLookat, t);

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookat);
  }
}


class ThirdPersonCameraDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.outputEncoding = THREE.sRGBEncoding;
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 70;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(25, 10, 25);

    this._scene = scene;

    let light = new THREE.DirectionalLight(0xFFFFFF, 0.7);
    light.position.set(-100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 700.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 700.0;
    light.shadow.camera.left = 300;
    light.shadow.camera.right = -300;
    light.shadow.camera.top = 300;
    light.shadow.camera.bottom = -300;
    this._scene.add(light);

    light = new THREE.AmbientLight(0x947CFD, 0.7);  //Color de la luz e Intensidad
    this._scene.add(light);

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      './resources/Backgrounds/cityBackground.jpg',
      './resources/Backgrounds/cityBackground.jpg',
      './resources/Backgrounds/cityBackground.jpg',
      './resources/Backgrounds/cityBackground.jpg',
      './resources/Backgrounds/cityBackground.jpg',
      './resources/Backgrounds/cityBackground.jpg',
    ]);
    texture.encoding = THREE.sRGBEncoding;
    this._scene.background = texture;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x2f2f2f,    //cambio de color del plano
      }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    this._mixers = [];
    this._previousRAF = null;

    this._LoadAnimatedModel();
    this._LoadAnimatedModelAndPlay(
      './resources/people/', 'Character1.fbx', 'Character1.fbx', new THREE.Vector3(-57, 0, 12));
    this._LoadAnimatedModelAndPlay(
      './resources/people/', 'Character2_P.fbx', 'Character2_P.fbx', new THREE.Vector3(-90, 0, -150));
    //this._LoadAnimatedModelAndPlay(
    //    './resources/people/', 'Character3_P.fbx', 'Character3_P.fbx', new THREE.Vector3(-10, 0, -10));
    this._LoadAnimatedModelAndPlay(
      './resources/people/', 'Character4_P.fbx', 'Character4_P.fbx', new THREE.Vector3(-65, 0, 170));


    //buildings
    this._LoadAnimatedModelAndPlay(
      './resources/buildings/', 'redBuilding.fbx', 'redBuilding.fbx', new THREE.Vector3(90, 0, 20));
    this._LoadAnimatedModelAndPlay(
      './resources/buildings/', 'redBuilding.fbx', 'redBuilding.fbx', new THREE.Vector3(0, 0, 130));
    this._LoadAnimatedModelAndPlay(
      './resources/buildings/', 'greenBuilding.fbx', 'greenBuilding.fbx', new THREE.Vector3(-130, 0, 130));
    this._LoadAnimatedModelAndPlay(
      './resources/buildings/', 'gasoline.fbx', 'gasoline.fbx', new THREE.Vector3(-20, 0, 150));
    this._LoadAnimatedModelAndPlay(
      './resources/buildings/', 'flowerBuilding.fbx', 'flowerBuilding.fbx', new THREE.Vector3(-90, 0, -10));
    this._LoadAnimatedModelAndPlay(
      './resources/buildings/', 'hotel.fbx', 'hotel.fbx', new THREE.Vector3(90, 0, -120));
    this._LoadAnimatedModelAndPlay(
      './resources/buildings/', 'libraryBuilding.fbx', 'libraryBuilding.fbx', new THREE.Vector3(-90, 0, -100));
    this._RAF();
  }

  _LoadAnimatedModel() {
    const params = {
      camera: this._camera,
      scene: this._scene,
    }
    misParams = params;
    this._controls = new BasicCharacterController(params);

    this._thirdPersonCamera = new ThirdPersonCamera({
      camera: this._camera,
      target: this._controls,
    });
  }

  _LoadAnimatedModelAndPlay(path, modelFile, animFile, offset) {
    const loader = new FBXLoader();
    loader.setPath(path);
    loader.load(modelFile, (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });
      fbx.position.copy(offset);

      const anim = new FBXLoader();
      anim.setPath(path);
      anim.load(animFile, (anim) => {
        const m = new THREE.AnimationMixer(fbx);
        this._mixers.push(m);
        const idle = m.clipAction(anim.animations[0]);
        idle.play();
      });
      this._scene.add(fbx);
    });
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map(m => m.update(timeElapsedS));
    }

    if (this._controls) {
      this._controls.Update(timeElapsedS);
    }

    this._thirdPersonCamera.Update(timeElapsedS);
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new ThirdPersonCameraDemo();
});


function _LerpOverFrames(frames, t) {
  const s = new THREE.Vector3(0, 0, 0);
  const e = new THREE.Vector3(100, 0, 0);
  const c = s.clone();

  for (let i = 0; i < frames; i++) {
    c.lerp(e, t);
  }
  return c;
}

function _TestLerp(t1, t2) {
  const v1 = _LerpOverFrames(100, t1);
  const v2 = _LerpOverFrames(50, t2);
  console.log(v1.x + ' | ' + v2.x);
}

_TestLerp(0.01, 0.01);
_TestLerp(1.0 / 100.0, 1.0 / 50.0);
_TestLerp(1.0 - Math.pow(0.3, 1.0 / 100.0),
  1.0 - Math.pow(0.3, 1.0 / 50.0));