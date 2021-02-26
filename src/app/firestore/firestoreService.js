import cuid from "cuid";
import firebase from "../config/firebase";

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

export function getEventsFromFirestore() {
  return db.collection("events").orderBy("date");
}

export function getBooksFromFirestore() {
  const user = firebase.auth().currentUser;
  return db.collection("userBooks").doc(user.uid);
}

export function getHighlightsFromFirestore(bookId) {
    const user = firebase.auth().currentUser;
    return db
      .collection("userBooks")
      .doc(user.uid)
      .collection("highlights")
      .doc(bookId);
}

export function listenToEventFromFirestore(eventId) {
  return db.collection("events").doc(eventId);
}

export function updateEventInFirestore(event) {
  return db.collection("events").doc(event.id).update(event);
}

export function deleteEventInFirestore(eventId) {
  return db.collection("events").doc(eventId).delete();
}

export function setUserProfileData(user) {
  return db.collection("users").doc(user.uid).set({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export function setUserBooks(user) {
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
  console.log(`saving highlight for bookId=${bookId}`);
  console.log(highlights);
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
  if (pageNumber < 0)
    pageNumber = 0;
  const user = firebase.auth().currentUser;
  console.log(`saving initPageNumber=${pageNumber} for bookId=${bookId}`);
  return db
    .collection("userBooks")
    .doc(user.uid)
    .collection("highlights")
    .doc(bookId)
    .update({
      initPageNumber: pageNumber,
    });
}

export async function addUserBook(book) {
  const user = firebase.auth().currentUser;
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
    console.log("about to update arrayUnion with book =");
    console.log(book);
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
