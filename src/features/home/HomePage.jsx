import React from "react";
import { useDispatch } from 'react-redux'
import { openModal } from '../../app/common/modals/modalReducer';
import {
  Button,
  Container,
  Icon,
  Image,
  Segment,
  Header,
} from "semantic-ui-react";
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux'

export default function HomePage({ history }) {
    const dispatch = useDispatch();
    const {authenticated} = useSelector(state => state.auth)
      if (authenticated)
        return <Redirect to="/books" />
  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            style={{ marginBottom: 12 }}
          />
          NowLedge
        </Header>
        <Button
          onClick={() => dispatch(openModal({ modalType: "LoginForm" }))}
          size="massive"
          inverted
          content="Login"
        />
        <Button
          onClick={() => dispatch(openModal({ modalType: "RegisterForm" }))}
          size='massive'
          inverted
          content="Register"
          style={{ marginLeft: "0.5em" }}
        />
        {/* <Button onClick={() => history.push("/books")} size="huge" inverted>
          Get started
          <Icon name="right arrow" inverted />
        </Button> */}
      </Container>
    </Segment>
  );
}
