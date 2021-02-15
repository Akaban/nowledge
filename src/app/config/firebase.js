import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCD-v6jO5m8g6K120HZGV9uyq0PEOXhkx0",
    authDomain: "nowledge-c01c4.firebaseapp.com",
    projectId: "nowledge-c01c4",
    storageBucket: "nowledge-c01c4.appspot.com",
    messagingSenderId: "747575118986",
    appId: "1:747575118986:web:5ed3697a3ecec3318bb173",
    measurementId: "G-B64C33B62N"
}

firebase.initializeApp(firebaseConfig)
firebase.firestore()

export default firebase