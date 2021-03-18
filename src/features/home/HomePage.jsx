import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "../../app/common/modals/modalReducer";
import { Button, Container, Image, Segment, Header } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import * as qs from 'query-string';

export default function HomePage({ history, location, mixpanel }) {
  const dispatch = useDispatch();
  const { authenticated, prevLocation } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!prevLocation) {
    const parsed = qs.parse(location.search)
    mixpanel.track("Home Page", {urlParams: parsed})
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (authenticated) return <Redirect to="/books" />;
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
          onClick={() => {
            mixpanel.track("Click Login");
            dispatch(
              openModal({ modalType: "LoginForm", modalProps: { mixpanel } })
            );
          }}
          size="massive"
          inverted
          content="Login"
        />
        <Button
          onClick={() => {
            mixpanel.track("Click Register");
            dispatch(
              openModal({ modalType: "RegisterForm", modalProps: { mixpanel } })
            );
          }}
          size="massive"
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
