import { SIGN_IN_USER, SIGN_OUT_USER } from "./authConstants";
import { APP_LOADED } from "../../app/async/asyncReducer";
import firebase from "../../app/config/firebase";
import {
  dataFromSnapshot,
  getUserPlan,
  getUserProfile,
} from "../../app/firestore/firestoreService";
import {
  listentoCurrentHighlightCount,
  listentoCurrentUserPlan,
  listentoCurrentUserProfile,
  listentoPremiumInfo,
} from "../profiles/profileActions";
import { getUserData } from "./authHelpers";
import { getHighlightCount, getPremiumInfo } from "../../app/backend/premium";

export function signInUser(user) {
  return {
    type: SIGN_IN_USER,
    payload: user,
  };
}

export function verifyAuth(mixpanel) {
  return function (dispatch) {
    return firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(signInUser(user));
        const profileRef = getUserProfile(user.uid);
        mixpanel.identify(user.uid);
        mixpanel.track("Logged In");
        const userData = getUserData(user);
        mixpanel.people.set({
          $email: userData.email,
          providerId: userData.providerId,
        });
        profileRef.onSnapshot((snapshot) => {
          dispatch(listentoCurrentUserProfile(dataFromSnapshot(snapshot)));
        });
        const userPlanRef = getUserPlan(user.uid);
        userPlanRef.onSnapshot((snapshot) => {
          const data = dataFromSnapshot(snapshot);
          dispatch(listentoCurrentUserPlan(data));
          dispatch(listentoCurrentHighlightCount(data.highlight_count))
        });
        getPremiumInfo().then(data => dispatch(listentoPremiumInfo(data)));
        dispatch({ type: APP_LOADED });
      } else {
        dispatch(signOutUser());
        // dispatch({type: 'USER_LOGOUT_RESET_STORE'})
        dispatch({ type: APP_LOADED });
      }
    });
  };
}

export function signOutUser(payload) {
  return {
    type: SIGN_OUT_USER,
    payload,
  };
}
