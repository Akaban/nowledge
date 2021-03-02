import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Icon, Menu } from "semantic-ui-react";
import { Dropdown } from "react-bootstrap";
import { signOutFirebase } from "../../app/firestore/firebaseService";

export default function SignedInMenu() {
  // const { currentUserProfile } = useSelector((state) => state.profile);
  const history = useHistory();
  const dispatch = useDispatch();

  async function handleSignOut() {
    try {
      history.push("/");
      dispatch({type: 'USER_LOGOUT_RESET_STORE'})
      await signOutFirebase();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Menu.Item position="right">
      {/* <Image avatar spaced='right' src={currentUserProfile.photoURL || '/assets/user.png'} /> */}
      <Dropdown>
        <Dropdown.Toggle className="ui button" id="dropdown-basic">
          Menu
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {/* <Dropdown.Item href="/account">My account</Dropdown.Item> */}
          <Dropdown.Item onClick={handleSignOut}><Icon name="power off"/>Sign out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
}
