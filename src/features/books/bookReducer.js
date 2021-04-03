import { CREATE_BOOK, DELETE_BOOK, FETCH_BOOK, UPDATE_BOOK } from "./bookConstants";

const initialState = {
    books: null,
}

export default function bookReducer(state = initialState, {type, payload}) {
    switch (type) {
        case CREATE_BOOK:
            return {
                ...state,
                books: [...state.books, payload]
            }
        case UPDATE_BOOK:
            return {
                ...state,
                books: [...state.books.filter(book => book.id !== payload.id), payload]
            }
        case DELETE_BOOK:
            return {
                ...state,
                books: state.books.filter(book => book.id !== payload)
            }
        case FETCH_BOOK:
            return {
                ...state,
                books: payload.books
            }
        default:
            return state;
    }
}