import axios from "axios";
import { API_URL } from "./config";
import firebase from "../config/firebase";

export async function getBookDownloadURL(bookId) {
  const API_ENDPOINT = `${API_URL}/get_book_url/${bookId}`;
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
        const { url } = res.data
        return url;
      })
      .catch((error) => {
        console.error(error);
      }));
  });
}

export async function uploadBook(bookId, pdfFile) {
  const API_ENDPOINT = `${API_URL}/upload_book`;
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("Unauthenticated user.");

  var bodyFormData = new FormData();
  bodyFormData.append("book_id", bookId)
  bodyFormData.append("pdf_file", pdfFile)

  return user.getIdToken(true).then(async function (idToken) {

  const config = {
    method: "post",
    url: API_ENDPOINT,
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "multipart/form-data"
    },
  data: bodyFormData};

    return (axios(config)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        const { message } = error.response.data
        throw new Error("Cannot upload book: " + message)
      }));
  });
}