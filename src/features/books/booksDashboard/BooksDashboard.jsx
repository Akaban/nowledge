import {React, useEffect} from 'react';
import { Grid } from 'semantic-ui-react';
import BookList from './BookList';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import BookListItemPlaceholder from './BookListItemPlaceholder';
import { getBooksFromFirestore, getEventsFromFirestore } from '../../../app/firestore/firestoreService'
import { listenToBooks, listenToEvents, loadBooks } from '../bookActions';
import useFirestoreCollection from '../../../app/hooks/useFirestoreCollection';
import useFirestoreDoc from '../../../app/hooks/useFirestoreDoc';
import LoadingComponent from '../../../app/layout/LoadingComponents';

export default function BooksDashboard() {
    const {books} = useSelector(state => state.books)
    const {loading, error} = useSelector(state => state.async)

    const dispatch = useDispatch();

    useFirestoreDoc({
        query: () => getBooksFromFirestore(),
        data: books => dispatch(listenToBooks(books)),
        deps: [dispatch]
    })
    
    if (loading) return <LoadingComponent content='Loading...'/>


    if (error) return <Redirect to='/error' />

    return (
        <Grid>
            <Grid.Column width={10}>
                {
                    loading &&
                    <>
                        <BookListItemPlaceholder/>
                        <BookListItemPlaceholder/>
                    </>
                }
                { !loading && <BookList books={books}/> }
            </Grid.Column>
        </Grid>
    )
}