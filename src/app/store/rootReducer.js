import {combineReducers} from 'redux'
import authReducer from '../../features/auth/authReducer';
import eventReducer from '../../features/events/eventreducer'
import testReducer from '../../features/sandbox/testReducer'
import modalReducer from '../common/modals/modalReducer';
import asyncReducer from '../async/asyncReducer';
import profileReducer from '../../features/profiles/profileReducer';
import bookReducer from '../../features/books/bookReducer';

const rootReducer = combineReducers({
    test: testReducer,
    modals: modalReducer,
    auth: authReducer,
    async: asyncReducer,
    profile: profileReducer,
    books: bookReducer
})

export default rootReducer;