import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, List, Segment } from 'semantic-ui-react';
import EventListAttendee from './EventListAttendee';

export default function EventListItem({event}) {
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item.Image size='tiny' circular src={event.hostPhotoURL} />
                    <Item.Content>
                        <Item.Header content={event.title} />
                        <Item.Description>
                            Hosted by {event.hostedBy}
                        </Item.Description>
                    </Item.Content>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {event.date}
                    <Icon name='marker' /> {event.venue}
                </span>
            </Segment>
            <Segment secondary>
                <List horizontal>
                    {event.attendees.map(attendee => (
                        <EventListAttendee key={attendee.id} attendee={attendee}/>
                    ))}
                </List>

            </Segment>
            <Segment clearing>
                <span>{event.description}</span>
                <Button as={Link} to={`/events/${event.id}`} color='teal' floated='right' content='View'/>
                {/* <Button as={Link} to={`/events/${event.id}`} color='red' floated='right' content='Delete'/> */}
            </Segment>
        </Segment.Group>
    )
}