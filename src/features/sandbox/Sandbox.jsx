import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import Autocomplete from '../../app/common/autocomplete/Autocomplete';
import { openModal } from '../../app/common/modals/modalReducer';
import { decrement, increment} from './testReducer';

export default function Sandbox() {
    const dispatch = useDispatch();
    const [target, setTarget] = useState(null);
    const data = useSelector(state => state.test.data)
    const {loading} = useSelector(state => state.async)
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

            <Autocomplete suggestions={[{id: 1, text: 'bonjour'}, {id:2, text:'hello'}]}
                renderSuggestion={(s) => s.text}
                />
            
        </>
    )
}