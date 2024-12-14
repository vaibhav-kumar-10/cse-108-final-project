import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';

function Logout() {

    const { isLoggedIn, logout } = useAuth();

    useEffect(() => {
        async function handleLogout() {
            // if (!isLoggedIn)
            //     return;
            try {
                const response = await fetch('http://127.0.0.1:7000/logout', {
                    method: 'POST',
                    credentials: 'include',
                });
                if (response.ok) {
                    console.log('Successfully logged out');
                    // logout();
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('An error occurred during logout:', error);
            }
        }

        handleLogout();
    });

    return (
        <p>You have been logged out!</p>
    );
}

export default Logout