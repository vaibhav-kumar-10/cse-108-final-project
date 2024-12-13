import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/* Left Side: Home Button */}
        <Navbar.Brand href="/">Home</Navbar.Brand>

        {/* Toggle Button for Mobile View */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Right Side Buttons */}
            <Nav.Link href="/transactions">Transactions</Nav.Link>
            <Nav.Link href="/portfolio">Portfolio</Nav.Link>
            <Button variant="outline-light" href="/login" className="me-2">
              Login
            </Button>
            <Button variant="light" href="/register">
              Register
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
