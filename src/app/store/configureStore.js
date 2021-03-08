import {createStore, applyMiddleware} from 'redux'
import rootReducer from  './rootReducer'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { verifyAuth } from '../../features/auth/authActions'

export function configureStore(history) {
    const store =  createStore(rootReducer(history), composeWithDevTools(applyMiddleware(thunk)))
    store.dispatch(verifyAuth())
    return store
}