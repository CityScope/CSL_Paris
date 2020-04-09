/**
 * ACTIONS
 */

export const SET_LOADING_STATE = "SET_LOADING_STATE";
export function setLoadingState(data) {
    return { type: SET_LOADING_STATE, data };
}

export const SET_START_STATE = "SET_START_SCENE";
export function setStartSceneState(data) {
    return { type: SET_START_STATE, data };
}

export const MENU_INTERACTION = "MENU_INTERACTION";
export function listenToMenuUI(data) {
    return { type: MENU_INTERACTION, data };
}
