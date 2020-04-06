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
// ! Glow https://stemkoski.github.io/Three.js/Shader-Glow.html

import React, { Component } from "react";
import { setLoadingState } from "../../redux/actions";
import { connect } from "react-redux";
import * as THREE from "three";

import {
    _setupBloom,
    _createFloor,
    _loadOBJmodel,
    _blockCamera,
    _setupAgents,
    _loadTexture,
} from "./utils";
import OrbitControls from "three-orbitcontrols";
import * as settings from "../../settings.json";

class ThreeScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            timeCounter: 0,
            simSpeed: 1,
            trips: {},
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
        this._sceneSetup()
            .then(
                // load urban model
                await _loadOBJmodel(settings.cityModelURL).then((model) => {
                    this._handelCityModel(model);
                }),

                // setup agents
                await _setupAgents().then((agentWrapper) => {
                    this.agentWrapper = agentWrapper;
                    this.scene.add(this.agentWrapper);
                }),
                // load other street models
                await this._landscapeModelsLoader(),

                await _createFloor(this.renderer).then((floor) => {
                    this.scene.add(floor);
                }),
                //  load the rest of the scene
                await this._addCustomSceneObjects(),

                await this._pplLoader(),

                //  start the animation
                this.startAnimationLoop()
            )
            .then(
                this.setState({ loading: false }),
                this.props.setLoadingState(this.state.loading),
                console.log(this.scene.children)
            );
    };

    _pplLoader = async () => {
        for (const modelUrl in settings.pplModel) {
            let URL = settings.pplModel[modelUrl];

            let pplCol = new THREE.Color();
            pplCol.setHSL(0, 0, 0.2);
            let pplMaterial = new THREE.MeshLambertMaterial({
                color: pplCol,
            });

            // load other models
            await _loadOBJmodel(URL).then((model) => {
                model.name = modelUrl;
                model.traverse(function (child) {
                    child.material = pplMaterial;
                    child.castShadow = true;
                });

                this.scene.add(model);
            });
        }
    };

    _landscapeModelsLoader = async () => {
        this.landscapeModelsWrapper = new THREE.Object3D();
        for (const modelUrl in settings.landscapeModels) {
            let URL = settings.landscapeModels[modelUrl];

            // load other models
            await _loadOBJmodel(URL).then((model) => {
                model.name = modelUrl;
                this._handelLandscapeModel(model);
            });
        }
    };

    _handelLandscapeModel = (model) => {
        let parksCol = new THREE.Color();
        parksCol.setHSL(0.25, 1, 0.5);
        let parksMaterial = new THREE.MeshPhongMaterial({
            color: parksCol,
        });
        let cultureCol = new THREE.Color();
        cultureCol.setHSL(0.6, 1, 0.5);
        let cultureMaterial = new THREE.MeshPhongMaterial({
            color: cultureCol,
        });
        model.scale.set(0.000505, 0.000505, 0.000505);
        model.rotation.set(0, 0.4625123, 0);
        model.traverse(function (child) {
            if (model.name === "parks_before" || model.name === "parks_after") {
                child.position.set(0.09, 0.701, 0.01);

                child.material = parksMaterial;
            } else {
                child.position.set(0.09, 0.705, 0.01);

                child.material = cultureMaterial;
            }
        });

        this.scene.add(model);
    };

    _handelCityModel = (model) => {
        let modelMaterial = this.modelMaterial;
        model.name = "cityModel";
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
        this.renderer.setPixelRatio(window.devicePixelRatio);

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
        this.modelColor.setHSL(0, 0, 0.5);
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

    _addCustomSceneObjects = async () => {
        console.log("Start scene objects...");

        /**
         * The model pedestal
         */

        var pedestalTexture = await _loadTexture(
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
        pedestalMesh.name = "pedestalMesh";
        this.scene.add(pedestalMesh);
    };

    _animateAgents = () => {
        const time = this.state.timeCounter;
        this.agentWrapper.children.forEach((tripsObject) => {
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
                this.state.timeCounter < settings.simulationDuration
                    ? this.state.timeCounter + this.state.simSpeed
                    : 0,
        });
    };

    handleWindowResize = () => {
        const width = this.mountingDiv.clientWidth;
        const height = this.mountingDiv.clientHeight;
        this.renderer.setSize(width, height);
        this.bloomComposer.setSize(width, height);
        this.finalComposer.setSize(width, height);

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    };

    startAnimationLoop = () => {
        if (!this.state.loading && this.props.startScene) {
            this._animateAgents();
            _blockCamera(this.camera);
            this.bloomComposer.render();
            this.finalComposer.render();
        }
        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    render() {
        let startScene = this.props.startScene;

        return (
            <React.Fragment>
                <div
                    style={
                        startScene === true
                            ? {
                                  height: "100vh",
                              }
                            : {
                                  height: "100vh",
                                  visibility: "hidden",
                              }
                    }
                    ref={(div) => (this.mountingDiv = div)}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        startScene: state.START_SCENE,
    };
};

const mapDispatchToProps = {
    setLoadingState: setLoadingState,
};

export default connect(mapStateToProps, mapDispatchToProps)(ThreeScene);
