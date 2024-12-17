import { useAuth } from '../contexts/AuthContext.js';



export function useLogout() {
    const { logout } = useAuth();
    

    const handleLogout = async () => {
        const access_token = localStorage.getItem("access_token");
        console.log(access_token);
        try {
            const response = await fetch('http://127.0.0.1:7000/auth/logout', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${access_token}`,  // Add the Bearer token to the Authorization header
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                logout();
                localStorage.removeItem("refresh_token");
                window.location.href = '/';

            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    return handleLogout; // Export the logout function
}