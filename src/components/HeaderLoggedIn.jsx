import { Navbar, Nav, Container, Button } from "react-bootstrap";

function HeaderLoggedIn() {
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
                        <Button variant="light" href="/logout">
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default HeaderLoggedIn;