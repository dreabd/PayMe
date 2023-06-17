import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { authenticate, logout } from "../../../../store/session";
import "./Navigation.css"

function Navigation({userLoad,setUserLoad}) {
  const dispatch = useDispatch()

  const user = useSelector(state => state.session.user)

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  useEffect(()=>{
    setUserLoad(false)
    dispatch(authenticate())
  },[userLoad])

  if(!user) return <Redirect exact to="/" />
  return (
    <nav>
      <div className="nav-info-container">
        <NavLink className="navlink" exact to="/user">
          <h1 className="logo">
            PayMe
          </h1>
        </NavLink>
        <p className="first-last-name">
          {user.first_name}, {user.last_name}
        </p>
        <p className="username">
          @{user.username}
        </p>
        <p className="balance-container">
          Balance: <span className="user-balance">${user.balance}</span>
        </p>
      </div>
      <button className="pay-request-button">
        <NavLink className="navlink" to="/user/transaction">
          Pay / Request
        </NavLink>
      </button>
      <NavLink className="navlink" to="/user/cards">
        Manage your Payment Methods
      </NavLink>
      <NavLink className="navlink" to="/user/incomplete">
        Incomplete
      </NavLink>
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </nav>
  )
}

export default Navigation