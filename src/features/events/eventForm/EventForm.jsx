import cuid from 'cuid';
import { Formik, Form} from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Header, Segment} from 'semantic-ui-react';
import {createEvent, updateEvent} from '../eventActions'
import * as Yup from "yup"
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { categoryData } from '../../../app/api/categoryOptions';


export default function EventForm({
        setFormOpen, setEvents, match, history}) {

    const dispatch = useDispatch();
    const selectedEvent = useSelector(state => state.event.events.find(e => e.id === match.params.id));

    console.log(`selected event = ${selectedEvent}`)

    const initialValues = selectedEvent ?? {
        title: '',
        category: '',
        description: '',
        city: '',
        venue: '',
        date: '',
    }

    const validationSchema = Yup.object({
        title: Yup.string().required('You must provide a title'),
        category: Yup.string().required('You must provide a category'),
        city: Yup.string().required(),
        description: Yup.string().required(),
        venue: Yup.string().required(),
        date: Yup.string().required(),
    })

    return (
        <Segment clearing>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={values => {
                selectedEvent
                ? dispatch(updateEvent({...selectedEvent, ...values}))
                : dispatch(createEvent(
                    {...values,
                        id: cuid(),
                        hostedBy: 'Bob',
                        attendees: [],
                        hostPhotoURL: '/assets/user.png'
                    }));
                    history.push('/events');
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
        </Segment>
    )
}