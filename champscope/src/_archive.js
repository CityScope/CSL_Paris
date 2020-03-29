import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

this.camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
);
this.camera.position.z = 3;
this.camera.position.x = 2;
this.camera.position.y = 3;
this.camera.position.set(4192079, 4800600, 254663);
this.controls.target.set(4192060, 4800600, 254650);
this.controls.update();

_loadOBJmodel = scene => {
    var loader = new GLTFLoader();
    loader.load(
        "./model/champ.gltf",
        function(model) {
            model.scene.scale.set(0.1, 0.1, 0.1);
            model.scene.position.set(0, 1, 0);
            model.scene.rotation.set(0, 0.4625123, 0);
            model.scene.traverse(function(child) {
                child.castShadow = true;
            });
            scene.add(model.scene);
        },

        function(error) {
            console.log(error);
        }
    );
};
