import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

/**
 *
 * @param {
 * } trips
 */

export const _blockCamera = (camera) => {
    if (camera) {
        let p = camera.position;
        if (p.y < 0.3) p.y = 0.3;
        if (p.y > 4) p.y = 4;
    }
};

/***
 *
 *
 */
export const _setupAgents = (trips) => {
    let agentsWrapper = new THREE.Object3D();
    let scale = 0.015;
    let color = new THREE.Color();
    color.setHSL(trips.color.h, trips.color.s, trips.color.l);
    for (let i = 0; i < trips.dataObj.length; i++) {
        let textLoader = new THREE.TextureLoader();
        let spriteText = textLoader.load("./resources/textures/agent.png");
        spriteText.minFilter = THREE.LinearFilter;

        var spriteMaterial = new THREE.SpriteMaterial({
            map: spriteText,
            transparent: true,
        });

        var sprite = new THREE.Sprite(spriteMaterial);

        sprite.material.color = color;
        sprite.material.blending = THREE.AdditiveBlending;
        sprite.material.transparent = true;

        sprite.scale.set(scale, scale, scale);
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

export const _loadOBJmodel = async (url) => {
    console.log("start obj model load...");
    return new Promise((resolve) => {
        new OBJLoader().load(url, resolve);
    }).then((result) => {
        return result;
    });
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

    loader.load("./resources/textures/floor/WOOD_SML.jpg", function (texture) {
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
            roughness: 0.5,
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
