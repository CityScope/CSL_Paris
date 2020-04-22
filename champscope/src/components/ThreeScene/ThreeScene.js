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
import TWEEN from "@tweenjs/tween.js";

import {
    _setupBloom,
    _addMetricsObject,
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
            renderer: false,
            past: true,
            camLookAt: new THREE.Vector3(0, 1.25, 0),
        };
        this.theta = 0;
        this.cameraSpeed = 0.5;
        this.radius = 2.5;
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

                //  load the rest of the scene
                await _addMetricsObject().then((metricsObject) =>
                    this.scene.add(metricsObject)
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
                //
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
        this.camera.position.z = -4;
        this.camera.position.x = 0;
        this.camera.position.y = 2;

        this.controls = new OrbitControls(this.camera, this.mountingDiv);
        this.controls.maxDistance = 7;
        this.controls.minDistance = 0.5;
        this.camera.lookAt(new THREE.Vector3(0, 1.25, 0));
        this.controls.target.set(0, 0.9, 0);

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

        this.whiteLight1 = new THREE.PointLight(0xffffff, 4, 1);
        this.whiteLight1.name = "whiteLight";
        this.whiteLight1.position.set(0, 1.5, -0.5);
        this.whiteLight1.intensity = settings.lights.w1.low;

        this.whiteLight2 = new THREE.PointLight(0xffffff, 4, 1);
        this.whiteLight2.name = "whiteLight";
        this.whiteLight2.position.set(0, 1.5, 0.5);
        this.whiteLight2.intensity = settings.lights.w2.low;

        //
        this.orangeLight = new THREE.PointLight(0xf26101, 0, 100);
        this.orangeLight.intensity = settings.lights.orange.low;
        this.orangeLight.name = "orangeLight";
        this.orangeLight.position.set(-1, 2, -1);
        this.orangeLight.castShadow = true;
        this.orangeLight.shadow.radius = 2;
        //
        this.blueLight = new THREE.PointLight(0x0071bc, 0, 100);
        this.blueLight.intensity = settings.lights.blue.low;

        this.blueLight.name = "this.blueLight";
        this.blueLight.position.set(1, 2, 1);
        this.blueLight.castShadow = true;
        this.blueLight.shadow.radius = 2;

        //
        this.lightsWrapper = new THREE.Object3D();
        this.lightsWrapper.name = "lightsWrapper";
        this.lightsWrapper.add(
            this.whiteLight1,
            this.whiteLight2,
            this.orangeLight,
            this.blueLight
        );

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
        this._handleVis(prevProps);
    }

    _handleVis = (prevProps) => {
        if (prevProps !== this.props) {
            let {
                scenarioSwitch,
                parks,
                culturalBuildings,
                cars,
                bicycles,
                pedestrians,
                quality,
                cityModelSwitch,
                metricsObjSwitch,
            } = this.props.menuInteraction;

            let cityModelObject = this.scene.getObjectByName("cityModel");

            //
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
            let metricsObj = this.scene.getObjectByName("metricsObj");
            // find which menu item has changed
            for (const thisMenuItem in prevProps.menuInteraction) {
                if (
                    prevProps.menuInteraction[thisMenuItem] !==
                    this.props.menuInteraction[thisMenuItem]
                ) {
                    switch (thisMenuItem) {
                        case "scenarioSwitch":
                            const lights = [this.blueLight, this.orangeLight];

                            lights.forEach((thisLight) => {
                                new TWEEN.Tween(thisLight.position)
                                    .to(
                                        {
                                            x: -thisLight.position.x,
                                            z: -thisLight.position.z,
                                        },
                                        2000
                                    )
                                    .easing(TWEEN.Easing.Quadratic.Out)
                                    .onUpdate(() => {})
                                    .start();
                            });

                            _objectDisplay(parks_before, parks);
                            _objectDisplay(
                                parks_after,
                                scenarioSwitch && parks
                            );

                            _objectDisplay(cultural_before, culturalBuildings);
                            _objectDisplay(
                                cultural_after,
                                scenarioSwitch && culturalBuildings
                            );

                            _objectDisplay(
                                trips_car_before,
                                !scenarioSwitch && cars
                            );
                            _objectDisplay(
                                trips_car_after,
                                scenarioSwitch && cars
                            );

                            _objectDisplay(
                                trips_bike_before,
                                !scenarioSwitch && bicycles
                            );
                            _objectDisplay(
                                trips_bike_after,
                                scenarioSwitch && bicycles
                            );

                            _objectDisplay(
                                trips_pedestrians_before,
                                !scenarioSwitch && pedestrians
                            );
                            _objectDisplay(
                                trips_pedestrians_after,
                                scenarioSwitch && pedestrians
                            );

                            // change radar texture

                            new TWEEN.Tween(metricsObj.rotation)
                                .to(
                                    {
                                        x: 0,
                                        y: scenarioSwitch ? -3.14159 : 3.14159,
                                        z: 0,
                                    },
                                    2000
                                )
                                .easing(TWEEN.Easing.Cubic.InOut)
                                .start()
                                .onStart(() => {
                                    metricsObj.material.forEach((material) => {
                                        if (material) {
                                            material.map = scenarioSwitch
                                                ? material.userData
                                                      .radarAfterText
                                                : material.userData
                                                      .radarBeforeText;
                                            material.map.needsUpdate = true;
                                        }
                                    });
                                });

                            break;

                        case "metricsObjSwitch":
                            _objectDisplay(metricsObj, metricsObjSwitch);
                            break;

                        case "parks":
                            _objectDisplay(parks_before, parks);
                            _objectDisplay(
                                parks_after,
                                scenarioSwitch && parks
                            );
                            break;

                        case "culturalBuildings":
                            _objectDisplay(cultural_before, culturalBuildings);
                            _objectDisplay(
                                cultural_after,
                                scenarioSwitch && culturalBuildings
                            );
                            break;

                        case "cars":
                            _objectDisplay(
                                trips_car_before,
                                !scenarioSwitch && cars
                            );
                            _objectDisplay(
                                trips_car_after,
                                scenarioSwitch && cars
                            );
                            break;

                        case "bicycles":
                            _objectDisplay(
                                trips_bike_before,
                                !scenarioSwitch && bicycles
                            );
                            _objectDisplay(
                                trips_bike_after,
                                scenarioSwitch && bicycles
                            );
                            break;

                        case "pedestrians":
                            _objectDisplay(
                                trips_pedestrians_before,
                                !scenarioSwitch && pedestrians
                            );
                            _objectDisplay(
                                trips_pedestrians_after,
                                scenarioSwitch && pedestrians
                            );
                            break;

                        case "quality":
                            /**
                             * Setup qulity
                             */
                            this.setState({ renderer: quality });
                            // if low quality render
                            if (!quality) {
                                this.blueLight.intensity =
                                    settings.lights.blue.low;
                                this.orangeLight.intensity =
                                    settings.lights.orange.low;
                                this.whiteLight1.intensity =
                                    settings.lights.w1.low;
                                this.whiteLight2.intensity =
                                    settings.lights.w2.low;
                            } else {
                                // higher qulaity
                                this.blueLight.intensity =
                                    settings.lights.blue.high;
                                this.orangeLight.intensity =
                                    settings.lights.orange.high;
                                this.whiteLight1.intensity =
                                    settings.lights.w1.high;
                                this.whiteLight2.intensity =
                                    settings.lights.w2.high;
                            }
                            break;

                        case "cityModelSwitch":
                            if (!cityModelSwitch) {
                                //
                                _objectDisplay(cityModelObject, false);
                            } else {
                                _objectDisplay(cityModelObject, true);
                            }
                            break;

                        case "cameraScene":
                            let slectedScene = this.props.menuInteraction
                                .cameraScene;
                            console.log(slectedScene);

                            if (slectedScene === "animateCamera") {
                                break;
                            } else {
                                let newCamPos =
                                    settings.cameraScenesPositions[slectedScene]
                                        .camPos;
                                let l =
                                    settings.cameraScenesPositions[slectedScene]
                                        .lookAt;
                                let newLookAt = new THREE.Vector3(
                                    l[0],
                                    l[1],
                                    l[2]
                                );
                                // fly camera to new postion
                                new TWEEN.Tween(this.camera.position)
                                    .to(
                                        {
                                            x: newCamPos[0],
                                            y: newCamPos[1],
                                            z: newCamPos[2],
                                        },
                                        1000
                                    )
                                    .easing(TWEEN.Easing.Quadratic.Out)
                                    .onUpdate(() => {
                                        this.camera.lookAt(newLookAt);
                                    })
                                    .start();
                            }
                            break;

                        default:
                            break;
                    }
                }
            }
        }
    };

    /**
     * Each frame, choose renderer quality based  on state
     */
    _chooseRenderer = () => {
        if (this.state.renderer) {
            this.bloomComposer.render();
            this.finalComposer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    };

    _cameraState = () => {
        if (this.props.menuInteraction.cameraScene === "animateCamera") {
            this.theta += this.cameraSpeed;
            this.camera.position.x =
                this.radius * Math.sin(THREE.MathUtils.degToRad(this.theta));
            this.camera.position.y = 1.5;
            this.camera.position.z =
                this.radius * Math.cos(THREE.MathUtils.degToRad(this.theta));
            this.camera.lookAt(new THREE.Vector3(0, 1.25, 0));
            this.camera.updateMatrixWorld();
        } else {
            // force camera lookAt

            _blockCamera(this.camera);
        }
    };

    startAnimationLoop = () => {
        this._cameraState();

        // control TWEEN event
        TWEEN.update();
        // animate the sim
        this._animateAgents();

        //    choose the renderer quality
        this._chooseRenderer();

        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    _onMouseUp(e) {
        let mouse = new THREE.Vector2();
        let ray = new THREE.Raycaster();

        mouse.x = (e.clientX / this.width) * 2 - 1;
        mouse.y = -(e.clientY / this.height) * 2 + 1;
        ray.setFromCamera(mouse.clone(), this.camera);

        var objects = ray.intersectObjects(this.scene.children);
        if (objects[0] && objects[0].point) {
            console.log(objects[0].object);
            let rayPos = objects[0].point;
            this.controls.target.set(rayPos);
            this.controls.update();
        }
    }

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
