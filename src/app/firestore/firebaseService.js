import { getFileExtension } from '../common/util/util'
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

export async function registerInFirebase(creds) {
    try {
        const result = await firebase.auth().createUserWithEmailAndPassword(creds.email, creds.password)
        await result.user.updateProfile({
            displayName: creds.displayName,
        })
        await setUserProfileData(result.user)
        await setUserBooks(result.user)
    } catch (error) {
        throw error
    }
}

export function updateUserPassword(creds) {
    const user = firebase.auth().currentUser;
    return user.updatePassword(creds.newPassword1)
}

export function uploadBookDataToFirebaseStore(bookId, bookPdfFile, bookPhotoFile) {

    const filename_pdf = bookId + '.pdf'
    const filename_picture = bookId + '.' + getFileExtension(bookPhotoFile.name)

    const user = firebase.auth().currentUser
    const storageRef = firebase.storage().ref()
    const pdfUploadTask = storageRef
        .child(`${user.uid}/userBooks/${bookId}/${filename_pdf}`)
        .put(bookPdfFile)
    const pictureUploadTask = storageRef
        .child(`${user.uid}/userBooks/${bookId}/${filename_picture}`)
        .put(bookPhotoFile)

    return {
        pdfUploadTask,
        pictureUploadTask
    }
}
