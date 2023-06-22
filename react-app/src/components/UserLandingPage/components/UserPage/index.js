import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";

function UserPage() {
  const { id } = useParams()
  console.log(id)
  const user = useSelector(state => state.session.user)

  console.log(user.id === id)
  if (id == user.id) {
    return (
      <h1> yes</h1>
    )
  }
  
  return (
    <h1>
      No
    </h1>
  )
}

export default UserPage
