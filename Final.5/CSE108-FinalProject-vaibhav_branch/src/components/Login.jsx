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
        const url = "http://127.0.0.1:7000/auth/login";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: id, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid username or password.");
            }

            const data = await response.json();

            // Check if the refresh token is present in the response
            if (data.refresh_token && data.access_token && data.name) {
                // Store the refresh token securely (e.g., HTTP-only cookie or localStorage)
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("access_token", data.access_token);
                // save authentication token
                const user_id = data.name;
                localStorage.setItem("user_id", user_id);
                login(user_id);
            }

            navigate('/');
            setError(null);

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
                    <label htmlFor="username">Email</label>
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
