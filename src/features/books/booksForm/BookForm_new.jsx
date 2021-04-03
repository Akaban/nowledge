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
import formModel from './bookFormModel/model'
import UploadBookForm from './subForms/UploadBookForm';


const { formId, formField, formSteps } = formModel;


function _renderStepContent(step) {
  switch (step) {
    case 0:
      return <h1>Step 0</h1>
    case 1:
      return <h1>Step 1</h1>
    default:
      return <div>Not Found</div>;
  }
}

function _getStepSubmitFunction(step, props) {
    switch(step) {
        case 0:
            const { onSubmit } = UploadBookForm
            return () => onSubmit(props)
        case 1:
            return () => {}
        default:
            throw new Error("Step not found")
    }
}


export default function BookForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [stepData, setStepData] = useState({})
  function getJailedSetStepData(step) {
      return (data) => setStepData({...stepData, step: data})
  }
//   const currentValidationSchema = validationSchema[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  function _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function _submitFormFinal(values, actions) {
    console.log("final form submit")
    actions.setSubmitting(false);

    setActiveStep(activeStep + 1);
  }


  function _handleSubmit(values, actions) {
    if (isLastStep) {
      _submitFormFinal(values, actions);
    } else {
      _getStepSubmitFunction(activeStep, {values, actions, activeStep, setData: getJailedSetStepData(activeStep), stepData})
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  function _handleBack() {
    setActiveStep(activeStep - 1);
  }

  return (
      <>
      <Formik
        initialValues={{"hiddenfield": ""}}
        onSubmit={_handleSubmit}
        >
            {({ isSubmitting }) => (
              <Form id={formId}>
                {_renderStepContent(activeStep)}

                  {activeStep !== 0 && (
                    <Button onClick={_handleBack} >
                      Back
                    </Button>
                  )}
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      {isLastStep ? 'Submit book' : 'Next'}
                    </Button>
              </Form>
            )}
          </Formik>
      </>
  )


export default function BookForm({match, history, mixpanel}) {

    const {loading, error} = useSelector(state => state.async)

    if (loading) return <LoadingComponent content='Loading...'/>

    if (error) return <Redirect to='/error' />

    return (
        <Segment clearing>
            <Formik
                initialValues={{hiddenfield: 'hiddenvalue'}}
                onSubmit={async (values, {setSubmitting}) => {
                try {
                    const {
                        bookPdf
                    } = values;

                    // if (!bookObject)
                    //     throw new Error("You did not provide book data.");
                    if (!bookPdf)
                        throw new Error("You did not provide a book file.")

                    const bookId = cuid()
                    const {
                        thumbnail_url,
                        book_checksum
                    } = await uploadBook(bookId, bookPdf);
                    await addUserBook({
                        id: bookId,
                        bookPhotoUrl: thumbnail_url
                    })
                    mixpanel.track("Book Added")
                    history.push('/books');
                } catch(error) {
                    toast.error(error.message)
                } finally {
                    setSubmitting(false)
                }
                }}
            >
            {({isSubmitting, dirty, isValid, setFieldValue}) => (
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
            )}
            </Formik>
        </Segment>
    )
}