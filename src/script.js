import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane();

//add refs for form element
const radiusInput = document.getElementById("radius");
const distanceInput = document.getElementById("distance");
const speedInput = document.getElementById("speed");
const materialInput = document.getElementById("material");

// initialize the scene
const scene = new THREE.Scene();

//init texture loader
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath("/textures/cubeMap/");
//adding textures
const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const marsTexture = textureLoader.load("/textures/2k_mars.jpg");
const moonTexture = textureLoader.load("/textures/2k_moon.jpg");
const neptuneTexture = textureLoader.load("/textures/2k_neptune.jpg");
const ceresTexture = textureLoader.load("/textures/2k_ceres_fictional.jpg");
const erisTexture = textureLoader.load("/textures/2k_eris_fictional.jpg");
const haumeaTexture = textureLoader.load("/textures/2k_haumea_fictional.jpg");
const makemakeTexture = textureLoader.load(
  "/textures/2k_makemake_fictional.jpg"
);

const backgroundTexture = textureLoader.load(
  "/textures/2k_stars_milky_way.jpg"
);

const backgroundCubeMap = cubeTextureLoader.load([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
]);

scene.background = backgroundCubeMap;

// add stuff here

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

//Materials
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture,
});
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture,
});
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
});
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture,
});
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
});
const neptuneMaterial = new THREE.MeshStandardMaterial({
  map: neptuneTexture,
});
const ceresMaterial = new THREE.MeshStandardMaterial({
  map: ceresTexture,
});
const erisMaterial = new THREE.MeshStandardMaterial({
  map: erisTexture,
});
const haumeaMaterial = new THREE.MeshStandardMaterial({
  map: haumeaTexture,
});
const makemakeMaterial = new THREE.MeshStandardMaterial({
  map: makemakeTexture,
});

//creating map to change customPlanet material from userInput
const materialsMap = {
  erisMaterial: erisMaterial,
  ceresMaterial: ceresMaterial,
  haumeaMaterial: haumeaMaterial,
  makemakeMaterial: makemakeMaterial,
  neptuneMaterial: neptuneMaterial,
};

const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);

scene.add(sun);

const planetsArray = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [{ name: "Moon", radius: 0.3, distance: 3, speed: 0.015 }],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "CustomPlanet",
    radius: 0,
    distance: 0,
    speed: 0,
    material: erisMaterial,
    moons: [],
  },
];

const createPlanet = (planet) => {
  //createMesh and add it to the scene
  //create the mesh
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  //set the scale
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;
  return planetMesh;
};

const createMoon = (moon) => {
  //createMesh and add it to the planet
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;
  return moonMesh;
};

const planetMeshes = planetsArray.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);
  //loop through each moon and create
  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon);
    planetMesh.add(moonMesh);
  });
  return planetMesh;
});

let customPlanetMesh = null;

//keep track of the current position of the planet to avoid rerendering its position every change
let customPlanetRotationY = 0;

//function to update Custom Planet in Planets Array when form changes
const updateCustomPlanet = () => {
  // Update the customPlanetObject in planetsArray
  const customPlanet = planetsArray.find(
    (planet) => planet.name === "CustomPlanet"
  );

  customPlanet.radius = parseFloat(radiusInput.value);
  customPlanet.distance = parseFloat(distanceInput.value);
  customPlanet.speed = parseFloat(speedInput.value);

  const selectedMaterial = materialsMap[materialInput.value];
  customPlanet.material = selectedMaterial;
  console.log(customPlanet.material);

  // If the custom planet mesh doesn't exist yet, create it
  if (!customPlanetMesh) {
    customPlanetMesh = createPlanet(customPlanet);
    customPlanetMesh.name = "CustomPlanetMesh";
    scene.add(customPlanetMesh);
  } else {
    // If the custom planet mesh exists, update its properties
    customPlanetMesh.scale.setScalar(customPlanet.radius);
    customPlanetMesh.position.x = customPlanet.distance;
    customPlanetMesh.rotation.y = customPlanet.speed;
    customPlanetMesh.material = selectedMaterial;
  }
};

// add event listeners for when the form is changed by user

radiusInput.addEventListener("input", updateCustomPlanet);
distanceInput.addEventListener("input", updateCustomPlanet);
speedInput.addEventListener("input", updateCustomPlanet);
materialInput.addEventListener("change", updateCustomPlanet);

//add lights
const ambientLight = new THREE.AmbientLight("white", 0.1);
scene.add(ambientLight);

// Add the tweakpane control
pane.addBinding(ambientLight, "intensity", {
  min: 0,
  max: 2,
  step: 0.01,
  label: "Ambient Light",
});

const pointLight = new THREE.PointLight(0xffffff, 20);
pointLight.decay = 1;
scene.add(pointLight);

pane.addBinding(pointLight, "intensity", {
  min: 0,
  max: 80,
  step: 0.01,
  label: "Point Light",
});

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20;

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//init clock
const clock = new THREE.Clock();

// render loop
const renderloop = () => {
  planetMeshes.forEach((planet, planetIndex) => {
    planet.rotation.y += planetsArray[planetIndex].speed;
    planet.position.x =
      Math.sin(planet.rotation.y) * planetsArray[planetIndex].distance;
    planet.position.z =
      Math.cos(planet.rotation.y) * planetsArray[planetIndex].distance;
    planet.children.forEach((moon, moonIndex) => {
      moon.rotation.y += planetsArray[planetIndex].moons[moonIndex].speed;
      moon.position.x =
        Math.sin(moon.rotation.y) *
        planetsArray[planetIndex].moons[moonIndex].distance;
      moon.position.z =
        Math.cos(moon.rotation.y) *
        planetsArray[planetIndex].moons[moonIndex].distance;
    });
  });
  // Rotation logic for custom planet
  if (customPlanetMesh) {
    // Retain the previous rotation angle and update
    customPlanetRotationY += planetsArray.find(
      (planet) => planet.name === "CustomPlanet"
    ).speed;

    customPlanetMesh.rotation.y = customPlanetRotationY; // Update rotation
    customPlanetMesh.position.x =
      Math.sin(customPlanetRotationY) *
      planetsArray.find((planet) => planet.name === "CustomPlanet").distance;
    customPlanetMesh.position.z =
      Math.cos(customPlanetRotationY) *
      planetsArray.find((planet) => planet.name === "CustomPlanet").distance;
  }

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
