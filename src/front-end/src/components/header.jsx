import React from 'react';
import { Navbar } from 'react-bootstrap';

const Header = props => (
  <Navbar fixedTop>
    <Navbar.Header>
      <Navbar.Brand>
        Chiang Mai Movies
      </Navbar.Brand>
      <Navbar.Text>
        MAYA Mall - {props.date}
      </Navbar.Text>
    </Navbar.Header>
  </Navbar>
);

export default Header;
