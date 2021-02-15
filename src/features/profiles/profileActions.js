import { LISTEN_TO_CURRENT_USER_PROFILE} from "./profileConstants";

export function listentoCurrentUserProfile(profile) {
    console.log(`listeningtoCurrentUserProfile with profile={${profile}}`)
    console.log(profile)
    return {
        type: LISTEN_TO_CURRENT_USER_PROFILE,
        payload: profile
    }
}
