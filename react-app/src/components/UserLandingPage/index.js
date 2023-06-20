import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, Switch, BrowserRouter } from "react-router-dom";
import { authenticate } from "../../store/session";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

import Navigation from "./components/Navigation";
import UserTransFeed from "./components/UserTransFeed";
import Incomplete from "./components/Incomplete";
import TransactionForm from "./components/TransactionForm";
import ManageCards from "./components/ManageCards";
import SingleCard from "./components/SingleCard";
import CardForm from "./components/CardForm";
import EditCard from "./components/EditCard";

import "./UserLandingPage.css"

function UserLandingPage() {
  const dispatch = useDispatch()

  const user = useSelector(state => state.session.user)
  const [userLoad, setUserLoad] = useState(false);



  if (!user) {
    return <Redirect exact to="/" />
  }
  return (
    <div className="user-landing-container">
      <BrowserRouter>
      {<Navigation userLoad={userLoad} setUserLoad={setUserLoad} />}
        {/* {isLoaded && */}
        <Switch>
          <Route exact path="/user">
            <UserTransFeed />
          </Route>
          <Route exact path="/user/transaction">
            <TransactionForm setUserLoad={setUserLoad} />
          </Route>
          <Route exact path="/user/cards">
            <ManageCards/>
          </Route>
          <Route exact path="/user/card/new">
            <CardForm/>
          </Route>
          <Route exact path="/user/card/:id">
            <SingleCard/>
          </Route>
          <Route exact path="/user/card/:id/edit">
            <EditCard/>
          </Route>
          <Route exact path="/user/incomplete">
            <Incomplete setUserLoad={setUserLoad} />
          </Route>
          <Route exact path="/user/:id">
            {user.first_name}
          </Route>
          <Route>
            <Redirect to="/user"/>
          </Route>
        </Switch>

      </BrowserRouter>

    </div>
  )
}

export default UserLandingPage
