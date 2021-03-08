import React from 'react';
import { Formik, Form } from 'formik';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { Tab } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { updatePassword } from '../../../app/firestore/firestoreService';

require('yup-password')(Yup) 

export default function PasswordForm() {
    return (
        <Tab.Pane>
        <Formik
            initialValues={{
                password: '',
                passwordConfirmation: ''
            }}
            validationSchema={Yup.object({
                password: Yup.string().password().required(),
                passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
            })}
            onSubmit={({password, passwordConfirmation}, {setSubmitting}) => {
                try {
                    updatePassword(password, passwordConfirmation);
                    toast.success("Password succesfully updated!")
                } catch (error) {
                    toast.error(error.message);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({isSubmitting, isValid, dirty}) => (
                <Form className='ui form'>
                <MyTextInput name='password' type='password' placeholder='Password' />
                <MyTextInput name='passwordConfirmation' type='password' placeholder='Confirm password' />
                <Button 
                    loading={isSubmitting}
                    disabled={isSubmitting || !isValid || !dirty}
                    floated='right'
                    type='submit'
                    size='large'
                    positive
                    content='Update password'
                />
            </Form>
            )}
            
        </Formik>
        </Tab.Pane>
    )
}