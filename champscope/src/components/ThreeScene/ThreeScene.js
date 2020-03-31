import React, { Component } from "react";
import * as THREE from "three";
import { _createFloor } from "./utils";
import OrbitControls from "three-orbitcontrols";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

//
import trips_car from "../../trips/trips_car.json";
// import trips_people from "../../trips/trips_people.json";

// ! https://codesandbox.io/s/81qjyxonm8
// ! https://github.com/mrdoob/three.js/pull/17505
// ! https://codepen.io/pen/?editors=0010
// ! Good structure:
// ! https://codesandbox.io/s/mjp143zq9x?from-embed
// ! materials https://codepen.io/bartuc/pen/eEbmvJ?editors=0010

// ! Bloom https://jsfiddle.net/yp2t6op6/3/
// ! https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_unreal_bloom_selective.html
// ! https://stackoverflow.com/questions/47922923/ceiling-lights-effect-using-three-js

const style = {
    height: "100vh"
};
export default class ThreeScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeCounter: 0,
            simSpeed: 1
        };
        this.simulationDuration = 50;
    }

    componentDidMount() {
        /**
         * call the THREE setup with the
         * ref'ed div that REACT renders
         */
        this._sceneSetup();
        this._addCustomSceneObjects();
        this._addAgents(trips_car, "red");
        this.startAnimationLoop();

        window.addEventListener("resize", this.handleWindowResize);
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.requestID);
        window.removeEventListener("resize", this.handleWindowResize);
    }

    _sceneSetup = () => {
        const width = this.mountingDiv.clientWidth;
        const height = this.mountingDiv.clientHeight;
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.01,
            1000
        );
        this.camera.position.z = 0;
        this.camera.position.x = 0;
        this.camera.position.y = 4;
        this.controls = new OrbitControls(this.camera, this.mountingDiv);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;

        this.renderer.setSize(width, height);
        this.mountingDiv.appendChild(this.renderer.domElement);

        /**
         * Lights
         */

        let ambLight = new THREE.PointLight(0xffffff, 0.1, 100);
        ambLight.position.set(0, 5, 0);

        let light = new THREE.PointLight(0xf26101, 0.5, 100);
        light.position.set(-1, 2, -1);
        light.castShadow = true;
        light.shadow.radius = 2;

        let light2 = new THREE.PointLight(0x0071bc, 0.5, 100);
        light2.position.set(1, 2, 1);
        light2.castShadow = true;
        light2.shadow.radius = 2;

        this.scene.add(ambLight, light, light2);

        this._loadOBJmodel(this.scene);
    };

    _loadOBJmodel = scene => {
        var loader = new OBJLoader();
        loader.load(
            "./resources/model/champ.obj",
            function(model) {
                model.scale.set(0.000505, 0.001, 0.000505);
                model.position.set(-0.0055, 0.7, 0);
                model.rotation.set(0, 0.4625123, 0);
                // model.traverse(function(child) {
                //     child.castShadow = true;
                // });
                scene.add(model);
            },
            function(error) {
                console.log(error);
            }
        );
    };

    _addCustomSceneObjects = async () => {
        _createFloor(this.renderer, this.scene);
        /**
         * The model pedestal
         */
        var phongMat = new THREE.MeshPhongMaterial();

        var pedestalTexture = new THREE.TextureLoader().load(
            "./resources/textures/shadowmap.png"
        );
        var pedestalModelMaterial = new THREE.MeshPhongMaterial({
            map: pedestalTexture
        });

        // 6 sides material for pedestal
        let materialArray = [
            phongMat,
            phongMat,

            pedestalModelMaterial,
            phongMat,
            phongMat,
            phongMat
        ];

        // fix scaling issue
        pedestalTexture.minFilter = THREE.LinearFilter;
        const cubeGeo = new THREE.BoxBufferGeometry(1.57, 0.7, 0.92);
        cubeGeo.translate(0, 0.35, 0);
        const pedestalMesh = new THREE.Mesh(cubeGeo, materialArray);
        pedestalMesh.castShadow = true;
        pedestalMesh.receiveShadow = true;
        this.scene.add(pedestalMesh);
    };

    _addAgents = (trips, color) => {
        this.agentsDummy = new THREE.Object3D();
        this.count = trips.length;

        let agentScale = 0.005;
        var geometry = new THREE.BoxBufferGeometry(
            agentScale,
            agentScale,
            agentScale
        );
        var material = new THREE.MeshBasicMaterial({ color: color });
        this.agents = new THREE.InstancedMesh(geometry, material, this.count);

        /*
        let textLoader = new THREE.TextureLoader();
        let spriteText = textLoader.load("./resources/textures/agent.png");
        var spriteMaterial = new THREE.SpriteMaterial({
            map: spriteText,
            transparent: true
        });

        var pplSprite = new THREE.Sprite(spriteMaterial);
        // pplSprite.material.color.setHex(colorByNation(grp[person].N));
        pplSprite.material.blending = THREE.AdditiveBlending;
        pplSprite.material.transparent = true;
        pplSprite.scale.set(5, 5, 5);
  this.agents = new THREE.InstancedMesh(
            pplSprite,
            spriteMaterial,
            this.count
        );

        */

        this.agents.rotation.set(0, 0.4625123, 0);
        let pos = this._agentsPos();
        this.agents.position.set(pos[0], 0, pos[1]);
        this.agents.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
        this.scene.add(this.agents);
    };

    _agentsPos = () => {
        return [
            -(Math.cos(0.4625123) * 822) / 2000 - 1.57 / 2,
            (Math.sin(0.4625123) * 822) / 2000 - 0.92 / 2
        ];
    };

    _animateAgents = myTrips => {
        const time = this.state.timeCounter;

        for (var i = 0; i < myTrips.length; i++) {
            if (myTrips[i].timestamps[time]) {
                let pnt = myTrips[i].path[time];
                this.agentsDummy.position.x = pnt[0];
                this.agentsDummy.position.y = 0.7;
                this.agentsDummy.position.z = pnt[1];
                // put a clone of obj in each place holder
                this.agentsDummy.updateMatrix();
                this.agents.setMatrixAt(i, this.agentsDummy.matrix);
            }
        }
        this.agents.instanceMatrix.needsUpdate = true;

        this.setState({
            timeCounter:
                this.state.timeCounter < this.simulationDuration
                    ? this.state.timeCounter + this.state.simSpeed
                    : 0
        });
    };

    handleWindowResize = () => {
        const width = this.mountingDiv.clientWidth;
        const height = this.mountingDiv.clientHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    };

    startAnimationLoop = () => {
        this._animateAgents(trips_car);
        this.renderer.render(this.scene, this.camera);

        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    render() {
        return <div style={style} ref={div => (this.mountingDiv = div)}></div>;
    }
}
