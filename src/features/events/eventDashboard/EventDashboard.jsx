import React from 'react';
import { Grid } from 'semantic-ui-react';
import EventList from './EventList';
import { useDispatch, useSelector } from 'react-redux';
import EventListItemPlaceholder from './EventListItemPlaceholder';
import EventFilters from './EventFilters';
import { getEventsFromFirestore } from '../../../app/firestore/firestoreService'
import { listenToEvents } from '../eventActions';
import useFirestoreCollection from '../../../app/hooks/useFirestoreCollection';

export default function EventDashboard() {
    const {events} = useSelector(state => state.event)
    const {loading} = useSelector(state => state.async)

    const dispatch = useDispatch();

    useFirestoreCollection({
        query: () => getEventsFromFirestore(),
        data: events => dispatch(listenToEvents(events)),
        deps: [dispatch]
    })

    return (
        <Grid>
            <Grid.Column width={10}>
                {
                    loading &&
                    <>
                        <EventListItemPlaceholder/>
                        <EventListItemPlaceholder/>
                    </>
                }
                { !loading && <EventList events={events}/> }
            </Grid.Column>
            <Grid.Column width={6}>
                <EventFilters/>
            </Grid.Column>
        </Grid>
    )
}