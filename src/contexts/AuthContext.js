import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    
    const handleRefresh = async () => {
        const url = "http://127.0.0.1:7000/auth/refresh";

        const refresh_token = localStorage.getItem('refresh_token');
        if (refresh_token == null)
            return;

        console.log("Token " + refresh_token);
        try {
            // Send the refresh token to the backend with credentials included to pass cookies automatically
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${refresh_token}`,  // Add the Bearer token to the Authorization header
                    "Content-Type": "application/json",
                },
            });

            // Check if the response was successful
            if (response.ok) {
                const data = await response.json();
                // Check if the acess token is present in the response
                if (data.access_token)
                    localStorage.setItem("access_token", data.access_token);
            } else {
                console.error("Failed to refresh token:", response.statusText);
                localStorage.removeItem("refresh_token"); // refresh token is also expired
                logout();
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            logout();
        }
    };

    const [authUser, setAuthUser] = useState(() => {
        const storedUser = localStorage.getItem('authUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('authUser');
    });

    useEffect(() => {
        // Create smoother UI by assuming user is logged in, if auth cookie exists
        const user_id = localStorage.getItem('user_id');
        if (user_id != null)
            login(user_id);
        // Check if the session cookie exists
        handleRefresh();
    }, []);

    const login = (user) => {
        setAuthUser(user);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setAuthUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        
    };

    const value = {
        authUser,
        isLoggedIn,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
