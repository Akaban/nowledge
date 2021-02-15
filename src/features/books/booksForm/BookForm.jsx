import cuid from 'cuid';
import { Formik, Form} from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Confirm, Header, Segment} from 'semantic-ui-react';
import * as Yup from "yup"
import MyTextInput from '../../../app/common/form/MyTextInput';
import LoadingComponent from '../../../app/layout/LoadingComponents';
import { toast } from 'react-toastify';
import WidgetDropzone from '../../../app/common/dropzone/WidgetDropzone';
import { addUserBook } from '../../../app/firestore/firestoreService';
import { getFileExtension } from '../../../app/common/util/util';
import { uploadBookDataToFirebaseStore } from '../../../app/firestore/firebaseService';


export default function BookForm({match, history}) {

    const dispatch = useDispatch();
    const [loadingCancel, setLoadingCancel] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [files, setFiles] = useState([])
    const {loading, error} = useSelector(state => state.async)
    const [loadingFile, setLoadingFile] = useState(false)

    async function handleUploadFiles(bookId, pdf, photo) {
        setLoadingFile(true)
        const bookcuid = cuid()
        const {pdfUploadTask, pictureUploadTask} = uploadBookDataToFirebaseStore(bookcuid, pdf, photo)
        const pdfUrl = await pdfUploadTask.then(snapshot => snapshot.ref.getDownloadURL())
        const photoUrl = await pictureUploadTask.then(snapshot => snapshot.ref.getDownloadURL())
        setLoadingFile(false)
        return {
            pdfUrl,
            photoUrl
        }
    }

    const validationSchema = Yup.object({
        title: Yup.string().required('You must provide a title'),
        author: Yup.string().required('You must provide a author'),
    })

    const initialValues = {
        title: '',
        author: ''
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
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={async (values, {setSubmitting}) => {
                try {
                    const bookId = cuid()
                    const {bookPhoto,
                        bookPdf,
                        ...rest
                    } = values;
                    const {
                        pdfUrl,
                        photoUrl
                    } = await handleUploadFiles(bookId, bookPdf[0], bookPhoto[0]);
                    await addUserBook({
                        bookPhotoUrl: photoUrl,
                        bookPdfUrl: pdfUrl,
                        id: bookId,
                        ...rest
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
                <MyTextInput name='title' placeholder='Book title'/>
                <MyTextInput name='author' placeholder='Author'/>
                <Header content='Book Picture' sub color='teal'/>
                <WidgetDropzone setFieldValue={setFieldValue} name='bookPhoto' />
                <Header content='Book File' sub color='teal'/>
                <WidgetDropzone setFieldValue={setFieldValue} name='bookPdf' />
                {/* <MySelectInput name='category' placeholder='Event category' options={categoryData}/> */}
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