
import axios from "axios";
import { API_URL } from "./config";
import firebase from "../config/firebase";

export async function sendFeedback(message, extraData) {
  const API_ENDPOINT = `${API_URL}/send_feedback`;
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
  data: {message, extra_data: extraData}};

    return (axios(config)
      .then(r => console.log(r))
      .catch((error) => {
        const { message } = error.response.data
        throw new Error("Cannot send feedback: " + message)
      }));
  });
}