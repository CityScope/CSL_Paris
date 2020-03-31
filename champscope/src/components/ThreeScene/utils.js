import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

/***
 *
 *
 */
export const _setupAgents = trips => {
    let rndCol = 1 / (Math.random() * 4);
    console.log(rndCol);

    let agentsWrapper = new THREE.Object3D();
    for (let i = 0; i < trips.length; i++) {
        let textLoader = new THREE.TextureLoader();
        let spriteText = textLoader.load("./resources/textures/agent.png");
        spriteText.minFilter = THREE.LinearFilter;

        var spriteMaterial = new THREE.SpriteMaterial({
            map: spriteText,
            transparent: true
        });

        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.material.color.setHSL(rndCol, 1, 0.2);
        sprite.material.blending = THREE.AdditiveBlending;
        sprite.material.transparent = true;
        sprite.scale.set(0.05, 0.05, 0.05);
        sprite.position.set(0, 0, 0);
        agentsWrapper.add(sprite);
    }

    agentsWrapper.rotation.set(0, 0.4625123, 0);

    agentsWrapper.position.set(
        -(Math.cos(0.4625123) * 822) / 2000 - 1.57 / 2,
        0,
        (Math.sin(0.4625123) * 822) / 2000 - 0.92 / 2
    );
    agentsWrapper.rotation.set(0, 0.4625123, 0);
    return agentsWrapper;
};

/**
 *
 *
 */

export const _loadOBJmodel = (scene, modelMaterial) => {
    var loader = new OBJLoader();

    loader.load(
        "./resources/model/champ.obj",
        function(model) {
            model.scale.set(0.000505, 0.001, 0.000505);
            model.position.set(-0.0055, 0.7, 0);
            model.rotation.set(0, 0.4625123, 0);
            model.traverse(function(child) {
                // child.castShadow = true;
                child.material = modelMaterial;
            });
            scene.add(model);
        },
        function(error) {
            console.log(error);
        }
    );
};

/**
 *
 * @param {*} renderer
 * @param {*} scene
 */

export const _shaders = () => {
    const _vertexShader = () => {
        return `
    varying vec2 vUv;
       void main() {
           vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;
    };
    //
    const _fragmentshader = () => {
        return ` 
    uniform sampler2D baseTexture;
    uniform sampler2D bloomTexture;
    varying vec2 vUv;
    vec4 getTexture( sampler2D texelToLinearTexture ) {
        return mapTexelToLinear( texture2D( texelToLinearTexture , vUv ) );
    }
    void main() {
        gl_FragColor = ( getTexture( baseTexture ) + vec4( 1.0 ) * getTexture( bloomTexture ) );
    }`;
    };

    return { vertex: _vertexShader(), frag: _fragmentshader() };
};

/**
 *
 * @param {*} renderer
 * @param {*} scene
 */
// ! should consider https://tinyurl.com/wqpozgh

export const _createFloor = (renderer, scene) => {
    // Create a floor.
    var loader = new THREE.TextureLoader();

    loader.load("./resources/textures/floor/WOOD_SML.jpg", function(texture) {
        texture.minFilter = THREE.LinearFilter;
        var repeatX = 15;
        var repeatY = 15;

        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);

        var normal = loader.load("./resources/textures/floor/NRM.jpg");
        normal.anisotropy = renderer.capabilities.getMaxAnisotropy();
        normal.wrapS = THREE.RepeatWrapping;
        normal.wrapT = THREE.RepeatWrapping;
        normal.repeat.set(repeatX, repeatY);

        var ao = loader.load("./resources/textures/floor/GLOSS.jpg");
        ao.anisotropy = renderer.capabilities.getMaxAnisotropy();
        ao.wrapS = THREE.RepeatWrapping;
        normal.wrapT = THREE.RepeatWrapping;
        ao.repeat.set(repeatX, repeatY);

        var displace = loader.load("./resources/textures/floor/WOOD_DISP.jpg");
        displace.minFilter = THREE.LinearFilter;

        displace.anisotropy = renderer.capabilities.getMaxAnisotropy();
        displace.wrapS = THREE.RepeatWrapping;
        displace.wrapT = THREE.RepeatWrapping;
        displace.repeat.set(repeatX, repeatY);

        var material = new THREE.MeshStandardMaterial({
            aoMap: ao,
            aoMapIntensity: 1,
            color: 0xffffff,
            map: texture,
            metalnessMap: texture,
            displacementMap: displace,
            displacementScale: 0.1,
            normalMap: normal,
            metalness: 5,
            roughness: 0.5
        });

        const planeSize = 50;
        const planeMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(planeSize, planeSize),
            material
        );
        planeMesh.receiveShadow = true;
        planeMesh.rotation.x = Math.PI * -0.5;
        planeMesh.position.y = 0;
        planeMesh.position.z = 0;

        scene.add(planeMesh);
    });
};
