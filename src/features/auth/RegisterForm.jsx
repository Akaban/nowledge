import { Form, Formik} from 'formik'
import React from 'react'
import ModalWrapper from '../../app/common/modals/ModalWrapper'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import MyTextInput from '../../app/common/form/MyTextInput'
import { Button, Label } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { closeModal } from '../../app/common/modals/modalReducer'
import { registerInFirebase} from '../../app/firestore/firebaseService'

export default function RegisterForm() {
    const dispatch = useDispatch();
    let history = useHistory();
    return (<ModalWrapper size='mini' header='Register to NowLedge'>
    <Formik
        initialValues ={{displayName: '', email: '', password: ''}}
        validationSchema={Yup.object({
            email: Yup.string().required().email(),
            password: Yup.string().required()
        })}
        onSubmit={async (values, {setSubmitting, setErrors}) => {
            try {
                await registerInFirebase(values)
                setSubmitting(false)
                dispatch(closeModal());
                history.push("/books")
            } catch (error) {
                setErrors({auth: error.message})
                setSubmitting(false)
               
            }
        }}
    >
        {({isSubmitting, isValid, dirty, errors}) => (
            <Form className='ui form'>
               <MyTextInput name='email' placeholder='Email' />
               <MyTextInput type='password' name='password' placeholder='Password' />
               {errors.auth && <Label basic color='red' style={{marginBottom: 10}} content={errors.auth} />}
               <Button
                   loading={isSubmitting}
                   disabled={!isValid || !dirty || isSubmitting}
                   type='submit'
                   fluid
                   size='large'
                   color='teal'
                   content='login'
                 />
                 {/* <Divider horizontal>Or</Divider>
                 <SocialLogin /> */}
            </Form>
            )}

    </Formik>
    </ModalWrapper>)
}