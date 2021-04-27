import { SIGN_IN_USER, SIGN_OUT_USER } from "./authConstants";
import { APP_LOADED } from "../../app/async/asyncReducer";
import firebase from "../../app/config/firebase";
import {
  dataFromSnapshot,
  getUserPlan,
  getUserProfile,
} from "../../app/firestore/firestoreService";
import {
  listentoCurrentUserPlan,
  listentoCurrentUserProfile,
  listentoPremiumInfo,
} from "../profiles/profileActions";
import { getUserData } from "./authHelpers";
import { getPremiumInfo } from "../../app/backend/premium";
import { store } from "../../index";

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
        const { no_update_initialized } = store.getState().async
        mixpanel.identify(user.uid);
        mixpanel.track("Logged In");
        const userData = getUserData(user);
        mixpanel.people.set({
          $email: userData.email,
          providerId: userData.providerId,
        });
        if (!no_update_initialized) {
          loadAppData(user);
          dispatch(signInUser(user));
          dispatch({ type: APP_LOADED });
        }
      } else {
        dispatch(signOutUser());
        // dispatch({type: 'USER_LOGOUT_RESET_STORE'})
        dispatch({ type: APP_LOADED });
      }
    });
  };
}

export function loadAppData(user) {
  const dispatch = (x) => store.dispatch(x);
  const profileRef = getUserProfile(user.uid);

  profileRef.onSnapshot((snapshot) => {
    dispatch(listentoCurrentUserProfile(dataFromSnapshot(snapshot)));
  });
  const userPlanRef = getUserPlan(user.uid);
  userPlanRef.onSnapshot((snapshot) => {
    const data = dataFromSnapshot(snapshot);
    dispatch(listentoCurrentUserPlan(data));
  });
  getPremiumInfo().then((data) => dispatch(listentoPremiumInfo(data)));
}

export function signOutUser(payload) {
  return {
    type: SIGN_OUT_USER,
    payload,
  };
}
