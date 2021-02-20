import { fetchSampleData } from "../../app/api/mockApi";
import { asyncActionError, asyncActionFinish, asyncActionStart } from "../../app/async/asyncReducer";
import { getBooksFromFirestore } from "../../app/firestore/firestoreService";
import { CREATE_BOOK, DELETE_BOOK, FETCH_BOOK, UPDATE_BOOK } from "./bookConstants";

export function loadBooks() {
    return async function(dispatch) {
        dispatch(asyncActionStart())
        try {
            const books = await fetchSampleData();
            dispatch({type: FETCH_BOOK, payload: books});
            dispatch(asyncActionFinish())
        } catch (error) {
            dispatch(asyncActionError(error))
        }
    }
}


export function loadBooksFirestore() {
    return async function(dispatch) {
        dispatch(asyncActionStart())
        try {
            const books = await getBooksFromFirestore();
            dispatch({type: FETCH_BOOK, payload: books});
            dispatch(asyncActionFinish())
        } catch (error) {
            dispatch(asyncActionError(error))
        }
    }
}

export function listenToBooks(books) {
    return {
        type: FETCH_BOOK,
        payload: books
    }
}

export function createBooks(book) {
    return {
        type: CREATE_BOOK,
        payload: book
    }
}

export function updateEvent(books) {
    return {
        type: UPDATE_BOOK,
        payload: books
    }
}

export function deleteBook(eventId) {
    return {
        type: DELETE_BOOK,
        payload: eventId
    }
}