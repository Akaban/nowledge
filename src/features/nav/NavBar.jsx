import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";
import SignedInMenu from "./SignedInMenu";
import { useSelector } from "react-redux";
import WidgetDropzone from "../../app/common/dropzone/WidgetDropzone";
import { submitBook } from "../books/booksForm/BookForm";

export function UploadBookButton({color=null, className=null}) {
    const props = {}
    if (color) props['color'] = color;
    if (className) props['className'] = className;
  return (
    <WidgetDropzone onSuccessfulLoad={submitBook}>
      <Button content="Upload book" {...props} />
    </WidgetDropzone>
  );
}

export default function NavBar({ setFormOpen, mixpanel }) {
  const { authenticated } = useSelector((state) => state.auth);

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item header as={Link} to="/books">
          <img src="/assets/logo.png" alt="logo" style={{ marginRight: 15 }} />
          NowLedge
        </Menu.Item>
        {/* <Menu.Item as={NavLink} exact to='/sandbox' name='Sandbox' /> */}
        {authenticated && (
          <>
            <Menu.Item
              as={NavLink}
              onClick={() => mixpanel.track("Books NavBar link clicked")}
              exact
              to="/books"
              name="Books"
            />
            <Menu.Item>
              <UploadBookButton />
            </Menu.Item>
          </>
        )}
        {authenticated ? <SignedInMenu mixpanel={mixpanel} /> : null}
      </Container>
    </Menu>
  );
}
