import cuid from 'cuid';
import { Formik, Form} from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Header, Segment} from 'semantic-ui-react';
import MyTextInput from '../../../app/common/form/MyTextInput';
import LoadingComponent from '../../../app/layout/LoadingComponents';
import WidgetDropzone from '../../../app/common/dropzone/WidgetDropzone';
import { addUserBook } from '../../../app/firestore/firestoreService';
import { uploadBookDataToFirebaseStore } from '../../../app/firestore/firebaseService';
import BookSearchWidget from './BookSearchWidget';
import { transformToFirestoreFormat } from '../../../app/common/openlibrary/transform';


export default function BookForm({match, history}) {

    const {loading, error} = useSelector(state => state.async)

    async function handleUploadFiles(bookId, pdf) {
        const {pdfUploadTask} = uploadBookDataToFirebaseStore(bookId, pdf)
        const pdfUrl = await pdfUploadTask.then(snapshot => snapshot.ref.getDownloadURL())
        return {
            pdfUrl,
        }
    }

    // useFirestoreDoc({
    //     shouldExecute: !!match.params.id,
    //     query: () => listenToEventFromFirestore(match.params.id),
    //     data: event => dispatch(listenToEvents([event])),
    //     deps: [match.params.id, dispatch]
    // })


    if (loading) return <LoadingComponent content='Loading...'/>

    if (error) return <Redirect to='/error' />

    return (
        <Segment clearing>
            <Formik
                initialValues={{hiddenfield: 'hiddenvalue'}}
                onSubmit={async (values, {setSubmitting}) => {
                try {
                    const bookId = cuid()
                    const {
                        bookPdf,
                        bookObject
                    } = values;
                    const {
                        pdfUrl,
                    } = await handleUploadFiles(bookId, bookPdf[0]);
                    await addUserBook({
                        bookPdfUrl: pdfUrl,
                        id: bookId,
                        ...transformToFirestoreFormat(bookObject)
                    })
                    history.push('/books');
                } catch(error) {
                    throw error
                    // toast.error(error.message)
                } finally {
                    setSubmitting(false)
                }
                }}
            >
            {({isSubmitting, dirty, isValid, setFieldValue}) => (
            <Form className='ui form'>
                <Header content='Book Data' sub color='teal'/>
                <BookSearchWidget setFieldValue={setFieldValue} />
                <Header content='Book File' sub color='teal'/>
                <WidgetDropzone setFieldValue={setFieldValue} name='bookPdf' />
                {/* <MySelectInput name='category' placeholder='Event category' options={categoryData}/> */}
                <MyTextInput type='hidden' name='hiddenfield' />
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
                    to='/books'
                    type='submit'
                    floated='right'
                    content='Cancel' />
            </Form>
            )}
            </Formik>
        </Segment>
    )
}