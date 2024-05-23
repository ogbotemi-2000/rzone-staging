import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './OrbitControls.js';

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xffffff );
//camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('.webgl');

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//renderer
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
rf_resize()

const basic = new THREE.MeshBasicMaterial( { color: 'orangered'} );
const standard = new THREE.MeshPhongMaterial({color: 'yellow'});
//disc_1, pipe, disc_2
const shapes = [new THREE.RingGeometry(), new THREE.CylinderGeometry(), new THREE.RingGeometry()]
.map((shape,i)=>new THREE.Mesh(shape, i===1?standard:basic));

class Float extends THREE.Group {
  constructor() {
    super();
  }
}
const float = new Float();
[0,1,2].forEach(x=>{
  float.add(shapes[x]), shapes[x].position.x=2*x
});
scene.add(float);
//adjust group position
float.position.x=-1.5,

camera.position.z = 10;

//for nearly accurate colors
renderer.gammaFactor = 2.2;

window.onresize = rf_resize;

function rf_resize(e, w, h) {
  renderer.setSize(w=canvas.width, h=canvas.height)
  camera.aspect = w/h,
  camera.updateProjectionMatrix()
}

controls.addEventListener("change", () => renderer.render(scene, camera));

function animate() {
  controls.update()
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
    shapes.forEach(shape=>{
      //shape.rotation.x += 0.01,
      //shape.rotation.y += 0.01
    })
}

animate()