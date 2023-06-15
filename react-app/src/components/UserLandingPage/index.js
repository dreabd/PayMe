import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, Switch,BrowserRouter } from "react-router-dom";
import { logout } from "../../store/session";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

import Navigation from "./components/Navigation";
import UserTransFeed from "./components/UserTransFeed";

import "./UserLandingPage.css"

function UserLandingPage() {
  const dispatch = useDispatch()

  const user = useSelector(state => state.session.user)
  if (!user) {
    return <Redirect exact to="/" />
  }
  return (
    <div className="user-landing-container">
      <BrowserRouter>
        <Navigation />
        <Switch>
          <Route exact path="/user">
            <UserTransFeed />
          </Route>
          <Route exact path="/user/transaction">
            <h1> Placeholder for user/transaction</h1>
          </Route>
          <Route exact path="/user/cards">
            <h1> Placeholder for user/cards</h1>
          </Route>
        </Switch>

      </BrowserRouter>

    </div>
  )
}

export default UserLandingPage
