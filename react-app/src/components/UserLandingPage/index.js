import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { logout } from "../../store/session";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";


function UserLandingPage() {
  const dispatch = useDispatch()

  const user = useSelector(state=>state.session.user)


  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  if(!user){
    return <Redirect exact to="/"/>
  }
  return (
    <div>
      <button onClick={handleLogout}>
        Log Out
      </button>
      <h1>
        I am the {user.first_name}
      </h1>
    </div>
  )
}

export default UserLandingPage
