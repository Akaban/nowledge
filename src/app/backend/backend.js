import axios from "axios";
import firebase from "../config/firebase";
import { API_URL } from "./config";

export async function authenticatedCallBackend({ endpoint, then }) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Unauthenticated user.");
  return user.getIdToken(true).then(async function (idToken) {
    return axios
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })
      .then(then)
      .catch((error) => {
        console.error(error);
      });
  });
}

export async function checkBackendHealth(user) {
  console.log("checking backend health");
  const API_ENDPOINT = `${API_URL}/health`;
  return axios
    .get(API_ENDPOINT)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw new Error(
        "Sorry but an unexpected error happened, we're investigating the problem and will fix it ASAP!"
      );
    });}