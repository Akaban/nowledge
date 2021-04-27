import { toast } from "react-toastify";
import { promoteToFreePlan } from "../backend/premium";
import firebase from "../config/firebase";
import { setUserBooks, setUserProfileData } from "./firestoreService";
import {
  APP_LOADED,
  BLOCK_APP_LOADED,
  UNBLOCK_APP_LOADED,
} from "../async/asyncReducer";
import { store } from "../../index";
import { loadAppData, signInUser } from "../../features/auth/authActions";
import { checkBackendHealth } from "../backend/backend";

export function signInWithEmail(creds, mixpanel) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(creds.email, creds.password);
}

export function signOutFirebase() {
  return firebase.auth().signOut();
}

export async function getToken() {
  const user = firebase.auth().currentUser;

  if (!user) throw new Error("User not logged in.");
  return await user.getIdToken(true);
}

export async function registerInFirebase(creds) {
  try {
    await checkBackendHealth();
    store.dispatch({ type: BLOCK_APP_LOADED });
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(creds.email, creds.password);
    console.log("registered", result);
    console.log("now initialize user");
    await result.user.updateProfile({
      displayName: creds.name
    });
    console.log("setuserprofiledata");
    await setUserProfileData(result.user, "password");
    console.log("promote to free plan");
    const r = await promoteToFreePlan(result.user);
    console.log(r);
    console.log("set user books");
    await setUserBooks(result.user);
    loadAppData(result.user);
    store.dispatch({ type: UNBLOCK_APP_LOADED });
    store.dispatch({ type: APP_LOADED });
    store.dispatch(signInUser(result.user))
  } catch (error) {
    throw error;
  }
}

export function updateUserPassword(creds) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");
  return user.updatePassword(creds.newPassword1);
}

export function uploadBookDataToFirebaseStore(bookId, bookPdfFile) {
  const filename_pdf = bookId + ".pdf";

  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");
  const storageRef = firebase.storage().ref();
  const pdfUploadTask = storageRef
    .child(`${user.uid}/userBooks/${bookId}/${filename_pdf}`)
    .put(bookPdfFile);

  return {
    pdfUploadTask,
  };
}

export async function socialLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await checkBackendHealth();
    store.dispatch({ type: BLOCK_APP_LOADED });
    const result = await firebase.auth().signInWithPopup(provider);
    if (result.additionalUserInfo.isNewUser) {
      await promoteToFreePlan(result.user);
      await result.user.updateProfile({
        name: result.user.email,
      });
      await setUserProfileData(result.user, "social_login");
      await setUserBooks(result.user);
    }
    await loadAppData(result.user);
    store.dispatch(signInUser(result.user))
    store.dispatch({ type: UNBLOCK_APP_LOADED });
    store.dispatch({ type: APP_LOADED });
  } catch (error) {
    console.log(error.message)
    toast.error(error.message);
  }
}
