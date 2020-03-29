import React, { Component } from "react";
import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import trips from "./resources/trips/trips.json";

// ! https://codesandbox.io/s/81qjyxonm8
// ! https://github.com/mrdoob/three.js/pull/17505
// ! https://codepen.io/pen/?editors=0010

// ! Good structure:
// ! https://codesandbox.io/s/mjp143zq9x?from-embed

const style = {
    height: "100vh"
};
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeCounter: 0,
            agentsYheight: 1.1,
            simSpeed: 1
        };

        this.simulationDuration = 50;
    }

    componentDidMount() {
        console.log(trips);

        /**
         * call the THREE setup with the
         * ref'ed div that REACT renders
         */
        this._sceneSetup();
        this._addCustomSceneObjects();
        this._addAgents();
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
        // this.camera = new THREE.PerspectiveCamera(
        //     45,
        //     window.innerWidth / window.innerHeight,
        //     0.1,
        //     100000
        // );
        // this.camera.position.z = 3;
        // this.camera.position.x = 2;
        // this.camera.position.y = 3;

        this.camera = new THREE.PerspectiveCamera(
            0.1,
            window.innerWidth / window.innerHeight,
            1,
            100000
        );
        this.camera.position.z = 0;
        this.camera.position.x = 0;
        this.camera.position.y = 2000;

        this.controls = new OrbitControls(this.camera, this.mountingDiv);

        // this.camera.position.set(4192079, 4800600, 254663);
        // this.controls.target.set(4192060, 4800600, 254650);
        // this.controls.update();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(width, height);
        this.mountingDiv.appendChild(this.renderer.domElement);
        let light = new THREE.PointLight(0xf26101, 0.5, 100);
        light.position.set(-1, 2, -1);
        light.castShadow = true;
        let light2 = new THREE.PointLight(0x0071bc, 0.5, 100);
        light2.position.set(1, 2, 1);
        light2.castShadow = true;
        this.scene.add(light, light2);

        this._loadOBJmodel(this.scene);
    };

    _loadOBJmodel = scene => {
        var loader = new OBJLoader();
        loader.load(
            "./model/champ.obj",
            function(model) {
                model.scale.set(0.001, 0.001, 0.001);
                model.position.set(0, 1, 0);
                model.rotation.set(0, 0.4625123, 0);
                model.traverse(function(child) {
                    child.castShadow = true;
                });
                scene.add(model);
            },
            function(xhr) {
                // console.log(xhr.loaded);
            },
            function(error) {
                console.log(error);
            }
        );
    };

    _addCustomSceneObjects = async () => {
        // load the model
        // ! should consider https://tinyurl.com/wqpozgh

        const planeSize = 100;
        const planeMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(planeSize, planeSize),
            new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide
            })
        );
        planeMesh.receiveShadow = true;
        planeMesh.rotation.x = Math.PI * -0.5;
        planeMesh.position.y = 0;
        const cubeGeo = new THREE.BoxBufferGeometry(3.5, 1, 2);
        const cubeMat = new THREE.MeshPhongMaterial({ color: "#FFF" });
        const pedestalMesh = new THREE.Mesh(cubeGeo, cubeMat);
        pedestalMesh.castShadow = true;
        pedestalMesh.receiveShadow = true;
        pedestalMesh.position.set(0, 0.5, 0);
        this.scene.add(planeMesh, pedestalMesh);
    };

    _addAgents = () => {
        this.agentsContainer = new THREE.Object3D();
        this.agentsContainer.rotation.set(0, -1.75, 0);
        this.agentsContainer.scale.set(0.4, 0.4, 0.4);
        this.agentsContainer.position.set(0, 1.1, -0.95);
        this.count = trips.length;
        let agentScale = 0.025;
        this.agentsDummy = new THREE.Object3D();
        var geometry = new THREE.BoxBufferGeometry(
            agentScale,
            agentScale,
            agentScale
        );
        var material = new THREE.MeshBasicMaterial({ color: "yellow" });
        this.agents = new THREE.InstancedMesh(geometry, material, this.count);
        this.agents.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
        this.agentsContainer.add(this.agents);
        this.scene.add(this.agentsContainer);
        this._animateAgents();
    };

    _animateAgents = () => {
        const time = this.state.timeCounter;

        for (var i = 0; i < trips.length; i++) {
            if (trips[i].timestamps[time]) {
                let posVector = this._calcPosFromLatLonRad(trips[i].path[time]);
                this.agentsDummy.position.copy(posVector);
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

    // ! https://stackoverflow.com/questions/28365948/javascript-latitude-longitude-to-xyz-position-on-earth-threejs
    _calcPosFromLatLonRad = cor => {
        let lat = cor[0];
        let lon = cor[1];
        // lat = Math.random() * 180 - 90;
        // lon = Math.random() * 260 - 180;
        var cosLat = Math.cos((lat * Math.PI) / 180.0);
        var sinLat = Math.sin((lat * Math.PI) / 180.0);
        var cosLon = Math.cos((lon * Math.PI) / 180.0);
        // var sinLon = Math.sin((lon * Math.PI) / 180.0);
        // var worldRadius = 6378137.0;
        let worldRadius = 10000;
        /**
         * 
         * f   the "flattening" parameter ( = (a-b)/a ,the ratio of the
                 difference between the equatorial and polar radii to a;
                this is a measure of how "elliptical" a polar cross-section
                is).
        */
        var f = 1.0 / 298.257224;
        var C =
            1.0 /
            Math.sqrt(cosLat * cosLat + (1 - f) * (1 - f) * sinLat * sinLat);
        var S = (1.0 - f) * (1.0 - f) * C;
        var h = 0.0;
        let res = new THREE.Vector3(
            (worldRadius * C + h) * cosLat * cosLon - 6570,
            0,
            // (worldRadius * C + h) * cosLat * sinLon,
            (worldRadius * S + h) * sinLat - 400
        );
        // console.log(res);

        return res;
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
        this.renderer.render(this.scene, this.camera);
        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    render() {
        return <div style={style} ref={div => (this.mountingDiv = div)}></div>;
    }
}
