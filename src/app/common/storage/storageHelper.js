import firebase from '../../config/firebase'

export function getBookPictureBucketPath(bookId) {
    const user = firebase.auth().currentUser;

    if (!user)
        throw new Error("Cannot return book path for unauthenticated user.")

    return `userStorage/${user.uid}/${bookId}/${bookId}.png`
    
}