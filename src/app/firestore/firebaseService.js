import { getBookBucketPath } from '../common/storage/storageHelper';
import firebase from '../config/firebase'
import { setUserBooks, setUserProfileData } from './firestoreService'

export function signInWithEmail(creds) {
    return firebase
        .auth()
        .signInWithEmailAndPassword(creds.email, creds.password)
}

export function signOutFirebase() {
    return firebase.auth().signOut()
}

export async function getToken() {
    const user = firebase.auth().currentUser;

    if(!user)
        throw new Error("User not logged in.")
    return await user.getIdToken(true)
}

export async function registerInFirebase(creds) {
    try {
        const result = await firebase.auth().createUserWithEmailAndPassword(creds.email, creds.password)
        // await result.user.updateProfile({
        //     uselessfield: 1
        // })
        await setUserProfileData(result.user)
        await setUserBooks(result.user)
    } catch (error) {
        throw error
    }
}

export function updateUserPassword(creds) {
    const user = firebase.auth().currentUser;
    if(!user)
        throw new Error("User not logged in.")
    return user.updatePassword(creds.newPassword1)
}

export function uploadBookDataToFirebaseStore(bookId, bookPdfFile) {

    const filename_pdf = bookId + '.pdf'

    const user = firebase.auth().currentUser
    if(!user)
        throw new Error("User not logged in.")
    const storageRef = firebase.storage().ref()
    const pdfUploadTask = storageRef
        .child(`${user.uid}/userBooks/${bookId}/${filename_pdf}`)
        .put(bookPdfFile)

    return {
        pdfUploadTask,
    }
}

export function deleteFileFromFirebaseStore(bookId) {
    const storage = firebase.storage()
    const {
        pictureFile: picturePath,
        pdfFile: pdfPath
    } = getBookBucketPath(bookId)
    console.log({picturePath, pdfPath})
    const pictureReference = storage.ref().child(picturePath)
    const pdfReference = storage.ref().child(pdfPath)

    pictureReference.delete()
    pdfReference.delete()
}