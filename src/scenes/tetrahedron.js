
// import * as vertexShader from './shaders/vertex.glsl';
// import * as fragmentShader from './shaders/fragment.glsl';

import spriteImgSrc from '../assets/ps_smoke.png';
import THREE from '../three';
import { makeTextSprite } from '../helpers/helpers';

let camera, controls, scene, renderer;
let vnh, fnh;
const props = {
  width: window.innerWidth,
  height: window.innerHeight
};

const vis = {
  mesh: null
};

function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, props.width / props.height, 0.1, 1000);
  controls = new THREE.OrbitControls(camera);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(props.width, props.height);

  const el = document.getElementById('tetrahedron');
  el.appendChild(renderer.domElement);

  camera.position.z = 5;
  window.addEventListener('resize', onResize);

  var light = new THREE.AmbientLight( 0x4f4f4f ); // soft white light
  scene.add( light );

  // White directional light at half intensity shining from the top.
  var directionalLight = new THREE.DirectionalLight( 0x2255ff, 0.5 );
  scene.add( directionalLight );

  initMesh();  
  render();
}

function initMesh() {
  const geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(    0,  2/3,  -1/3),
    new THREE.Vector3( -2/3, -1/3,  -1/3),
    new THREE.Vector3(  2/3, -1/3,  -1/3),
    new THREE.Vector3(    0,    0,   2/3),
    // new THREE.Vector3(    0,    0,  -4/3),
  );

  geometry.faces.push(
    new THREE.Face3( 0, 2, 1, new THREE.Vector3(), new THREE.Color(1,0,0)),
    new THREE.Face3( 3, 0, 1, new THREE.Vector3(), new THREE.Color(1,1,0)),
    new THREE.Face3( 3, 2, 0, new THREE.Vector3(), new THREE.Color(0,1,0)),
    new THREE.Face3( 1, 2, 3, new THREE.Vector3(), new THREE.Color(0,1,1)),
    // new THREE.Face3( 0, 4, 1, new THREE.Vector3(), new THREE.Color(1,0,0)),
    // new THREE.Face3( 4, 2, 1, new THREE.Vector3(), new THREE.Color(1,0,0)),
    // new THREE.Face3( 0, 2, 4, new THREE.Vector3(), new THREE.Color(1,0,0)),
  );

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  geometry.dynamic = true;
  const material = new THREE.MeshPhongMaterial({
    // transparent: true,
    // opacity: 0.7,
    vertexColors: THREE.FaceColors
  });

  var spriteMap = new THREE.TextureLoader().load(spriteImgSrc);
  // var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
  // var sprite = new THREE.Sprite( spriteMaterial );


  vis.mesh = new THREE.Mesh(geometry, material);
  vis.mesh.name = 'MyMesh';
  vis.mesh.points = new THREE.Points(geometry, new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    map: spriteMap,
    transparent: true,
    opacity: 0.9,
    depthWrite: false
  }));
  vis.mesh.add(vis.mesh.points);
  // wh = new THREE.WireframeHelper(vis.mesh, 0x00ff00);
  // vis.mesh.add(wh);
  vnh = new THREE.VertexNormalsHelper( vis.mesh, 1, 0xff0000 );
  // vnh.matrixAutoUpdate = true;
  scene.add( vnh );
  fnh = new THREE.FaceNormalsHelper( vis.mesh, 1, 0xffff00 );
  // fnh.matrixAutoUpdate = true;
  scene.add( fnh );
  scene.add(vis.mesh);

  renderLabels();
}
const labels = [];
function renderLabels() {
  vis.mesh.geometry.vertices.forEach((v, i) => {
    const label = makeTextSprite(`${i}`, {
      fontSize: 36
    });
    label.position.set(v.x, v.y + 0.05, v.z);
    label.vRef = v;
    labels.push(label);
    vis.mesh.add(label);
  });
}

function updateLabels() {
  labels.forEach(l => {
    l.position.set(l.vRef.x, l.vRef.y + 0.05, l.vRef.z);
  });
}

function updateMesh(d) {
  // vis.mesh.rotation.y += 0.01;
  // vis.mesh.rotation.x += 0.005;

  vis.mesh.geometry.vertices[0].x = Math.sin(d/1000);

  vis.mesh.geometry.computeVertexNormals();
  vis.mesh.geometry.computeFaceNormals();
  
  vis.mesh.geometry.verticesNeedUpdate = true;
  vis.mesh.geometry.elementsNeedUpdate = true;
  vis.mesh.geometry.morphTargetsNeedUpdate = true;
  vis.mesh.geometry.uvsNeedUpdate = true;
  vis.mesh.geometry.normalsNeedUpdate = true;
  vis.mesh.geometry.colorsNeedUpdate = true;
  vis.mesh.geometry.tangentsNeedUpdate = true;

  vnh.update();
  fnh.update();
  updateLabels();
}


function render(d) {
  // console.log(d);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update();
  updateMesh(d);
}

function onResize() {
  props.width = window.innerWidth;
  props.width = window.innerHeight;
  renderer.setSize(props.width, props.width);
  camera.aspect = props.width / props.width;
  camera.updateProjectionMatrix();
}

window.onload = init;
