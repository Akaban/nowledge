import { DECREMENT_HIGHLIGHT_COUNT, INCREMENT_HIGHLIGHT_COUNT, LISTEN_TO_CURRENT_USER_PLAN, LISTEN_TO_CURRENT_USER_PROFILE, LISTEN_TO_HIGHLIGHT_COUNT, LISTEN_TO_PREMIUM_INFO, LISTEN_TO_SELECTED_USER_PROFILE} from "./profileConstants";

export function listentoCurrentUserProfile(profile) {
    return {
        type: LISTEN_TO_CURRENT_USER_PROFILE,
        payload: profile
    }
}

export function listentoSelectedUserProfile(profile) {
    return {
        type: LISTEN_TO_SELECTED_USER_PROFILE,
        payload: profile
    }
}

export function listentoCurrentUserPlan(plan) {
    return {
        type: LISTEN_TO_CURRENT_USER_PLAN,
        payload: plan
    }
}

export function listentoCurrentHighlightCount(highlightCount) {
    return {
        type: LISTEN_TO_HIGHLIGHT_COUNT,
        payload: highlightCount
    }
}

export function incrementHighlightCount_local() {
    return {
        type: INCREMENT_HIGHLIGHT_COUNT,
    }
}

export function decrementHighlightCount_local() {
    return {
        type: DECREMENT_HIGHLIGHT_COUNT,
    }
}

export function listentoPremiumInfo(premiumInfo) {
    return {
        type: LISTEN_TO_PREMIUM_INFO,
        payload: premiumInfo
    }
}