import "styles/index.scss";

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
    Object3D
} from "../node_modules/three";

const WIDTH = 640;
const HEIGHT = 640;
const CAMERA_Z_POSITION = 30;
const MOUSE_OFFSET = CAMERA_Z_POSITION / 3.3;
const SPACESHIP_LERP_VAUE = 0.35;
const RATIO = WIDTH / HEIGHT;
let bob_height = 0;
const BOB_INTERVAL = 6;
const BOB_SPEED = 0.2;

class App {
    constructor() {
        // renderer
        const canvas = document.getElementById("glCanvas");
        this.renderer = new WebGLRenderer({ canvas: canvas });
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
        objectLoader.load("./assets/models/json/model.json", obj => {
            this.spaceship = obj;
            this.scene.add(this.spaceship);

            // spaceship parent
            this.parent = new Object3D();
            this.parent.add(this.spaceship);
            this.scene.add(this.parent);
        });

        // debug sphere
        const geoSphere = new SphereGeometry();
        const matSphere = new MeshBasicMaterial({ color: 0xff0000 });
        this.meshSphere = new Mesh(geoSphere, matSphere);
        // this.scene.add(this.meshSphere);

        // lighting
        const ambientLight = new AmbientLight(0xffffff, 0.9);
        this.scene.add(ambientLight);

        this.addEventListeners();
        this.animate();
        this.onResize();
        this.generateWall();
    }
    addEventListeners = () => {
        this.renderer.domElement.addEventListener(
            "mousemove",
            this.onMouseMove
        );
        window.addEventListener("resize", this.onResize);
    };

    onResize = () => {
        const scale = Math.min(
            window.innerWidth / WIDTH,
            window.innerHeight / HEIGHT
        );

        this.renderer.domElement.width = WIDTH * scale;
        this.renderer.domElement.height = HEIGHT * scale;

        this.renderer.setSize(
            this.renderer.domElement.width,
            this.renderer.domElement.height
        );
        this.camera.aspect =
            this.renderer.domElement.width / this.renderer.domElement.height;
        this.camera.updateProjectionMatrix();
    };

    onMouseMove = event => {
        const canvasPosition = this.renderer.domElement.getBoundingClientRect();

        const mouseX = event.clientX - canvasPosition.left;
        const mouseY = event.clientY - canvasPosition.top;

        this.mouse = new Vector2(
            2 * (mouseX / this.renderer.domElement.width) - 1,
            1 - 2 * (mouseY / this.renderer.domElement.height)
        );
    };

    moveSpaceship = () => {
        if (this.spaceship) {
            const lerpTo = new Vector3(
                this.mouse.x * MOUSE_OFFSET,
                this.mouse.y * MOUSE_OFFSET,
                this.parent.position.z
            );

            this.parent.position.lerp(lerpTo, SPACESHIP_LERP_VAUE);

            const spaceshipRotationX = this.parent.position.x - lerpTo.x;
            const spaceshipRotationY = this.parent.position.y - lerpTo.y;

            this.parent.rotation.z = spaceshipRotationX;
            this.parent.rotation.x = -spaceshipRotationY;
            this.parent.rotation.y = spaceshipRotationX;

            // this.meshSphere.position.x = lerpTo.x;
            // this.meshSphere.position.y = lerpTo.y;
            this.spaceship.position.set(
                0,
                Math.sin(bob_height) / BOB_INTERVAL,
                0
            );
            this.spaceship.rotation.set(
                Math.sin(bob_height * 0.95) / (BOB_INTERVAL * 3),
                0,
                0
            );
            bob_height += BOB_SPEED;
        }
    };

    generateWall = () => {
        // cube
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshStandardMaterial({
            color: 0x26547c,
            flatShading: true,
            metalness: 0,
            roughness: 1
        });
        let z = -10;
        for (let x = -9; x < 10; x++) {
            for (let y = -9; y < 10; y++) {
                this.cube = new Mesh(geometry, material);
                if (this.cube) {
                    this.cube.position.set(x, y, z);
                    if (x != -7 || y != 7) {
                        this.scene.add(this.cube);
                    }
                    // console.log(this.cube.position);
                }
            }
        }
    };

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
        this.moveSpaceship();
    };
}

new App();
