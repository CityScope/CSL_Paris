// ! https://github.com/mrdoob/three.js/blob/master/examples/css3d_youtube.html
// ! https://codesandbox.io/s/81qjyxonm8
// ! https://github.com/mrdoob/three.js/pull/17505
// ! https://codepen.io/pen/?editors=0010
// ! Good structure:
// ! https://codesandbox.io/s/mjp143zq9x?from-embed
// ! materials https://codepen.io/bartuc/pen/eEbmvJ?editors=0010
// ! Bloom https://jsfiddle.net/yp2t6op6/3/
// ! https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocesnsing_unreal_bloom_selective.html
// ! https://stackoverflow.com/questions/47922923/ceiling-lights-effect-using-three-js

import React, { Component } from "react";
import * as THREE from "three";
import {
    _setupBloom,
    _createFloor,
    _loadOBJmodel,
    _blockCamera,
    _setupAgents,
} from "./utils";
import OrbitControls from "three-orbitcontrols";
import trips_car from "../../trips/trips_car_before.json";
import trips_people from "../../trips/trips_people_before.json";
import trips_bike from "../../trips/trips_bike_before.json";

export default class ThreeScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeCounter: 0,
            simSpeed: 1,
            trips: {},
        };
        this.simulationDuration = 50;
        this.cityModelURL = "./resources/model/champ.obj";
        this.landscapeModels = {
            parks_before: "./resources/model/champ.obj",
            parks_after: "./resources/model/champ.obj",
            cultural_before: "./resources/model/champ.obj",
            cultural_after: "./resources/model/champ.obj",
        };

        this.trips = {
            cars: { dataObj: trips_car, color: { h: 1, s: 1, l: 0.5 } },
            poeple: { dataObj: trips_people, color: { h: 0, s: 0, l: 0.8 } },
            bike: { dataObj: trips_bike, color: { h: 0.3, s: 1, l: 0.5 } },
        };

        this.style = {
            height: "100vh",
        };
    }

    componentDidMount() {
        // get the div dims on init
        this.width = this.mountingDiv.clientWidth;
        this.height = this.mountingDiv.clientHeight;
        window.addEventListener("resize", this.handleWindowResize);
        // start the app setup
        this._init();
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.requestID);
        window.removeEventListener("resize", this.handleWindowResize);
    }

    _init = async () => {
        this.shpContainer = new THREE.Object3D();
        this._sceneSetup().then(
            // load urban model
            await _loadOBJmodel(this.cityModelURL).then((model) => {
                this._handelModel(model);
                console.log("city model loaded!");
            }),
            // load other street models
            // await this._landscapeModelsLoader(),
            // load the rest of the scene
            this._addCustomSceneObjects(),

            // start the animation
            this.startAnimationLoop()
        );
    };

    _landscapeModelsLoader = async () => {
        for (const modelUrl in this.landscapeModels) {
            console.log(modelUrl);

            // load other models
            await _loadOBJmodel(this.landscapeModels[modelUrl]).then(
                (model) => {
                    console.log(model);
                }
            );
        }
    };

    _handelModel = (model) => {
        let modelMaterial = this.modelMaterial;
        model.scale.set(0.000505, 0.000505, 0.000505);
        model.position.set(-0.0055, 0.7, 0);
        model.rotation.set(0, 0.4625123, 0);
        model.traverse(function (child) {
            // child.castShadow = true;
            child.material = modelMaterial;
        });
        this.scene.add(model);
    };

    _sceneSetup = async () => {
        this.scene = new THREE.Scene();
        // camera
        this.camera = new THREE.PerspectiveCamera(
            50,
            this.width / this.height,
            0.01,
            1000
        );
        this.camera.position.z = 0;
        this.camera.position.x = 0;
        this.camera.position.y = 4;
        this.controls = new OrbitControls(this.camera, this.mountingDiv);
        this.controls.maxDistance = 6;
        this.controls.minDistance = 1.5;
        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.setSize(this.width, this.height);
        this.mountingDiv.appendChild(this.renderer.domElement);

        /**
         * Lights
         */

        let ambLight = new THREE.PointLight(0xffffff, 0.05, 100);
        ambLight.position.set(0, 5, 0);
        //
        let light = new THREE.PointLight(0xf26101, 0.5, 100);
        light.position.set(-1, 2, -1);
        light.castShadow = true;
        light.shadow.radius = 2;
        //
        let light2 = new THREE.PointLight(0x0071bc, 0.5, 100);
        light2.position.set(1, 2, 1);
        light2.castShadow = true;
        light2.shadow.radius = 2;

        this.scene.add(ambLight, light, light2);

        // global model material
        this.modelColor = new THREE.Color();
        this.modelColor.setHSL(0, 0, 0.3);
        this.modelMaterial = new THREE.MeshPhongMaterial({
            color: this.modelColor,
        });

        /*
            BLOOM
        */
        let postEffect = _setupBloom(
            this.width,
            this.height,
            this.scene,
            this.camera,
            this.renderer
        );
        this.bloomComposer = postEffect.bloomComposer;
        this.finalComposer = postEffect.finalComposer;
    };

    _addCustomSceneObjects = () => {
        console.log("Start scene objects...");

        _createFloor(this.renderer, this.scene);
        /**
         * The model pedestal
         */
        var pedestalTexture = new THREE.TextureLoader().load(
            "./resources/textures/shadowmap.png"
        );
        var topModelMaterial = new THREE.MeshPhongMaterial({
            map: pedestalTexture,
            color: this.modelColor,
        });
        // 6 sides material for pedestal
        let materialArray = [
            this.modelMaterial,
            this.modelMaterial,
            topModelMaterial,
            this.modelMaterial,
            this.modelMaterial,
            this.modelMaterial,
        ];
        // fix scaling issue
        pedestalTexture.minFilter = THREE.LinearFilter;
        const cubeGeo = new THREE.BoxBufferGeometry(1.57, 0.7, 0.92);
        cubeGeo.translate(0, 0.35, 0);
        const pedestalMesh = new THREE.Mesh(cubeGeo, materialArray);
        pedestalMesh.castShadow = true;
        pedestalMesh.receiveShadow = true;
        this.scene.add(pedestalMesh);

        this.agentsWrapper = new THREE.Object3D();
        for (const trip in this.trips) {
            let thisTripsAgents = _setupAgents(this.trips[trip]);
            thisTripsAgents.name = trip;
            thisTripsAgents.trips = this.trips[trip].dataObj;
            this.agentsWrapper.add(thisTripsAgents);
        }
        this.scene.add(this.agentsWrapper);

        console.log("..done adding items to scene!");
    };

    _animateAgents = () => {
        const time = this.state.timeCounter;

        this.agentsWrapper.children.forEach((tripsObject) => {
            for (let i = 0; i < tripsObject.trips.length; i++) {
                if (tripsObject.trips[i].path[time]) {
                    let pnt = tripsObject.trips[i].path[time];
                    let agent = tripsObject.children[i];
                    agent.position.set(pnt[0], 0.702, pnt[1]);
                }
            }
        });

        this.setState({
            timeCounter:
                this.state.timeCounter < this.simulationDuration
                    ? this.state.timeCounter + this.state.simSpeed
                    : 0,
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
        this._animateAgents();
        _blockCamera(this.camera);

        this.bloomComposer.render();
        this.finalComposer.render();
        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    render() {
        return (
            <div
                style={this.style}
                ref={(div) => (this.mountingDiv = div)}
            ></div>
        );
    }
}
