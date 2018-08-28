import React from 'react';
import { PropTypes } from 'prop-types';
import spriteImgSrc from '../assets/ps_smoke.png';
import THREE from '../three';
import { makeTextSprite } from '../helpers/helpers';

class Tetrahedron extends React.Component {

  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, props.width / props.height, 0.1, 1000);
    this.controls = new THREE.OrbitControls(this.camera);
    this.labels = [];
    this.initMesh = this.initMesh.bind(this);
    this.renderScene = this.renderScene.bind(this);
  }

  componentDidMount() {
    const { id, width, height } = this.props;
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById(`tetrahedron-${id}`)
    });
    this.renderer.setSize(width, height);
  
    this.camera.position.z = 5;
  
    let light = new THREE.AmbientLight( 0x4f4f4f );
    this.scene.add( light );

    let directionalLight = new THREE.DirectionalLight( 0x2255ff, 0.5 );
    this.scene.add( directionalLight );
  
    this.initMesh();  
    this.renderScene();
  }

  initMesh() {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(    0,  2/3,  -1/3),
      new THREE.Vector3( -2/3, -1/3,  -1/3),
      new THREE.Vector3(  2/3, -1/3,  -1/3),
      new THREE.Vector3(    0,    0,   2/3),
    );
  
    geometry.faces.push(
      new THREE.Face3( 0, 2, 1, new THREE.Vector3(), new THREE.Color(1,0,0)),
      new THREE.Face3( 3, 0, 1, new THREE.Vector3(), new THREE.Color(1,1,0)),
      new THREE.Face3( 3, 2, 0, new THREE.Vector3(), new THREE.Color(0,1,0)),
      new THREE.Face3( 1, 2, 3, new THREE.Vector3(), new THREE.Color(0,1,1)),
    );
  
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.dynamic = true;
    const material = new THREE.MeshPhongMaterial({
      vertexColors: THREE.FaceColors
    });
  
    var spriteMap = new THREE.TextureLoader().load(spriteImgSrc);
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.name = 'MyMesh';
    this.mesh.points = new THREE.Points(geometry, new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      map: spriteMap,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    }));
    this.mesh.add(this.mesh.points);
    this.vnh = new THREE.VertexNormalsHelper( this.mesh, 1, 0xff0000 );
    this.scene.add( this.vnh );
    this.fnh = new THREE.FaceNormalsHelper( this.mesh, 1, 0xffff00 );
    this.scene.add( this.fnh );
    this.scene.add(this.mesh);
  
    this.renderLabels();
  }


  renderLabels() {
    this.mesh.geometry.vertices.forEach((v, i) => {
      const label = makeTextSprite(`${i}`, {
        fontSize: 36
      });
      label.position.set(v.x, v.y + 0.05, v.z);
      label.vRef = v;
      this.labels.push(label);
      this.mesh.add(label);
    });
  }

  updateLabels() {
    this.labels.forEach(l => {
      l.position.set(l.vRef.x, l.vRef.y + 0.05, l.vRef.z);
    });
  }
  
  updateMesh() {
    this.mesh.geometry.computeVertexNormals();
    this.mesh.geometry.computeFaceNormals();
    
    this.mesh.geometry.verticesNeedUpdate = true;
    this.mesh.geometry.elementsNeedUpdate = true;
    this.mesh.geometry.morphTargetsNeedUpdate = true;
    this.mesh.geometry.uvsNeedUpdate = true;
    this.mesh.geometry.normalsNeedUpdate = true;
    this.mesh.geometry.colorsNeedUpdate = true;
    this.mesh.geometry.tangentsNeedUpdate = true;
  
    this.vnh.update();
    this.fnh.update();
    this.updateLabels();
  }
  
  
  renderScene(d) {
    requestAnimationFrame(this.renderScene);
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    this.updateMesh(d);
  }

  componentDidUpdate(prevProps) {
    const { width, height } = this.props;
    if(width !== prevProps.width || height !== prevProps.height) {
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  render () {
    const { id } = this.props;
    return (
      <canvas id={`tetrahedron-${id}`}/>
    );
  }
}

Tetrahedron.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  id: PropTypes.number
};

export default Tetrahedron;
