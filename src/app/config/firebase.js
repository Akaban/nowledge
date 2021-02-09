import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDAHQ6svBZWNOXOio_OcVpcXRwZxQz7P8Q",
    authDomain: "revents-407db.firebaseapp.com",
    projectId: "revents-407db",
    storageBucket: "revents-407db.appspot.com",
    messagingSenderId: "384638105380",
    appId: "1:384638105380:web:c016abbaf2ff618cec25b1",
    measurementId: "G-T6K1BW5X2P" 
}

firebase.initializeApp(firebaseConfig)
firebase.firestore()

export default firebase