import { v4 as uuidv4 } from 'uuid';

export const ASYNC_ACTION_START = 'ASYNC_ACTION_START'
export const ASYNC_ACTION_FINISH = 'ASYNC_ACTION_FINISH'
export const ASYNC_ACTION_ERROR = 'ASYNC_ACTION_ERROR'
export const APP_LOADED = 'APP_LOADED'

export function asyncGetUniqueId() {
    return uuidv4()
}

export function asyncActionStart(unique_id) {
    return {
        type: ASYNC_ACTION_START,
        payload: unique_id
   }
}

export function asyncActionFinish(unique_id) {
    return {
        type: ASYNC_ACTION_FINISH,
        payload: unique_id
    }
}

export function asyncActionError(unique_id, error) {
    return {
        type: ASYNC_ACTION_ERROR,
        payload: {unique_id, error}
    }
}

const initialState = {
    tasks: [],
    initialized: false,
    error: false,
    loading: false
}

export default function asyncReducer(state = initialState, {type, payload}) {
    function updateConstants(state) {
        const isLoading = (
        state
        .tasks
        .map(t => t.state === ASYNC_ACTION_START)
        .reduce((acc, x) => acc || x)
        )
        
        const isError = (
        state
        .tasks
        .map(t => t.state === ASYNC_ACTION_ERROR)
        .reduce((acc, x) => acc || x)
        )

        return {
            ...state,
            loading: isLoading,
            error: isError
        }

    }
    function startTask(state, unique_id) {
        if (state.tasks.filter(t => t.id === unique_id).length > 0)
            throw new Error();
        return {
            ...state,
            tasks: [...state.tasks, { id: unique_id, state: ASYNC_ACTION_START } ]
        }
    }
    function updateTask(state, unique_id, updated_task) {
        if (state.tasks.filter(t => t.id === unique_id).length === 0)
            throw new Error();

        return {
            ...state,
            tasks: [...state.tasks.filter(t => t.id !== unique_id), {
                id: unique_id,
                ...updated_task
            }]
        }
    }

    let new_state;
    switch(type) {
        case ASYNC_ACTION_START:
            new_state = startTask(state, payload);
            break;
        case ASYNC_ACTION_FINISH:
            new_state = updateTask(state, payload, {state: ASYNC_ACTION_FINISH});
            break;
        case ASYNC_ACTION_ERROR:
            new_state = updateTask(state, payload.unique_id, {state: ASYNC_ACTION_ERROR, error: payload.error});
            break;
        case APP_LOADED:
            return {
                ...state,
                initialized: true
            }
        default:
            return state
    }

    return updateConstants(new_state)
}