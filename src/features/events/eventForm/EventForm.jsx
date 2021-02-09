import cuid from 'cuid';
import { Formik, Form} from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Confirm, Header, Segment} from 'semantic-ui-react';
import {createEvent, listenToEvents, updateEvent} from '../eventActions'
import * as Yup from "yup"
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { categoryData } from '../../../app/api/categoryOptions';
import useFirestoreDoc from '../../../app/hooks/useFirestoreDoc';
import { addEventFirestore, cancelEventToggle, listenToEventFromFirestore, updateEventInFirestore } from '../../../app/firestore/firestoreService';
import LoadingComponent from '../../../app/layout/LoadingComponents';
import { toast } from 'react-toastify';


export default function EventForm({
        setFormOpen, setEvents, match, history}) {

    const dispatch = useDispatch();
    const [loadingCancel, setLoadingCancel] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const selectedEvent = useSelector(state => state.event.events.find(e => e.id === match.params.id));
    const {loading, error} = useSelector(state => state.async)

    const initialValues = selectedEvent ?? {
        title: '',
        category: '',
        description: '',
        city: '',
        venue: '',
        date: '',
        isCancelled: ''
    }

    const validationSchema = Yup.object({
        title: Yup.string().required('You must provide a title'),
        category: Yup.string().required('You must provide a category'),
        city: Yup.string().required(),
        description: Yup.string().required(),
        venue: Yup.string().required(),
        date: Yup.string().required(),
    })

    async function handleCancelToggle(event) {
        setConfirmOpen(false);
        setLoadingCancel(true);
        try {
            await cancelEventToggle(event)
        } catch (error) {
            setLoadingCancel(true)
            toast.error(error.message)
        }
    }

    useFirestoreDoc({
        shouldExecute: !!match.params.id,
        query: () => listenToEventFromFirestore(match.params.id),
        data: event => dispatch(listenToEvents([event])),
        deps: [match.params.id, dispatch]
    })

    if (loading) return <LoadingComponent content='Loading event...'/>

    if (error) return <Redirect to='/error' />

    return (
        <Segment clearing>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, {setSubmitting}) => {
                try {
                    selectedEvent
                    ? await updateEventInFirestore(values)
                    : await addEventFirestore(values)
                        history.push('/events');
                } catch(error) {
                    toast.error(error.message)
                    setSubmitting(false)
                }
                }}
            >
            {({isSubmitting, dirty, isValid}) => (
            <Form className='ui form'>
                <Header content='Event Details' sub color='teal'/>
                <MyTextInput name='title' placeholder='Event title'/>
                <MySelectInput name='category' placeholder='Event category' options={categoryData}/>
                <MyTextArea name='description' placeholder='Event description' rows={3}/>
                <Header content='Event Location Details' sub color='teal'/>
                <MyTextInput name='venue' placeholder='Event venue'/>
                <MyTextInput name='city' placeholder='Event city'/>
                <MyDateInput
                    name='date'
                    placeholderText='Event date'
                    showTimeSelect
                    timeCaption='time'
                    dateFormat='MMMM d, yyyy h:mm a'
                    />
               { selectedEvent && 
                <Button
                    type='button'
                    floated='left'
                    color={selectedEvent.isCancelled ? 'green' : 'red'}
                    content={selectedEvent.isCancelled ? 'Reactivate event' : 'Cancel event'} 
                    onClick={() => setConfirmOpen(true)}
                    />}
                <Button
                    loading={isSubmitting}
                    disabled={!isValid || !dirty || isSubmitting}
                    type='submit'
                    floated='right'
                    positive
                    content='Submit' />
                <Button
                    disabled={isSubmitting}
                    as={Link}
                    to='/events'
                    type='submit'
                    floated='right'
                    content='Cancel' />
            </Form>
            )}
            </Formik>
            <Confirm
                content={selectedEvent.isCancelled ? 'This will reactivate the event - are you sure?' :
                    'This will cancel the event - are you sure?'}
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => handleCancelToggle(selectedEvent) }
            />

        </Segment>
    )
}