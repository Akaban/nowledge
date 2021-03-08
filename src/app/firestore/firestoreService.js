import firebase from "../config/firebase";
import { deleteFileFromFirebaseStore } from "./firebaseService";

const db = firebase.firestore();

export function dataFromSnapshot(snapshot) {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();

  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof firebase.firestore.Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }

  return {
    ...data,
    id: snapshot.id,
  };
}

export function getBooksFromFirestore() {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");
  return db.collection("userBooks").doc(user.uid);
}

export function getHighlightsFromFirestore(bookId) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");
  return db
    .collection("userBooks")
    .doc(user.uid)
    .collection("highlights")
    .doc(bookId);
}

export function setUserProfileData(user) {
  if (!user) throw new Error("User not logged in.");
  return db.collection("users").doc(user.uid).set({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export function setUserBooks(user) {
  if (!user) throw new Error("User not logged in.");
  return db.collection("userBooks").doc(user.uid).set({
    books: [],
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export function getUserProfile(userId) {
  return db.collection("users").doc(userId);
}

export async function updateUserProfile(profile) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");
  try {
    if (user.displayName !== profile.displayName) {
      await user.updateProfile({
        displayName: profile.displayName,
      });
      return await db.collection("users").doc(user.uid).update(profile);
    }
  } catch (error) {
    throw error;
  }
}

export function updateHighlightsInFirestore(bookId, highlights) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");
  return db
    .collection("userBooks")
    .doc(user.uid)
    .collection("highlights")
    .doc(bookId)
    .update({
      highlights,
    });
}

export function updateInitPageNumberInFirestore(bookId, pageNumber) {
  if (pageNumber < 0) pageNumber = 0;
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");
  return db
    .collection("userBooks")
    .doc(user.uid)
    .collection("highlights")
    .doc(bookId)
    .update({
      initPageNumber: pageNumber,
    });
}

export async function removeUserBook(book) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");
  try {
    await deleteFileFromFirebaseStore(book.id);
    await db
      .collection("userBooks")
      .doc(user.uid)
      .collection("highlights")
      .doc(book.id)
      .delete();
    await db
      .collection("userBooks")
      .doc(user.uid)
      .update({
        books: firebase.firestore.FieldValue.arrayRemove(book),
      });
  } catch (error) {
    throw error;
  }
}

export async function addUserBook(book) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");
  async function setupHighlights() {
    return await db
      .collection("userBooks")
      .doc(user.uid)
      .collection("highlights")
      .doc(book.id)
      .set({
        highlights: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }
  try {
    await db
      .collection("userBooks")
      .doc(user.uid)
      .update({
        books: firebase.firestore.FieldValue.arrayUnion(book),
      });
    await setupHighlights();
  } catch (error) {
    throw error;
  }
}
