// constants

// scene setup
const scene = new THREE.Scene();
const bgColor = new THREE.Color("blue");
const objColor = new THREE.Color("lightblue"); 

// overhead functions
const deg = function (a) {
  return a * 0.017453;
}

// scene setup
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

const ambLight = new THREE.AmbientLight(0xffffff);
scene.add(ambLight);
const dirLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
scene.add(dirLight);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(bgColor, 1);
document.body.appendChild(renderer.domElement);

var waterSize = 20;


var material = new THREE.MeshBasicMaterial({ color: objColor, wireframe: true });

var mesh;
var geometry;
function setupMesh()
{
  waterSize = document.querySelector("#data-0").value;
  geometry = new THREE.PlaneGeometry(10, 10, waterSize, waterSize);
  mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -25;
  scene.add(mesh);
}
setupMesh();

function reset()
{
  scene.remove(mesh);
  setupMesh();
}
var modulator;
var checker;
var hecticness;

const presets = [ [6,1,1], [-3,1,1000], [3, 2, 10], [20, 2, 2], [11, 0, 0], [33, 0, 0] ];

function preset(a)
{
  a = parseInt(a);
  console.log("Loading preset " + a);
  let p = presets[a];
  document.querySelector("#data-1").value = p[0];
  document.querySelector("#data-2").value = p[1];
  document.querySelector("#data-3").value = p[2];
  reset();
}

let dirX = 0;
let dirY = 0;

document.addEventListener("keydown" , function (e)
{
  if (e.keyCode === 37) dirX = -1;
  if (e.keyCode === 39) dirX = 1;
  if (e.keyCode === 38) dirY = -1;
  if (e.keyCode === 40) dirY = 1;
});

document.addEventListener("keyup" , function (e)
{
  if (e.keyCode === 37) dirX /= 2;
  if (e.keyCode === 39) dirX /= 2;
  if (e.keyCode === 38) dirY /= 2;
  if (e.keyCode === 40) dirY /= 2;
});

const clock = new THREE.Clock();

function render() {
  modulator = document.querySelector("#data-1").value; // i have no idea how this one works
  checker = document.querySelector("#data-2").value; // axis (1 = Y, 2 = X, 3 = Z)
  hecticness = document.querySelector("#data-3").value; // lower is more
  
  clock.getDelta();
  renderer.render(scene, camera);

  requestAnimationFrame(render);

  mesh.position.x += dirX / 10;
  mesh.position.y -= dirY / 10;
  for (let i = 0; i < mesh.geometry.attributes.position.array.length; i++)
  {
    // for every Y value
    if (i % modulator == checker) mesh.geometry.attributes.position.array[i] += Math.random() * Math.sin(clock.elapsedTime) / (Math.random() * hecticness);
    
mesh.geometry.attributes.position.needsUpdate = true;
  }
}

render();