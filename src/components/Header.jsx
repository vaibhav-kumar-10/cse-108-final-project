import React, { useState, useEffect } from "react";
import HeaderLoggedIn from "./HeaderLoggedIn.jsx";
import HeaderLoggedOut from "./HeaderLoggedOut.jsx"

function Header() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // useEffect(() => {
  //   // Fetch login status from the backend
  //   fetch('http://127.0.0.1:7000/auth/status', {
  //     method: 'GET',
  //     credentials: 'include', // Include cookies for session authentication
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setLoggedIn(data.logged_in);
  //       if (data.logged_in) {
  //         setUsername(data.username);
  //       }
  //     })
  //     .catch((error) => console.error('Error fetching auth status:', error));
  // }, []);

  useEffect(() => {
    const storedStatus = localStorage.getItem('loggedIn') === 'true';
    setLoggedIn(storedStatus);
  }, []);

  return loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />;

}

export default Header;
