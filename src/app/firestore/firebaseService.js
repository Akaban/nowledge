import { toast } from "react-toastify";
import { deleteBook } from "../backend/book";
import { promoteToFreePlan } from "../backend/premium";
import {
  getBookBucketPath,
  getBookPictureBucketPath,
} from "../common/storage/storageHelper";
import firebase from "../config/firebase";
import { setUserBooks, setUserProfileData } from "./firestoreService";
import { useDispatch } from "react-redux";
import {
  APP_LOADED,
  BLOCK_APP_LOADED,
  UNBLOCK_APP_LOADED,
} from "../async/asyncReducer";
import { store } from "../../index";

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
    store.dispatch({ type: BLOCK_APP_LOADED });
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(creds.email, creds.password);
    await result.user.updateProfile({
      name: creds.name,
    });
    await setUserProfileData(result.user);
    await setUserBooks(result.user);
    const r = await promoteToFreePlan(result.user);
    console.log(r);
    store.dispatch({ type: UNBLOCK_APP_LOADED });
    store.dispatch({ type: APP_LOADED });
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
    const result = await firebase.auth().signInWithPopup(provider);
    if (result.additionalUserInfo.isNewUser) {
      store.dispatch({ type: BLOCK_APP_LOADED });
      await result.user.updateProfile({
        name: result.user.email,
      });
      await setUserProfileData(result.user);
      await setUserBooks(result.user);
      await promoteToFreePlan(result.user);
      store.dispatch({ type: UNBLOCK_APP_LOADED });
      store.dispatch({ type: APP_LOADED });
    }
  } catch (error) {
    toast.error(error.message);
  }
}
