
import axios from "axios";
import { API_URL } from "./config";
import firebase from "../config/firebase";
import { store } from "../../index"

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

  export async function promoteToFreePlan(user) {
  const API_ENDPOINT = `${API_URL}/promote_to_free_trial`;
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
  
  export async function incrementHighlightCount() {
  const API_ENDPOINT = `${API_URL}/increment_highlight_count`;
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
  
  export async function decrementHighlightCount() {
  const API_ENDPOINT = `${API_URL}/decrement_highlight_count`;
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
  
  export async function getHighlightCount() {
  const API_ENDPOINT = `${API_URL}/get_highlight_count`;
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
        const { highlight_count } = res.data
        return highlight_count
      })
      .catch((error) => {
        console.error(error);
      }));
  })}