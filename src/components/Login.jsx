import React, { useState } from "react";

function Login() {
    const [id, setID] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent page refresh

        // Define the backend endpoint
        const url = "http://127.0.0.1:7000/login";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, password }),
                // credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("Invalid username or password.");
            }

            const data = await response.json();

            // Handle successful login
            alert(`Welcome, ${data.id}!`);
            setError(null);
            // Redirect or save authentication token, e.g.:
            localStorage.setItem('loggedIn', 'true');
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
