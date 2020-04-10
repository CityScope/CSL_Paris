/**
 * ! INIT STATE
 */

const initialState = {
    LOADING: true,
    START_SCENE: false,
    MENU_INTERACTION: {
        scenarioSwitch: false,
        parks: true,
        culturalBuildings: true,
        cars: true,
        bicycles: true,
        pedestrians: true,
        animateCamera: true,
        quality: true,
    },
};

export default initialState;
