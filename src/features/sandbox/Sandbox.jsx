import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import Autocomplete from '../../app/common/autocomplete/Autocomplete';
import { openModal } from '../../app/common/modals/modalReducer';
import { deleteFileFromFirebaseStore } from '../../app/firestore/firebaseService';
import { decrement, increment} from './testReducer';

export default function Sandbox() {
    const dispatch = useDispatch();
    const [target, setTarget] = useState(null);
    const data = useSelector(state => state.test.data)
    const {loading} = useSelector(state => state.async)

    const file_to_delete = "https://firebasestorage.googleapis.com/v0/b/nowledge-c01c4.appspot.com/o/AQs5TAzq8gSJHHHBOdKvpbW0y0U2%2FuserBooks%2Fcklhvhjga00013162679xnf54%2Fcklhvhjga00013162679xnf54.pdf?alt=media&token=c30ca486-0c86-459e-85a0-9dd5c843b656"
    return (
        <>
            <h1>Test 123</h1>
            <h3>The data is: {data}</h3>
            <Button
                name='increment'
                loading={loading && target === 'decrement'} onClick={(e) => {
                  dispatch(increment(20))
                  setTarget(e.target.name)
                }
                }
                 content='Increment' color='green'/>
            <Button
                name='decrement'
                loading={loading && target === 'decrement'}
                onClick={(e) => {
                   dispatch(decrement(10));
                   setTarget(e.target.name)
                } }
                content='Decrement' color='orange'/>
            <Button onClick={() => dispatch(openModal({modalType: 'TestModal', modalProps: {data}}))} content='Open Modal' color='teal'/>

            <Button onClick={() => deleteFileFromFirebaseStore(file_to_delete)} color='teal' content='Delete file from store' />
            
        </>
    )
}