import React, { Component } from "react";
import * as THREE from "three";

import OrbitControls from "three-orbitcontrols";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import trips_car from "../../trips/trips_car.json";
import trips_people from "../../trips/trips_people.json";
import { geoMercator } from "d3-geo";

// ! https://codesandbox.io/s/81qjyxonm8
// ! https://github.com/mrdoob/three.js/pull/17505
// ! https://codepen.io/pen/?editors=0010
// ! Good structure:
// ! https://codesandbox.io/s/mjp143zq9x?from-embed
// ! materials https://codepen.io/bartuc/pen/eEbmvJ?editors=0010

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
        this._addAgents(trips_car,"red");
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
            35,
            window.innerWidth / window.innerHeight,
            0.01,
            100000
        );
        this.camera.position.z = 0;
        this.camera.position.x = 0;
        this.camera.position.y = 5;
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

        //this._loadOBJmodel(this.scene);
    };

    _loadOBJmodel = scene => {
        var loader = new OBJLoader();
        loader.load(
            "./resources/model/champ.obj",
            function(model) {
                model.scale.set(0.001, 0.001, 0.001);
                model.position.set(0, 1, 0);
                model.rotation.set(0, 0.4625123, 0);
                scene.add(model);
            },
            function(error) {
                console.log(error);
            }
        );
    };

    _createFloor = () => {
        // Create a floor.
        var loader = new THREE.TextureLoader();
        let renderer = this.renderer;
        let scene = this.scene;
        loader.load("./resources/textures/floor/WOOD.jpg", function(texture) {
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

            var displace = loader.load(
                "./resources/textures/floor/WOOD_DISP.jpg"
            );
            displace.anisotropy = renderer.capabilities.getMaxAnisotropy();
            displace.wrapS = THREE.RepeatWrapping;
            displace.wrapT = THREE.RepeatWrapping;
            displace.repeat.set(repeatX, repeatY);

            var spec = loader.load("./resources/textures/floor/REFL.jpg");
            spec.anisotropy = renderer.capabilities.getMaxAnisotropy();
            spec.wrapS = THREE.RepeatWrapping;
            spec.wrapT = THREE.RepeatWrapping;
            spec.repeat.set(repeatX, repeatY);

            texture.minFilter = THREE.LinearFilter;
            displace.minFilter = THREE.LinearFilter;

            var material = new THREE.MeshStandardMaterial({
                aoMap: ao,
                aoMapIntensity: 0.5,
                color: 0xffffff,
                map: texture,
                metalnessMap: texture,
                displacementMap: displace,
                normalMap: normal,
                metalness: 0.5,
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

            scene.add(planeMesh);
        });
    };

    _addCustomSceneObjects = async () => {
        // load the model
        // ! should consider https://tinyurl.com/wqpozgh
        this._createFloor();
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
        const pedestalMesh = new THREE.Mesh(cubeGeo, materialArray);
        pedestalMesh.castShadow = true;
        pedestalMesh.receiveShadow = true;
        pedestalMesh.position.set(0, 0.35, 0);
        //pedestalMesh.rotation.set(0, -0.4625123, 0);
        this.scene.add(pedestalMesh);
    };

    _addAgents = (_trips,_color) => {
        this.agentsContainer = new THREE.Object3D();
        this.count = _trips.length;
        let agentScale = 0.01;
        this.agentsDummy = new THREE.Object3D();
        var geometry = new THREE.BoxBufferGeometry(
            agentScale,
            agentScale,
            agentScale
        );
        var material = new THREE.MeshBasicMaterial({ color: _color });
        this.agents = new THREE.InstancedMesh(geometry, material, this.count);
        this.agents.rotateY(0.4625123);
        this.agents.position.set(-(Math.cos(0.4625123)*822)/2000 - 1.57/2,0.0,(Math.sin(0.4625123)*822)/2000-0.92/2);
        this.agents.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
        this.scene.add(this.agents);
        //FIXME: Not sure here if we want a container of agent or just push agents.
        //this.agentsContainer.add(this.agents);
        //this.scene.add(this.agentsContainer);
        //FIXME: Do we want to call the animation here as it's already called in startAnimationLoop
        //this._animateAgents(_trips);
    };

    _animateAgents = (_myTrips) => {
        const time = this.state.timeCounter;

        for (var i = 0; i < _myTrips.length; i++) {
            if (_myTrips[i].timestamps[time]) {
                //let pnt = this._meractorProj(trips[i].path[time]);
                let pnt = _myTrips[i].path[time];
                this.agentsDummy.position.x = pnt[0];//-0.85;
                this.agentsDummy.position.y = 0.7;
                this.agentsDummy.position.z = pnt[1];//-0.72;
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

    /**
     * solves projections issues
     *! https://stackoverflow.com/questions/29761062/d3-mercator-geo-and-path-methods
     */
    _meractorProj = pnt => {
        let mer = geoMercator()
            .scale(5000)
            .rotate([0, 0, 18])
            .translate([1529.6, 4585.6]);

        let res = mer(pnt);
        // console.log(res);

        return [res[0], res[1]];
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
