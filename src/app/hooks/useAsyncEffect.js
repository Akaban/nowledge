import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { asyncActionError, asyncActionFinish, asyncActionStart, asyncGetUniqueId } from "../async/asyncReducer";

export default function useAsyncEffect({fetch, after, deps, name='noname', shouldExecute = true}) {
    const dispatch = useDispatch();

    useEffect(() => {
        async function doFetch(unique_id) {
            try {
            dispatch(asyncActionStart(unique_id, name))
            const result = await fetch();
            after(result);
            dispatch(asyncActionFinish(unique_id))
            } catch(error) {
                dispatch(asyncActionError(unique_id, {code: 'error', message: 'Unknown error'}))
            }
        }
        if (!shouldExecute) return;
        const async_unique_id = asyncGetUniqueId();
        doFetch(async_unique_id)

    }, deps) // eslint-disable-line react-hooks/exhaustive-deps

}