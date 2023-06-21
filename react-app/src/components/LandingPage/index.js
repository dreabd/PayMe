import React from "react";
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import "./LandingPage.css"
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

function LandingPage() {
  const sessionUser = useSelector(state => state.session.user);

  if (sessionUser) {
    return <Redirect exact to="/user" />
  }
  return (
    <div className="landing-container">
      <div className="top-landing-container">
        <NavLink className="navlink" exact to="/">
          <h1 className="logo">
            PayMe
          </h1>
        </NavLink>

        <div className="landing-button-container">
          <button>
            <NavLink className="navlink" exact to="/login">
              Log In
            </NavLink>
          </button>
          <button className="sign-up-button">
            <NavLink className="navlink" exact to="/signup">
              Sign Up
            </NavLink>
          </button>
        </div>
      </div>

      <div className="bottom-landing-container">
        <div className="motto-container">
          <h1>
            Fast,safe,social payments
          </h1>
          <p>
            Pay. Get paid. Shop. Share. Join tens of millions of people on Payme.
          </p>
          <button>
            <NavLink className="navlink motto-button-txt" exact to="/signup">
              Get PayMe
            </NavLink>
          </button>
        </div>
        <img src="https://images.ctfassets.net/gkyt4bl1j2fs/alUHU4ShZNyUjxh5Y9354/4df5f66d626d8bc524e1b1e29ce6cd78/homepage_phone1_desktop.png?w=1157&h=1388&q=50&fm=webp&bg=transparent" alt="" />
      </div>

    </div>
  )
}

export default LandingPage
