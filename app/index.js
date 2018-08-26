import 'styles/index.scss';

import {
    Vector2,
    Vector3,
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    BoxGeometry,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Mesh,
    SphereGeometry,
    ObjectLoader,
    AmbientLight,
} 
from '../node_modules/three';

const WIDTH = 640;
const HEIGHT = 640;
const CAMERA_Z_POSITION = 30;
const MOUSE_OFFSET = CAMERA_Z_POSITION/3.3;
const SPACESHIP_LERP_VAUE = 0.35;
const RATIO = WIDTH/HEIGHT;

class App {
  constructor(){

    // renderer
    const canvas = document.getElementById("glCanvas");
    this.renderer = new WebGLRenderer({canvas: canvas});
    this.renderer.setSize(WIDTH, HEIGHT, false);
    // this.renderer.setClearColor("#222222");
    document.body.appendChild(this.renderer.domElement);

    // scene
    this.mouse = new Vector2();
    this.scene = new Scene();

    // camera
    this.camera = new PerspectiveCamera(35, WIDTH / HEIGHT, 1, 10000);
    this.camera.position.set(0, 0, CAMERA_Z_POSITION);

    // spaceship model
    const objectLoader = new ObjectLoader();
    objectLoader.load(
      "./assets/models/json/model.json",
      (obj) => { // TODO: says this.spaceship is undefined but is working
        this.spaceship = obj;
        this.scene.add(this.spaceship);
      });

    // debug sphere
    const geoSphere = new SphereGeometry(0.1, 8);
    const matSphere = new MeshBasicMaterial({color: 0xff0000});
    this.meshSphere = new Mesh(geoSphere, matSphere);
    // scene.add(meshSphere);
    
    // lighting
    const ambientLight = new AmbientLight ( 0xffffff, 0.9)
    this.scene.add( ambientLight );

    this.addEventListeners();
    this.animate();
    this.onResize();  

  }
  addEventListeners = () => {
    this.renderer.domElement.addEventListener( 'mousemove', this.onMouseMove );
    window.addEventListener( 'resize', this.onResize );
  }

  onResize = () => {
    const scale = Math.min(
        window.innerWidth / WIDTH,
        window.innerHeight / HEIGHT,
    );
    
    this.renderer.domElement.width = WIDTH * scale;
    this.renderer.domElement.height = HEIGHT * scale;
    
    this.renderer.setSize(this.renderer.domElement.width, this.renderer.domElement.height);
    this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
    this.camera.updateProjectionMatrix();
  }
  
  onMouseMove = (event) => { 

    const canvasPosition = this.renderer.domElement.getBoundingClientRect();
  
    const mouseX = event.clientX - canvasPosition.left;
    const mouseY = event.clientY - canvasPosition.top;
    
    this.mouse = new Vector2 (
          2 * (mouseX / this.renderer.domElement.width) - 1,
      1 - 2 * (mouseY / this.renderer.domElement.height));  
  }
  
  animate = () => {  
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
    
    const lerpTo = new Vector3(
        this.mouse.x*MOUSE_OFFSET,
        this.mouse.y*MOUSE_OFFSET,
        this.spaceship.position.z,
      );
    
    this.spaceship.position.lerp(lerpTo, SPACESHIP_LERP_VAUE);
    
    const sign = new Vector2(
      this.spaceship.position.x,
      this.spaceship.position.y)
    .dot(
      new Vector2(
        lerpTo.x, 
        lerpTo.y));  
    
    const spaceshipRotationX = this.spaceship.position.x - lerpTo.x;
    const spaceshipRotationY = this.spaceship.position.y - lerpTo.y;
   
    this.spaceship.rotation.z = spaceshipRotationX;
    this.spaceship.rotation.x = -spaceshipRotationY;
    this.spaceship.rotation.y = spaceshipRotationX;
    
    this.meshSphere.position.x = lerpTo.x;
    this.meshSphere.position.y = lerpTo.y;
  }
  
}

new App();

