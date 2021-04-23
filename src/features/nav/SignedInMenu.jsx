import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Icon, Menu } from "semantic-ui-react";
import { Dropdown } from "react-bootstrap";
import { signOutFirebase } from "../../app/firestore/firebaseService";

export default function SignedInMenu({ mixpanel }) {
  // const { currentUserProfile } = useSelector((state) => state.profile);
  const history = useHistory();

  const refDropdown = useRef(null);

  useEffect(() => {
    function mixpanelTrackMenu() {
      mixpanel.track("Click Menu")
    }
    if (refDropdown && refDropdown.current) {
      refDropdown.current.addEventListener("click", mixpanelTrackMenu)
      const refDropdownCurrent = refDropdown.current
      return () => refDropdownCurrent.removeEventListener("click", mixpanelTrackMenu)
    }
  })

  async function handleSignOut() {
    try {
      mixpanel.track("Menu Click Signout")
      await signOutFirebase();
      history.push("/");
    } catch (error) {
      toast.error(error.message);
    }
  }

  function openTawkChat() {
    window.Tawk_API.popup();
  }

  return (
    <Menu.Item position="right">
      {/* <Image avatar spaced='right' src={currentUserProfile.photoURL || '/assets/user.png'} /> */}
      <Dropdown>
        <Dropdown.Toggle ref={refDropdown} className="ui button" id="dropdown-basic" >
          Menu
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => {mixpanel.track("Click Menu Profile") ; history.push("/profile")}}><Icon name="user"/>My profile</Dropdown.Item>
          <Dropdown.Item onClick={handleSignOut}><Icon name="power off"/>Sign out</Dropdown.Item>
          {/* <Dropdown.Item onClick={openTawkChat}><Icon name="chat"/>Click to Chat</Dropdown.Item> */}
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
}
