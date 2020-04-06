import { SET_LOADING_STATE, SET_START_STATE } from "./actions";
import initialState from "./initialState";

/**
 * REDUCER
 */
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_LOADING_STATE:
            return { ...state, LOADING: action.data };
        case SET_START_STATE:
            return { ...state, START_SCENE: action.data };
        default:
            return state;
    }
}
