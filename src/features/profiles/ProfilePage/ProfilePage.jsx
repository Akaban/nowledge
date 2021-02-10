import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import { getUserProfile } from '../../../app/firestore/firestoreService'
import useFirestoreDoc from '../../../app/hooks/useFirestoreDoc'
import LoadingComponent from '../../../app/layout/LoadingComponents'
import { listentoCurrentUserProfile } from '../profileActions'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'

export default function ProfilePage({match}) {
    const dispatch = useDispatch();
    const {currentUserProfile} = useSelector(state => state.profile)
    const {loading, error} = useSelector((state) => state.async)

    useFirestoreDoc({
        query: () => getUserProfile(match.params.id),
        data: profile => dispatch(listentoCurrentUserProfile(profile)),
        deps: [dispatch, match.params.id]
    })

    if ((loading && !currentUserProfile) || (!currentUserProfile && !error)) return <LoadingComponent content = 'Loading profile...'/>

    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader profile={currentUserProfile} />
                <ProfileContent profile={currentUserProfile} />
            </Grid.Column>
        </Grid>
    )
}