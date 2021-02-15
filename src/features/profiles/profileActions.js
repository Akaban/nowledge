import { LISTEN_TO_CURRENT_USER_PROFILE} from "./profileConstants";

export function listentoCurrentUserProfile(profile) {
    return {
        type: LISTEN_TO_CURRENT_USER_PROFILE,
        payload: profile
    }
}
