import { DECREMENT_HIGHLIGHT_COUNT, INCREMENT_HIGHLIGHT_COUNT, LISTEN_TO_CURRENT_USER_PLAN, LISTEN_TO_CURRENT_USER_PROFILE, LISTEN_TO_HIGHLIGHT_COUNT, LISTEN_TO_PREMIUM_INFO, LISTEN_TO_SELECTED_USER_PROFILE} from "./profileConstants";

const initialState = {
    currentUserProfile: null,
    selectedUserProfile: null,
    userPlan: null,
    highlightCount: null,
    premiumInfo: null
}

export default function profileReducer(state = initialState, { type, payload }) {
    switch (type) {
        case LISTEN_TO_CURRENT_USER_PROFILE:
            return {
                ...state,
                currentUserProfile: payload
            }
        case LISTEN_TO_SELECTED_USER_PROFILE:
            return {
                ...state,
                selectedUserProfile: payload
            }
        case LISTEN_TO_CURRENT_USER_PLAN:
            return {
                ...state,
                userPlan: payload
            }
        case LISTEN_TO_HIGHLIGHT_COUNT:
            return {
                ...state,
                highlightCount: payload
            }
        case LISTEN_TO_PREMIUM_INFO:
            return {
                ...state,
                premiumInfo: payload
            }
        case INCREMENT_HIGHLIGHT_COUNT:
            return {
                ...state,
                highlightCount: state.highlightCount + 1
            }
        case DECREMENT_HIGHLIGHT_COUNT:
            return {
                ...state,
                highlightCount: state.highlightCount - 1
            }
        default: {
            return state
        }
    }
}