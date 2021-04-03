
import axios from "axios";
import { API_URL } from "./config";
import firebase from "../config/firebase";

export async function getPremiumInfo() {
  const API_ENDPOINT = `${API_URL}/get_premium_info`;
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Unauthenticated user.");
  return user.getIdToken(true).then(async function (idToken) {
    return (axios
      .get(API_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        console.error(error);
      }));
  })}