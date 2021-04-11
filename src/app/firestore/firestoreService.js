import { deleteBook } from "../backend/book";
import firebase from "../config/firebase";
import { deleteBookFromFirebaseStore } from "./firebaseService";

const db = firebase.firestore();

window.db = db;

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

export function getHighlightsCollectionFromFirestore() {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");
  return db.collection("userBooks").doc(user.uid).collection("highlights");
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

export function getUserPlan(userId) {
  return db.collection("userPlans").doc(userId);
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

export function updatePassword(password, passwordConfirmation) {
  const user = firebase.auth().currentUser;

  if (password !== passwordConfirmation)
    throw new Error("Cannot update password, password confirmation mismatch.");

  user
    .updatePassword(password)
    .then(function () {
      console.log("Successfully updated password.");
    })
    .catch(function (error) {
      throw error;
    });
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

export async function updateHighlightsMetadataInFirestore(bookId, highlights) {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");

  const updateFields = {
    last_highlight_page_number: highlights.length > 0 ? Math.max(...highlights.map(h => h.position.pageNumber)) : null,
    last_highlight_date: highlights.length > 0 ? Math.max(...highlights.map(h => typeof h.createdAt.toDate === 'function' ? h.createdAt.toDate() : h.createdAt)) : null
  };

  db.collection("userBooks")
    .doc(user.uid)
    .collection("metadata")
    .doc(bookId)
    .update(updateFields);
}

export function getBooksMetadataFromFirestore() {
  const user = firebase.auth().currentUser;
  if (!user) throw new Error("User not logged in.");

  return db.collection("userBooks")
    .doc(user.uid)
    .collection("metadata")
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
  const book2 = {...book}
  if ("app_metadata" in book2) delete book2.app_metadata;
  if (!user) throw new Error("User not logged in.");
  try {
    db.collection("userBooks")
      .doc(user.uid)
      .collection("highlights")
      .doc(book.id)
      .delete();
    db.collection("userBooks")
      .doc(user.uid)
      .update({
        books: firebase.firestore.FieldValue.arrayRemove(book2),
      });
    deleteBook(book.id);
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
    await setupHighlights();
    await db.collection("userBooks").doc(user.uid).collection("metadata").doc(book.id).set({})
    await db
      .collection("userBooks")
      .doc(user.uid)
      .update({
        books: firebase.firestore.FieldValue.arrayUnion(book),
      });
  } catch (error) {
    throw error;
  }
}
