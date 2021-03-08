import React from 'react'
import { Tab } from 'semantic-ui-react'
import AboutTab from './AboutTab'
import PasswordForm from './PasswordForm'

export default function ProfileContent({profile}) {
    const panes = [
        {menuItem: 'About', render: () => <AboutTab profile={profile} />},
        {menuItem: 'Change my password', render: () => <PasswordForm />},
    ]
    return (
        <Tab
            menu={{fluid: true, vertical: true}} 
            menuPosition='right'
            panes={panes}
        />
    )
}