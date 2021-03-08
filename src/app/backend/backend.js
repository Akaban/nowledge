import axios from "axios";
import firebase from "../config/firebase";

export async function authenticatedCallBackend({endpoint, then}) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Unauthenticated user.");
  return user.getIdToken(true).then(async function (idToken) {
    return (axios
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })
      .then(then)
      .catch((error) => {
        console.error(error);
      }));
  });
}