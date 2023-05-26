import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

// Obtener la referencia al elemento del contador
const contadorElemento = document.getElementById("contador");

let tiempoRestante = 20; // Tiempo inicial en segundos

// Actualizar el contenido del contador cada segundo
const intervalo = setInterval(() => {
  tiempoRestante--;

  if (tiempoRestante <= 0) {
    // Redirigir cuando el tiempo llegue a cero
    clearInterval(intervalo);
    window.location.href = "puntuation.html";
  } else {
    // Actualizar el contenido del contador
    contadorElemento.textContent = tiempoRestante;
  }
}, 1000); // Intervalo de 1 segundo



const _VS = `
uniform float pointMultiplier;

attribute float size;
attribute float angle;
attribute vec4 colour;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;

  vAngle = vec2(cos(angle), sin(angle));
  vColour = colour;
}`;

const _FS = `

uniform sampler2D diffuseTexture;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
}`;


class LinearSpline {
  constructor(lerp) {
    this._points = [];
    this._lerp = lerp;
  }

  AddPoint(t, d) {
    this._points.push([t, d]);
  }

  Get(t) {
    let p1 = 0;

    for (let i = 0; i < this._points.length; i++) {
      if (this._points[i][0] >= t) {
        break;
      }
      p1 = i;
    }

    const p2 = Math.min(this._points.length - 1, p1 + 1);

    if (p1 == p2) {
      return this._points[p1][1];
    }

    return this._lerp(
      (t - this._points[p1][0]) / (
        this._points[p2][0] - this._points[p1][0]),
      this._points[p1][1], this._points[p2][1]);
  }
}


class ParticleSystem {
  constructor(params) {
    const uniforms = {
      diffuseTexture: {
        value: new THREE.TextureLoader().load('./resources/smoke.png')
      },
      pointMultiplier: {
        value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
      }
    };

    this._material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: _VS,
      fragmentShader: _FS,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    });

    this._camera = params.camera;
    this._particles = [];

    this._geometry = new THREE.BufferGeometry();
    this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this._geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    this._geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    this._geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

    this._points = new THREE.Points(this._geometry, this._material);

    params.parent.add(this._points);

    this._alphaSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._alphaSpline.AddPoint(0.0, 0.0);
    this._alphaSpline.AddPoint(0.1, 1.0);
    this._alphaSpline.AddPoint(0.6, 1.0);
    this._alphaSpline.AddPoint(1.0, 0.0);

    this._colourSpline = new LinearSpline((t, a, b) => {
      const c = a.clone();
      return c.lerp(b, t);
    });
    this._colourSpline.AddPoint(0.0, new THREE.Color(0xFFFF80));
    this._colourSpline.AddPoint(1.0, new THREE.Color(0xFF8080));

    this._sizeSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this._sizeSpline.AddPoint(0.0, 1.0);
    this._sizeSpline.AddPoint(0.5, 5.0);
    this._sizeSpline.AddPoint(1.0, 1.0);

    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);

    this._UpdateGeometry();
  }

  _onKeyUp(event) {
    switch (event.keyCode) {
      case 32: // SPACE
        this._AddParticles();
        break;
    }
  }

  _AddParticles(timeElapsed) {
    if (!this.gdfsghk) {
      this.gdfsghk = 0.0;
    }
    this.gdfsghk += timeElapsed;
    const n = Math.floor(this.gdfsghk * 75.0);
    this.gdfsghk -= n / 75.0;

    for (let i = 0; i < n; i++) {
      const life = (Math.random() * 0.75 + 0.25) * 10.0;
      this._particles.push({
        position: new THREE.Vector3(
          (Math.random() * 2 - 1) * 1.0,
          (Math.random() * 2 - 1) * 1.0,
          (Math.random() * 2 - 1) * 1.0),
        size: (Math.random() * 0.5 + 0.5) * 4.0,
        colour: new THREE.Color(),
        alpha: 1.0,
        life: life,
        maxLife: life,
        rotation: Math.random() * 2.0 * Math.PI,
        velocity: new THREE.Vector3(0, -15, 0),
      });
    }
  }

  _UpdateGeometry() {
    const positions = [];
    const sizes = [];
    const colours = [];
    const angles = [];

    for (let p of this._particles) {
      positions.push(p.position.x, p.position.y, p.position.z);
      colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
      sizes.push(p.currentSize);
      angles.push(p.rotation);
    }

    this._geometry.setAttribute(
      'position', new THREE.Float32BufferAttribute(positions, 3));
    this._geometry.setAttribute(
      'size', new THREE.Float32BufferAttribute(sizes, 1));
    this._geometry.setAttribute(
      'colour', new THREE.Float32BufferAttribute(colours, 4));
    this._geometry.setAttribute(
      'angle', new THREE.Float32BufferAttribute(angles, 1));

    this._geometry.attributes.position.needsUpdate = true;
    this._geometry.attributes.size.needsUpdate = true;
    this._geometry.attributes.colour.needsUpdate = true;
    this._geometry.attributes.angle.needsUpdate = true;
  }

  _UpdateParticles(timeElapsed) {
    for (let p of this._particles) {
      p.life -= timeElapsed;
    }

    this._particles = this._particles.filter(p => {
      return p.life > 0.0;
    });

    for (let p of this._particles) {
      const t = 1.0 - p.life / p.maxLife;

      p.rotation += timeElapsed * 0.5;
      p.alpha = this._alphaSpline.Get(t);
      p.currentSize = p.size * this._sizeSpline.Get(t);
      p.colour.copy(this._colourSpline.Get(t));

      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));

      const drag = p.velocity.clone();
      drag.multiplyScalar(timeElapsed * 0.1);
      drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
      drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
      drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
      p.velocity.sub(drag);
    }

    this._particles.sort((a, b) => {
      const d1 = this._camera.position.distanceTo(a.position);
      const d2 = this._camera.position.distanceTo(b.position);

      if (d1 > d2) {
        return -1;
      }

      if (d1 < d2) {
        return 1;
      }

      return 0;
    });
  }

  Step(timeElapsed) {
    this._AddParticles(timeElapsed);
    this._UpdateParticles(timeElapsed);
    this._UpdateGeometry();

  }
}

class ParticleSystemDemo {
  constructor() {
    this.initializegame_();
  }

  initializegame_() {
    this._Initialize();

    this._previousRAF_ = null;
    this._RAF();
    this._OnWindowResize();
  }



  _Initialize() {

    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 80;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(35, 0, -15);

    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0x7e9cce, 5.0);
    light.position.set(0, 100, -60);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    let light2 = new THREE.DirectionalLight(0x7e9cce, 5.0);
    light2.position.set(0, 100, 60);
    light2.target.position.set(0, 0, 0);
    light2.castShadow = true;
    light2.shadow.bias = -0.001;
    light2.shadow.mapSize.width = 2048;
    light2.shadow.mapSize.height = 2048;
    light2.shadow.camera.near = 0.1;
    light2.shadow.camera.far = 500.0;
    light2.shadow.camera.near = 0.5;
    light2.shadow.camera.far = 500.0;
    light2.shadow.camera.left = 100;
    light2.shadow.camera.right = -100;
    light2.shadow.camera.top = 100;
    light2.shadow.camera.bottom = -100;
    this._scene.add(light2);

    let light3 = new THREE.DirectionalLight(0x7e9cce, 5.0);
    light3.position.set(50, 100, 60);
    light3.target.position.set(0, 0, 0);
    light3.castShadow = true;
    light3.shadow.bias = -0.001;
    light3.shadow.mapSize.width = 2048;
    light3.shadow.mapSize.height = 2048;
    light3.shadow.camera.near = 0.1;
    light3.shadow.camera.far = 500.0;
    light3.shadow.camera.near = 0.5;
    light3.shadow.camera.far = 500.0;
    light3.shadow.camera.left = 100;
    light3.shadow.camera.right = -100;
    light3.shadow.camera.top = 100;
    light3.shadow.camera.bottom = -100;
    this._scene.add(light3);

    let light4 = new THREE.DirectionalLight(0x7e9cce, 5.0);
    light4.position.set(-50, 100, 60);
    light4.target.position.set(0, 0, 0);
    light4.castShadow = true;
    light4.shadow.bias = -0.001;
    light4.shadow.mapSize.width = 2048;
    light4.shadow.mapSize.height = 2048;
    light4.shadow.camera.near = 0.1;
    light4.shadow.camera.far = 500.0;
    light4.shadow.camera.near = 0.5;
    light4.shadow.camera.far = 500.0;
    light4.shadow.camera.left = 100;
    light4.shadow.camera.right = -100;
    light4.shadow.camera.top = 100;
    light4.shadow.camera.bottom = -100;
    this._scene.add(light4);

    let light5 = new THREE.DirectionalLight(0x7e9cce, 5.0);
    light5.position.set(0, -100, 0);
    light5.target.position.set(0, 0, 0);
    light5.castShadow = true;
    light5.shadow.bias = -0.001;
    light5.shadow.mapSize.width = 2048;
    light5.shadow.mapSize.height = 2048;
    light5.shadow.camera.near = 0.1;
    light5.shadow.camera.far = 500.0;
    light5.shadow.camera.near = 0.5;
    light5.shadow.camera.far = 500.0;
    light5.shadow.camera.left = 100;
    light5.shadow.camera.right = -100;
    light5.shadow.camera.top = 100;
    light5.shadow.camera.bottom = -100;
    this._scene.add(light4);

    light = new THREE.AmbientLight(0x7e9cce);
    this._scene.add(light);

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      './resources/Backgrounds/clouds.jpg',
      './resources/Backgrounds/clouds5.jpg',
      './resources/Backgrounds/clouds2.jpg',
      './resources/Backgrounds/clouds6.jpg',
      './resources/Backgrounds/clouds4.jpg',
      './resources/Backgrounds/clouds1.jpg',
    ]);
    texture.encoding = THREE.sRGBEncoding;
    this._scene.background = texture;

    //Audio
    const listener = new THREE.AudioListener();
    this._camera.add(listener);

    // create a global audio source
    const sound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('./resources/audioBackground.mp3', function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });

    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.autoRotate = true; // Habilitar rotación automática
    controls.autoRotateSpeed = 0.5; // Velocidad de rotación automática
    controls.target.set(0, 0, 0);
    controls.update();

    this._particles = new ParticleSystem({
      parent: this._scene,
      camera: this._camera,
    });



    this._LoadModel();
    this._previousRAF = null;
    this._RAF();
  }


  _LoadModel() {
    const loader = new GLTFLoader();
    loader.load('./resources/taxi/taxipreview3.gltf', (gltf) => {
      gltf.scene.traverse(c => {
        c.castShadow = true;
      });

      // Ajustar la posición del modelo
      gltf.scene.position.set(0, 0, 0); // Mueve el modelo 5 unidades hacia adelante en el eje Z

      this._scene.add(gltf.scene);
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

    this._particles.Step(timeElapsedS);
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new ParticleSystemDemo();
});
