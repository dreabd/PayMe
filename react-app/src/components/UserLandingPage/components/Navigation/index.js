import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { logout } from "../../../../store/session";
import "./Navigation.css"

function Navigation() {
  const dispatch = useDispatch()

  const user = useSelector(state => state.session.user)

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  if(!user) return <Redirect exact to="/" />
  return (
    <nav>
      <div className="nav-info-container">
        <NavLink className="navlink" exact to="/user">
          <h1 className="logo">
            PayMe
          </h1>
        </NavLink>
        <h3>
          {user.first_name}, {user.last_name}
        </h3>
        <p>
          @{user.username}
        </p>
        <p>
          Balance:<span>${user.balance}</span>
        </p>
      </div>
      <button className="pay-request-button">
        <NavLink className="navlink" exact to="/user/transaction">
          Pay / Request
        </NavLink>
      </button>
      <NavLink className="navlink" exact to="/user/cards">
        Manage your Payment Methods
      </NavLink>
      <NavLink className="navlink" exact to="/user/incomplete">
        Incomplete
      </NavLink>
      <button onClick={handleLogout}>
        Log Out
      </button>
    </nav>
  )
}

export default Navigation
