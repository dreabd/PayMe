import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { Redirect, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { authenticate, logout } from "../../../../store/session";
import "./Navigation.css"
import AboutMe from "../../../AboutMe";

function Navigation({ userLoad, setUserLoad }) {
  const dispatch = useDispatch()
  const history = useHistory()

  const user = useSelector(state => state.session.user)

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  useEffect(() => {
    setUserLoad(false)
    dispatch(authenticate())
  }, [dispatch,userLoad])

  const payRequestRouting = e => {
    history.push("/user/transaction")
  }
  if (!user) return <Redirect exact to="/" />
  return (
    <nav>
      <div className="nav-info-container">
        <NavLink className="navlink" exact to="/user">
          <h1 className="logo">
            PayMe
          </h1>
        </NavLink>
        <p className="first-last-name">
          <NavLink className="navlink important-navlinks" to={`/user/${user.id}`}>
            {user.first_name}, {user.last_name}
          </NavLink>

        </p>
        <p className="username">
          @{user.username}
        </p>
        <p className="balance-container">
          Balance: <span className="user-balance">${user.balance}</span>
        </p>

      </div>

      <button onClick={payRequestRouting} className="pay-request-button">
        Pay / Request
      </button>
      <NavLink className="navlink important-navlinks" to="/user/cards">
        Manage your Payment Methods
      </NavLink>
      <NavLink className="navlink important-navlinks" to="/user/incomplete">
        Pending Transacations
      </NavLink>
      <NavLink className="navlink important-navlinks" to="/user/groups">
        Groups
      </NavLink>
      {/* <NavLink className="navlink important-navlinks" to="/user/budgets">
        Budgets
      </NavLink> */}
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
      <AboutMe/>
    </nav>
  )
}

export default Navigation
