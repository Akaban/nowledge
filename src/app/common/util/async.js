import {
  asyncActionError,
  asyncActionFinish,
  asyncActionStart,
} from "../../async/asyncReducer";

export function async_compose(funcs, then) {
  const zip = (a, b) => a.map((k, i) => [k, b[i]]);
  return async function (dispatch) {
    dispatch(asyncActionStart());
    try {
      await Promise.all(
        zip(funcs, then).map(async (f, t) => {
          f.then(t);
        })
      );
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionError());
    }
  };
}
