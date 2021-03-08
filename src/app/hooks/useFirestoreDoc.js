import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { asyncActionError, asyncActionFinish, asyncActionStart, asyncGetUniqueId } from "../async/asyncReducer";
import { dataFromSnapshot } from "../firestore/firestoreService";

export default function useFirestoreDoc({query, data, deps, name='noname', shouldExecute = true}) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!shouldExecute) return;
        const async_unique_id = asyncGetUniqueId();
        dispatch(asyncActionStart(async_unique_id, name));
        const unsubscribe = query().onSnapshot(
            snapshot => {
                if (!snapshot.exists) {
                    dispatch(asyncActionError(async_unique_id, {code: 'not-found', message:'Could not find document'}))
                    return;
                }
                try {
                data(dataFromSnapshot(snapshot));
                dispatch(asyncActionFinish(async_unique_id));
                }
                catch (error) {
                    dispatch(asyncActionError(async_unique_id, {code: 'error', message:'Unknown error'}))
                }
            },
            error => dispatch(asyncActionError(async_unique_id, {code: 'error', message:'Unknown error'}))

        );
        return () => {
            unsubscribe()
        }
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps

}