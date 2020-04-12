import "../settings.json";
import * as settings from "../settings.json";

/**
 * ! INIT STATE
 */

const initialState = {
    LOADING: true,
    START_SCENE: false,
    MENU_INTERACTION: settings.initState,
};

export default initialState;
