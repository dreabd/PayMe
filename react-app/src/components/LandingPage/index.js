import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function LandingPage() {
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
