import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

import Navigation from "./components/Navigation";
import UserTransFeed from "./components/UserTransFeed";
import Incomplete from "./components/Incomplete";
import TransactionForm from "./components/TransactionForm";
import ManageCards from "./components/ManageCards";
import SingleCard from "./components/SingleCard";
import CardForm from "./components/CardForm";
import EditCard from "./components/EditCard";
import EditTransaction from "./components/EditTransaction";
import UserPage from "./components/UserPage";
import Groups from "./components/Groups";
import GroupPage from "./components/Groups/components/SingleGroup";

import "./UserLandingPage.css"

function UserLandingPage() {

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
          <Route exact path="/user/transaction/:id/edit">
            <EditTransaction />
          </Route>

          <Route exact path="/user/groups">
            <Groups/>
          </Route>
          <Route exact path="/user/groups/:id">
            <GroupPage/>
          </Route>

          <Route exact path="/user/budgets">
            Budget Place Holder
          </Route>

          <Route exact path="/user/cards">
            <ManageCards />
          </Route>
          <Route exact path="/user/card/new">
            <CardForm />
          </Route>
          <Route exact path="/user/card/:id">
            <SingleCard />
          </Route>
          <Route exact path="/user/card/:id/edit">
            <EditCard />
          </Route>

          <Route exact path="/user/incomplete">
            <Incomplete setUserLoad={setUserLoad} />
          </Route>

          <Route exact path="/user/:id">
            <UserPage />
          </Route>

          <Route>
            <Redirect to="/user" />
          </Route>
        </Switch>

      </BrowserRouter>

    </div>
  )
}

export default UserLandingPage
