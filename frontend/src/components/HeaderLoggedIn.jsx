import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext.js'
import { useLogout } from '../components/Logout.jsx'
import React from 'react';

function HeaderLoggedIn() {

    const { authUser } = useAuth();
    const handleLogout = useLogout();


    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                {/* Left Side: Home Button */}
                <Navbar.Brand href="/">Home</Navbar.Brand>

                {/* Toggle Button for Mobile View */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {/* Welcome Message */}
                        <Nav.Link>
                            Welcome, {authUser || "Guest"}!
                        </Nav.Link>
                        {/* Right Side Buttons */}
                        <Nav.Link href="/portfolio">Portfolio</Nav.Link>
                        <Nav.Link href="/transactions">Transactions</Nav.Link>
                        <Nav.Link href="/trade">Trade</Nav.Link>
                        <Nav.Item>
                            <Button variant="light" className="basic" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default HeaderLoggedIn;