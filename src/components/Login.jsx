import React, { useState } from "react";
import { useAuth } from '../contexts/AuthContext.js';
import { useNavigate } from "react-router-dom";

function Login() {

    const { isLoggedIn, login } = useAuth(); 

    const [id, setID] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleLogin = async (e) => {
        if (isLoggedIn)
            return;

        e.preventDefault(); // Prevent page refresh

        // Define the backend endpoint
        const url = "http://127.0.0.1:7000/login";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ id, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid username or password.");
            }

            // Redirect and save authentication token, e.g.:
            navigate('/');
            setError(null);
            login(id);
        } catch (err) {
            // Handle errors
            setError(err.message);
        }
    };

    return (
        <div className="login-container" style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={id}
                        onChange={(e) => setID(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px" }}>
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
