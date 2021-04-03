import React from "react";
import { Header, Icon } from "semantic-ui-react";

export default function MobileNotImplemented() {
  return (
    <>
      <Header content="Sorry but this app is not yet implemented for mobile :(" />
      <p>
        We are working to make this app available for mobile but right now it is
        only available on desktop.
        <br />
        <br />
        We only want to provide the best user experience, which is why made such
        a choice.
      </p>
      But don't worry we will let you know when is is available for mobile by
      mail!
      <br />
      <br />
      Thanks for your interest <Icon name="heart" />.<br />
      <br />
      <a href="https://tichit.net">Bryce Tichit</a>, maker of NowLedge.
    </>
  );
}
