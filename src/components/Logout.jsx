import { useEffect } from 'react';

function Logout() {

    useEffect(() => {
        async function handleLogout() {
            try {
                const response = await fetch('http://127.0.0.1:7000/logout', {
                    method: 'POST',
                    // credentials: 'include',
                });
                if (response.ok) {
                    console.log('Successfully logged out');
                    localStorage.removeItem('loggedIn');
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('An error occurred during logout:', error);
                localStorage.removeItem('loggedIn'); // Change from adjusting cookies based on auth status
            }
        }

        handleLogout();
    });

    return (
        <p>You have been logged out!</p>
    );
}

export default Logout