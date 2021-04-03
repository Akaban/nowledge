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
import { toast } from 'react-toastify';
import { uploadBook } from '../../../app/backend/book';

function onSubmit(props) {
    console.log("submit upload book form")
}

function UploadBook(props) {
    return (
            <Form className='ui form'>
                {/* <Header content='Book Data' sub color='teal'/>
                <BookSearchWidget setFieldValue={setFieldValue} /> */}
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
    )
}

const UploadBookForm = {
    onSubmit,
    formBody: UploadBook
}

export default UploadBookForm