import * as THREE from "three";

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
