import {combineReducers} from 'redux'
import authReducer from '../../features/auth/authReducer';
import testReducer from '../../features/sandbox/testReducer'
import modalReducer from '../common/modals/modalReducer';
import asyncReducer from '../async/asyncReducer';
import profileReducer from '../../features/profiles/profileReducer';
import bookReducer from '../../features/books/bookReducer';
import {connectRouter} from 'connected-react-router'

const appReducer = (history) => combineReducers({
    router: connectRouter(history),
    test: testReducer,
    modals: modalReducer,
    auth: authReducer,
    async: asyncReducer,
    profile: profileReducer,
    books: bookReducer
})

const rootReducer = (history) => {return (state, action) => {
  if (action.type === 'USER_LOGOUT_RESET_STORE') {
    state = undefined
  }
  return appReducer(history)(state, action)
}}

export default rootReducer;