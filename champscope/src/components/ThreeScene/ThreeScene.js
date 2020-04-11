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
    _blockCamera,
    _setupAgents,
    _handelCityModel,
    _landscapeModelsLoader,
    _addCustomSceneObjects,
    _pplLoader,
    _objectDisplay,
} from "./ThreeUtils";
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
            renderer: true,
            past: true,
        };
        this.theta = 0;
        this.cameraSpeed = 0.5;
        this.radius = 2;
    }

    componentDidMount() {
        // get the div dims on init

        this.width = this.mountingDiv.clientWidth;
        this.height = this.mountingDiv.clientHeight;
        window.addEventListener("resize", this.handleWindowResize);
        // start the app setup

        setTimeout(() => {
            this._init();
        }, 500);
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
                await _handelCityModel().then((model) => this.scene.add(model)),

                // load other street models
                await _landscapeModelsLoader().then((model) => {
                    this.scene.add(model);
                }),
                // floor
                await _createFloor(this.renderer).then((floor) => {
                    this.scene.add(floor);
                }),
                //  load the rest of the scene
                await _addCustomSceneObjects().then((pedestalMesh) =>
                    this.scene.add(pedestalMesh)
                ),
                // load the public
                await _pplLoader().then((ppl) => this.scene.add(ppl)),

                // setup agents
                await _setupAgents().then((agentWrapper) => {
                    this.agentWrapper = agentWrapper;
                    this.scene.add(this.agentWrapper);
                })
            )
            .then(
                this.setState({ loading: false }),
                this.props.setLoadingState(this.state.loading),

                //  start the animation
                this.startAnimationLoop()
            );
    };

    _sceneSetup = async () => {
        this.scene = new THREE.Scene();
        this.scene.dispose();
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

        this.renderer.dispose();
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.setSize(this.width, this.height);
        this.mountingDiv.appendChild(this.renderer.domElement);

        /**
         * Lights
         */

        let whiteLight = new THREE.PointLight(0xffffff, 0.05, 100);
        whiteLight.name = "whiteLight";
        whiteLight.position.set(0, 5, 0);
        //
        let orangeLight = new THREE.PointLight(0xf26101, 0.5, 100);
        orangeLight.name = "orangeLight";
        orangeLight.position.set(-1, 2, -1);
        orangeLight.castShadow = true;
        orangeLight.shadow.radius = 2;
        //
        let blueLight = new THREE.PointLight(0x0071bc, 0.5, 100);
        blueLight.name = "blueLight";
        blueLight.position.set(1, 2, 1);
        blueLight.castShadow = true;
        blueLight.shadow.radius = 2;

        //
        this.lightsWrapper = new THREE.Object3D();
        this.lightsWrapper.name = "lightsWrapper";
        this.lightsWrapper.add(whiteLight, orangeLight, blueLight);

        this.scene.add(this.lightsWrapper);

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

    _animateAgents = () => {
        const time = this.state.timeCounter;
        this.agentWrapper.children.forEach((tripsObject) => {
            for (let i = 0; i < tripsObject.trips.length; i++) {
                if (tripsObject.trips[i].path[time]) {
                    let pnt = tripsObject.trips[i].path[time];
                    let agent = tripsObject.children[i];
                    agent.position.set(pnt[0], 0.705, pnt[1]);
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

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log(this.props);

            let {
                scenarioSwitch,
                parks,
                culturalBuildings,
                cars,
                bicycles,
                pedestrians,
                quality,
            } = this.props.menuInteraction;
            let trips_car_before = this.scene.getObjectByName(
                "trips_car_before"
            );
            let trips_car_after = this.scene.getObjectByName("trips_car_after");
            let trips_pedestrians_before = this.scene.getObjectByName(
                "trips_pedestrians_before"
            );
            let trips_pedestrians_after = this.scene.getObjectByName(
                "trips_pedestrians_after"
            );
            let trips_bike_before = this.scene.getObjectByName(
                "trips_bike_before"
            );
            let trips_bike_after = this.scene.getObjectByName(
                "trips_bike_after"
            );
            let parks_before = this.scene.getObjectByName("parks_before");
            let parks_after = this.scene.getObjectByName("parks_after");
            let cultural_before = this.scene.getObjectByName("cultural_before");
            let cultural_after = this.scene.getObjectByName("cultural_after");

            _objectDisplay(parks_before, parks);
            _objectDisplay(parks_after, scenarioSwitch && parks);
            _objectDisplay(cultural_before, culturalBuildings);
            _objectDisplay(cultural_after, scenarioSwitch && culturalBuildings);
            _objectDisplay(trips_car_before, !scenarioSwitch && cars);
            _objectDisplay(trips_car_after, scenarioSwitch && cars);
            _objectDisplay(trips_bike_before, !scenarioSwitch && bicycles);
            _objectDisplay(trips_bike_after, scenarioSwitch && bicycles);
            _objectDisplay(
                trips_pedestrians_before,
                !scenarioSwitch && pedestrians
            );
            _objectDisplay(
                trips_pedestrians_after,
                scenarioSwitch && pedestrians
            );

            this.setState({ renderer: quality });
            let cityModel = this.scene.getObjectByName("cityModel");
            // lights intensity
            let blueLight = this.scene.getObjectByName("blueLight");
            let orangeLight = this.scene.getObjectByName("orangeLight");
            // if low quality render
            if (!quality) {
                _objectDisplay(cityModel, false);
                blueLight.intensity = 2;
                orangeLight.intensity = 2;
            } else {
                // higher qulaity
                _objectDisplay(cityModel, true);
                blueLight.intensity = 0.5;
                orangeLight.intensity = 0.5;
            }
        }
    }

    _chooseRenderer = () => {
        if (this.state.renderer) {
            this.bloomComposer.render();
            this.finalComposer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    };

    startAnimationLoop = () => {
        this._animateAgents();

        if (this.props.menuInteraction.animateCamera) {
            this.theta += this.cameraSpeed;
            this.camera.position.x =
                this.radius * Math.sin(THREE.MathUtils.degToRad(this.theta));
            this.camera.position.y = 1.5;
            this.camera.position.z =
                this.radius * Math.cos(THREE.MathUtils.degToRad(this.theta));
            this.camera.lookAt(this.scene.position);
            this.camera.updateMatrixWorld();
        } else {
            _blockCamera(this.camera);
        }

        this._chooseRenderer();

        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    render() {
        let displayTHREEscene = true;
        // this.props.startScene;

        return (
            <React.Fragment>
                <div
                    style={
                        displayTHREEscene
                            ? {
                                  height: "100%",
                                  position: "fixed",
                                  width: "100%",
                                  top: 0,
                                  left: 0,
                                  backgroundColor: "black",
                                  visibility: "",
                              }
                            : {
                                  height: "100%",
                                  width: "100%",
                                  position: "fixed",

                                  top: 0,
                                  left: 0,
                                  backgroundColor: "black",
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
