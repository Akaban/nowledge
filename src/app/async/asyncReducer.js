import { v4 as uuidv4 } from "uuid";
import { getDateDiffSeconds } from "../common/util/util";

export const ASYNC_ACTION_START = "ASYNC_ACTION_START";
export const ASYNC_ACTION_FINISH = "ASYNC_ACTION_FINISH";
export const ASYNC_ACTION_ERROR = "ASYNC_ACTION_ERROR";
export const APP_LOADED = "APP_LOADED";
export const BLOCK_APP_LOADED = "BLOCK_APP_LOADED";
export const UNBLOCK_APP_LOADED = "UNBLOCK_APP_LOADED"
export const ASYNC_ARCHIVE_TASKS = "ASYNC_ARCHIVE_TASKS"

export function asyncGetUniqueId() {
  return uuidv4();
}

export function asyncActionStart(unique_id, name = null) {
  return {
    type: ASYNC_ACTION_START,
    payload: { unique_id, name },
  };
}

export function asyncActionFinish(unique_id) {
  return {
    type: ASYNC_ACTION_FINISH,
    payload: unique_id,
  };
}

export function asyncActionError(unique_id, error) {
  return {
    type: ASYNC_ACTION_ERROR,
    payload: { unique_id, error },
  };
}

const initialState = {
  tasks: [],
  archived_tasks: [],
  initialized: false,
  no_update_initialized: false,
  error: false,
  loading: false,
};

export default function asyncReducer(state = initialState, { type, payload }) {
  function getTask(unique_id) {
    return state.tasks.find((t) => t.id === unique_id);
  }
  function doesTaskExists(unique_id) {
    return !!getTask(unique_id);
  }

  function assertTaskExists(unique_id) {
    if (!doesTaskExists(unique_id))
      throw new Error(`Task with unique_id ${unique_id} does not exist.`);
  }

  function assertTaskNotExists(unique_id) {
    if (doesTaskExists(unique_id))
      throw new Error(`Task with unique_id ${unique_id} already exists.`);
  }

  function updateConstants(state) {
    const isLoading = state.tasks
      .map((t) => t.state === ASYNC_ACTION_START)
      .reduce((acc, x) => acc || x);

    const isError = state.tasks
      .map((t) => t.state === ASYNC_ACTION_ERROR)
      .reduce((acc, x) => acc || x);

    return {
      ...state,
      loading: isLoading,
      error: isError,
    };
  }


  function startTask(state, payload) {
    const { unique_id, name } = payload;
    return {
      ...state,
      tasks: [
        ...state.tasks,
        {
          id: unique_id,
          state: ASYNC_ACTION_START,
          name,
          started_at: new Date(),
        },
      ],
    };
  }


  function updateTask(state, unique_id, updated_task) {
    const task = getTask(unique_id);
    return {
      ...state,
      tasks: [
        ...state.tasks.filter((t) => t.id !== unique_id),
        {
          ...task,
          ...updated_task,
        },
      ],
    };
  }

  let new_state;
  switch (type) {
    case ASYNC_ACTION_START:
      assertTaskNotExists(payload.unique_id)
      new_state = startTask(state, payload);
      break;
    case ASYNC_ACTION_FINISH:
      assertTaskExists(payload)
      const task = getTask(payload)
      const task_ended_at = new Date()
      const seconds = getDateDiffSeconds(task_ended_at, task.started_at)
      new_state = updateTask(state, payload, { state: ASYNC_ACTION_FINISH, ended_at: task_ended_at, duration: `${seconds}s`});
      break;
    case ASYNC_ACTION_ERROR:
      new_state = updateTask(state, payload.unique_id, {
        state: ASYNC_ACTION_ERROR,
        error: payload.error,
      });
      break;
    case APP_LOADED:
      return {
        ...state,
        initialized: (state.no_update_initialized ? false : true),
      };
    case BLOCK_APP_LOADED:
      return {
        ...state,
        no_update_initialized: true,
      };
    case UNBLOCK_APP_LOADED:
      return {
        ...state,
        no_update_initialized: false,
      };
    case ASYNC_ARCHIVE_TASKS:
      return {
        ...state,
        tasks: [],
        archived_tasks: [...state.archived_tasks, ...state.tasks]
      }
    default:
      return state;
  }

  return updateConstants(new_state);
}
