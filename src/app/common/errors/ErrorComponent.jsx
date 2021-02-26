import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Header, Segment } from 'semantic-ui-react'

export default function ErrorComponent() {
    const {error} = useSelector(state => state.async)

    return (
        <Segment placeholder>
            <Header textAlign='center' content={error?.message || 'Ooops we have an error'} />
            <Button as={Link} to='/' primary style={{marginTop:20}} content='Return to home' />
        </Segment>
    )

}