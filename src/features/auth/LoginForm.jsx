import { Form, Formik} from 'formik'
import React from 'react'
import ModalWrapper from '../../app/common/modals/ModalWrapper'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import MyTextInput from '../../app/common/form/MyTextInput'
import { Button, Label } from 'semantic-ui-react'
import { closeModal } from '../../app/common/modals/modalReducer'
import { signInWithEmail } from '../../app/firestore/firebaseService'

export default function LoginForm({ mixpanel }) {
    const dispatch = useDispatch();

    return (<ModalWrapper size='mini' header='Sign in to NowLedge'>
    <Formik
        initialValues ={{email: '', password: ''}}
        validationSchema={Yup.object({
            email: Yup.string().required().email(),
            password: Yup.string().required()
        })}
        onSubmit={async (values, {setSubmitting, setErrors}) => {
            try {
                await signInWithEmail(values, mixpanel)
                // history.push("/books") // diabled because of redirect in HomePage
                setSubmitting(false)
                dispatch(closeModal())
            } catch (error) {
               setErrors({auth: 'Problem with username or password'})
               setSubmitting(false)
            //    console.log(error) 
            } finally {
            }
        }}
    >
        {({isSubmitting, isValid, dirty, errors}) => (
            <Form className='ui form'>
               <MyTextInput name='email' placeholder='Email' />
               <MyTextInput type='password' name='password' placeholder='Password' />
               {errors.auth && <Label basic color='red' style={{marginBottom: 10}} content={errors.auth} /> }
               <Button
                   loading={isSubmitting}
                   disabled={!isValid || !dirty || isSubmitting}
                   type='submit'
                   fluid
                   size='large'
                   color='teal'
                   content='login'
                 />
            </Form>
            )}

    </Formik>
    </ModalWrapper>)
}