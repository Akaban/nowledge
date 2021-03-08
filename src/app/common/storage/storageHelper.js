import firebase from '../../config/firebase'

export function getBookBucketPath(bookId) {
    const user = firebase.auth().currentUser;

    if (!user)
        throw new Error("Cannot return book path for unauthenticated user.")

    return {
        pdfFile: `${user.uid}/userBooks/${bookId}/${bookId}.pdf`,
        pictureFile: `${user.uid}/userBooks/${bookId}/${bookId}.png`,
    }
}