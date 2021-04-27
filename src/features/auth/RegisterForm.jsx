import { Form, Formik} from 'formik'
import React from 'react'
import ModalWrapper from '../../app/common/modals/ModalWrapper'
import * as Yup from 'yup'
import MyTextInput from '../../app/common/form/MyTextInput'
import { Button, Label } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { closeModal } from '../../app/common/modals/modalReducer'
import { registerInFirebase} from '../../app/firestore/firebaseService'

export default function RegisterForm({ mixpanel }) {
    const dispatch = useDispatch();
    return (<ModalWrapper size='mini' header='Register to NowLedge'>
    <Formik
        initialValues ={{displayName: '', email: '', password: ''}}
        validationSchema={Yup.object({
            email: Yup.string().required().email(),
            name: Yup.string().required(),
            password: Yup.string().required()
        })}
        onSubmit={async (values, {setSubmitting, setErrors}) => {
            try {
                console.log("registering in firebase...")
                await registerInFirebase(values)
                mixpanel.track("Registered")
                setSubmitting(false)
                dispatch(closeModal());
            } catch (error) {
                setErrors({auth: error.message})
                setSubmitting(false)
               
            }
        }}
    >
        {({isSubmitting, isValid, dirty, errors}) => (
            <Form className='ui form'>
               <MyTextInput name='email' placeholder='Email' />
               <MyTextInput name='name' placeholder='Your name' />
               <MyTextInput type='password' name='password' placeholder='Password' />
               {errors.auth && <Label basic color='red' style={{marginBottom: 10}} content={errors.auth} />}
               <Button
                   loading={isSubmitting}
                   disabled={!isValid || !dirty || isSubmitting}
                   type='submit'
                   fluid
                   size='large'
                   color='teal'
                   content='Register'
                 />
                 {/* <Divider horizontal>Or</Divider>
                 <SocialLogin /> */}
            </Form>
            )}

    </Formik>
    </ModalWrapper>)
}