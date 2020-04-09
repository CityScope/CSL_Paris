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

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log(this.scene.children, this.props.menuInteraction);
            let prevMenu = prevProps.menuInteraction;
            let thisMenu = this.props.menuInteraction;
            let parks_before = this.scene.getObjectByName("parks_before");
            let parks_after = this.scene.getObjectByName("parks_after");
            let cultural_before = this.scene.getObjectByName("cultural_before");
            let cultural_after = this.scene.getObjectByName("cultural_after");

            if (prevMenu.scenarioSwitch !== thisMenu.scenarioSwitch) {
                if (prevMenu.quality !== thisMenu.quality) {
                    this.setState({ renderer: thisMenu.quality });
                }

                if (thisMenu.scenarioSwitch) {
                    _objectDisplay(parks_before, true);
                    _objectDisplay(cultural_before, true);
                    _objectDisplay(parks_after, false);
                    _objectDisplay(cultural_after, false);
                } else {
                    _objectDisplay(parks_before, true);
                    _objectDisplay(cultural_before, true);
                    _objectDisplay(parks_after, true);
                    _objectDisplay(cultural_after, true);
                }
            }

            if (prevMenu.parks !== thisMenu.parks) {
                if (prevMenu.parks) {
                    _objectDisplay(parks_before, true);
                    _objectDisplay(parks_after, true);
                } else {
                    _objectDisplay(parks_before, false);
                    _objectDisplay(parks_after, false);
                }
            }

            if (prevMenu.culturalBuildings !== thisMenu.culturalBuildings) {
                if (prevMenu.culturalBuildings) {
                    _objectDisplay(cultural_before, true);
                    _objectDisplay(cultural_after, true);
                } else {
                    _objectDisplay(cultural_before, false);
                    _objectDisplay(cultural_after, false);
                }
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
        _blockCamera(this.camera);
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
                                  height: "100vh",
                                  backgroundColor: "black",
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
