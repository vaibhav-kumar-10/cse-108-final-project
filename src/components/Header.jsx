import React, { useState, useEffect } from "react";
import HeaderLoggedIn from "./HeaderLoggedIn.jsx";
import HeaderLoggedOut from "./HeaderLoggedOut.jsx"
import { useAuth } from '../contexts/AuthContext.js'

function Header() {

  const { isLoggedIn } = useAuth(); 

  return isLoggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />;

}

export default Header;
