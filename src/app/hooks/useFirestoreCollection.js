import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { asyncActionError, asyncActionFinish, asyncActionStart, asyncGetUniqueId } from "../async/asyncReducer";
import { dataFromSnapshot } from "../firestore/firestoreService";

export default function useFirestoreCollection({query, data, deps, name='noname', shouldExecute = true}) {
    const dispatch = useDispatch();
    useEffect(() => {
        if (!shouldExecute) return;
        const async_unique_id = asyncGetUniqueId();
        dispatch(asyncActionStart(async_unique_id, name));
        const unsubscribe = query().onSnapshot(
            snapshot => {
                const docs = snapshot.docs.map(dataFromSnapshot)
                try {
                data(docs);
                dispatch(asyncActionFinish(async_unique_id));
                }
                catch (error) {
                    dispatch(asyncActionError(async_unique_id, {code: 'error', message:'Unknown error'}))
                }
            },
            error => {}
        )
        return () => unsubscribe()
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

export function getFirestoreCollection({query, data}) {
   query().get().then(snapshot => {
    const docs = snapshot.docs.map(dataFromSnapshot)
    data(docs)
    })
    
}