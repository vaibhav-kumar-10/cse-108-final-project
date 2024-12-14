// import React, { createContext, useState, useContext } from 'react';

// const AuthContext = createContext();

// export function useAuth() {
//     return useContext(AuthContext);
// }

// export function AuthProvider( {children} ) {
//     const [authUser, setAuthUser] = useState(null);
//     const [loggedIn, setLoggedIn] = useState(false);

//     const login = (id) => {
//         setLoggedIn(true)
//         setAuthUser({
//             name: id
//         })
//     }

//     const logout = () => {
//         setLoggedIn(false)
//         setAuthUser(false)
//     }

//     const value = {
//         authUser,
//         loggedIn,
//         login,
//         logout
//     }

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );

// }


import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [authUser, setAuthUser] = useState(() => {
        const storedUser = localStorage.getItem('authUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('authUser');
    });

    useEffect(() => {
        if (isLoggedIn && authUser) {
            localStorage.setItem('authUser', JSON.stringify(authUser));
        } else {
            // localStorage.removeItem('authUser');
        }
    }, [isLoggedIn, authUser]);

    const login = (user) => {
        setAuthUser(user);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setAuthUser(null);
        setIsLoggedIn(false);
    };

    const value = {
        authUser,
        isLoggedIn,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
