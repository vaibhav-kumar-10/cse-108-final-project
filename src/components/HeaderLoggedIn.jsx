import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext.js'

function HeaderLoggedIn() {

    const { authUser } = useAuth(); 

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
                            Welcome, {authUser?.name || "Guest"}!
                        </Nav.Link>
                        {/* Right Side Buttons */}
                        <Nav.Link href="/transactions">Transactions</Nav.Link>
                        <Nav.Link href="/portfolio">Portfolio</Nav.Link>
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