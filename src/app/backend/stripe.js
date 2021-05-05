
import axios from "axios";
import { API_URL } from "./config";
import firebase from "../config/firebase";

export async function createCheckoutSession(priceId) {
  const API_ENDPOINT = `${API_URL}/stripe/create_checkout_session`;
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Unauthenticated user.");

  return user.getIdToken(true).then(async function (idToken) {

  const config = {
    method: "post",
    url: API_ENDPOINT,
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json"
    },
  data: {priceId}};

    return (axios(config)
      .then(response => {return response.data})
      .catch((error) => {
        throw error;
      }));
  });
}