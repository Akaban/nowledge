
import { store } from '../../../index'
import { ASYNC_ACTION_START, ASYNC_ACTION_ERROR } from '../../async/asyncReducer'

export function asyncIsLoading() {
    const asyncState = store.getState().async

    return (
        asyncState.tasks
        .map(t => t.state === ASYNC_ACTION_START)
        .reduce((acc, x) => acc || x)
        )
}

export function asyncIsError() {
    const asyncState = store.getState().async

    return (
        asyncState.tasks
        .map(t => t.state === ASYNC_ACTION_ERROR)
        .reduce((acc, x) => acc || x)
        )
}
