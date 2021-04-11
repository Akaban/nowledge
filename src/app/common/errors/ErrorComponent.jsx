import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Header, Segment } from 'semantic-ui-react'
import { ASYNC_ARCHIVE_TASKS } from '../../async/asyncReducer'

export default function ErrorComponent({ mixpanel }) {
    const {error} = useSelector(state => state.async)
    const {prevLocation, authenticated} = useSelector(state => state.auth)

    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(ASYNC_ARCHIVE_TASKS)
    }, [dispatch])

  useEffect(() => {
    mixpanel.track("Error", {error, prevLocation});
  }, [mixpanel, error, prevLocation]);
    return (
        <Segment placeholder>
            <Header textAlign='center' content={error?.message || 'Ooops we have an error'} />
            <Button as={Link} to={authenticated ? '/books' : '/'} primary style={{marginTop:20}} content='Return to home' />
        </Segment>
    )

}