import React from 'react'
import { Button } from 'semantic-ui-react'
import { socialLogin } from '../../app/firestore/firebaseService';

export default function SocialLogin() {
    function handleSocialLogin() {
        socialLogin()
    }
    return (
            <Button onClick={handleSocialLogin} icon='google' fluid color='google plus' style={{marginBottom: 10}}
            content='Login with Google' />
        )
}