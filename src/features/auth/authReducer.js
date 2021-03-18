import { SIGN_IN_USER, SIGN_OUT_USER } from "./authConstants"
import {LOCATION_CHANGE} from 'connected-react-router'
import { getUserData } from "./authHelpers"

const initialState = {
    authenticated: false,
    currentUser: null,
    prevLocation: null,
    currentLocation: null
}

export default function authReducer(state = initialState, {type, payload}) {
    switch (type) {
        case SIGN_IN_USER:
            return {
                ...state,
                authenticated: true,
                currentUser: getUserData(payload)
            }
        case SIGN_OUT_USER:
            return {
                ...state,
                authenticated: false,
                currentUser: null
            }

        case LOCATION_CHANGE:
            return {
                ...state,
                prevLocation: state.currentLocation,
                currentLocation: payload.location
            }
        default:
            return state
    }
}