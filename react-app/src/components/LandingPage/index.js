import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../../store/session";
import { NavLink } from "react-router-dom";

function LandingPage() {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  if (sessionUser) {
    return (
      <div>
        <h1>
          I am Logged in as {sessionUser.first_name}
        </h1>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    )
  }
  return (
    <div>
      <h1>
        I am a landing Page
      </h1>
      <button>
        <NavLink exact to="/login">
          Log In
        </NavLink>
      </button>
      <button>
        <NavLink exact to="/signup">
          Sign Up
        </NavLink>
      </button>

    </div>
  )
}

export default LandingPage
