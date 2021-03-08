import React, { useState } from 'react'
import { Button, Grid, Header, Tab } from 'semantic-ui-react'
import { format } from 'date-fns'
import ProfileForm from './ProfileForm.oldjsx'

export default function AboutTab({profile}) {
    const [editMode, setEditMode] = useState(false)
    return (
        <Tab.Pane>
        <Grid>
            <Grid.Column width={16}>
                <Header floated='left' icon='user' content={`About`} />
                {/* <Button onClick={() => setEditMode(!editMode)} floated='right' basic content={editMode ? 'Cancel': 'Edit'} /> */}
            </Grid.Column>
            <Grid.Column width={16}>
                {null ? <ProfileForm profile={profile}/> : 
                    <>
                        <div style={{marginBottom: 10}}>
                            <strong>Member since: {format(profile.createdAt, "dd/MM/yyyy")} </strong>
                        </div>
                    </>
                }
            </Grid.Column>
        </Grid>

        </Tab.Pane>
    )
}