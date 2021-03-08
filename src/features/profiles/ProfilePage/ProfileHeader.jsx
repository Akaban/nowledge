import React from 'react'
import { Grid, Header, Item, Segment } from 'semantic-ui-react'

export default function ProfileHeader({profile, isCurrentUser}) {
    return (
    <Segment>
        <Grid>
            <Grid.Column width={12}>
                <Item.Group>
                    <Item>
                        <Item.Content verticalAlign='middle'>
                            <Header as='h1' style={{display:'block', marginBottom: 10}} content={profile.displayName}/>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Grid.Column>
        </Grid>
    </Segment>

    )
}