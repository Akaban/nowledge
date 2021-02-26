import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';
import SignedOutMenu from './SignedOutMenu';
import SignedInMenu from './SignedInMenu';
import { useSelector } from 'react-redux';

export default function NavBar({setFormOpen}) {
    const {authenticated} = useSelector(state => state.auth)

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 15}}/>
                    NowLedge
                </Menu.Item>
                    {/* <Menu.Item as={NavLink} exact to='/sandbox' name='Sandbox' /> */}
                { authenticated && 
                    <>
                    <Menu.Item as={NavLink} exact to='/books' name='Books' />
                    <Menu.Item as={NavLink} to='/addBook'>
                    <Button content='Upload a book' />
                    </Menu.Item>
                    </>
                    }
                   { authenticated ? <SignedInMenu/> : null }
            </Container>
        </Menu>
    )
}