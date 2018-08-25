import 'styles/index.scss';

import {
    Vector2,
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    SphereGeometry,
    Vector3,
} from 'three';

const WIDTH = 640;
const HEIGHT = 640;
const MOUSE_OFFSET = 1.5;
const RATIO = WIDTH/HEIGHT;

class App {
  constructor(){
    // renderer
    const canvas = document.getElementById("glCanvas");
    this.renderer = new WebGLRenderer({canvas: canvas});
    this.renderer.setSize(WIDTH, HEIGHT, false);
    document.body.appendChild(this.renderer.domElement);

    // scene
    this.mouse = new Vector2();
    this.scene = new Scene();

    // camera
    this.camera = new PerspectiveCamera(35, WIDTH / HEIGHT, 1, 10000);
    this.camera.position.set(0, 0, 5);
    
    // cube
    const geometry = new BoxGeometry(0.4, 0.1, 1);
    const material = new MeshBasicMaterial({ color: 0x5f5f5f });
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);  
    
    // debug sphere
    const geoSphere = new SphereGeometry(0.1, 8);
    const matSphere = new MeshBasicMaterial({color: 0xff0000});
    this.meshSphere = new Mesh(geoSphere, matSphere);
    // scene.add(meshSphere);
    
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
    
    // this.cube.position.x = mouse.x*MOUSE_OFFSET;
    // this.cube.position.y = mouse.y*MOUSE_OFFSET;
    
    
    const lerpTo = new Vector3(
        this.mouse.x*MOUSE_OFFSET,
        this.mouse.y*MOUSE_OFFSET,
        this.cube.position.z,
      );
    
    this.cube.position.lerp(lerpTo, 0.2);
    
    const sign = new Vector2(
      this.cube.position.x,
      this.cube.position.y)
    .dot(
      new Vector2(
        lerpTo.x, 
        lerpTo.y));  
    
    const valX = this.cube.position.x - lerpTo.x;
    const valY = this.cube.position.y - lerpTo.y;
   
    this.cube.rotation.z = valX;
    this.cube.rotation.x = -valY;
    this.cube.rotation.y = valX;
    
    this.meshSphere.position.x = lerpTo.x;
    this.meshSphere.position.y = lerpTo.y;
  }
  
}

new App();

