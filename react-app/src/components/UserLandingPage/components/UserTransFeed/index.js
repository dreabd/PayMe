import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPublicTransactionsThunk, getUserTransactionsThunk } from "../../../../store/transactions";
import "./UserTransFeed.css"
import { NavLink } from "react-router-dom";

// import Loading from "../Loading";
import { TransCard } from "./TransCard";

function UserTransFeed() {
  const dispatch = useDispatch()

  // ---------Slice of State Selectors---------
  const allTransactions = useSelector(state => state.transaction.publicTransactions)
  const userTransactions = useSelector(state => state.transaction.userTransactions.completed)
  const user = useSelector(state => state.session.user)

  // ---------State Variables---------
  const [personal, setPersonal] = useState(false)
  const [loading, setLoading] = useState(true)

  // --------- Use Effect---------
  useEffect(() => {
    dispatch(getPublicTransactionsThunk())
    dispatch(getUserTransactionsThunk())
    setTimeout(() => {
      setLoading(false)
    }, 500);
  }, [dispatch])

  // ----------Helper Functions----------

  const formatDate = (dateString) => {
    if (!dateString) return;
    const date = new Date(dateString)
    return date.toLocaleString();
  }


  const allTransactionsContainer = allTransactions && TransCard(Object.values(allTransactions),user.id)

  const togglePersonal = () => {
    setPersonal(!personal)
  }

  const userTransactionsContainer = userTransactions && TransCard(Object.values(userTransactions),user.id)

  if (loading) {
    return(
      <h4 className="trans-feed-container">
        Loading...
      </h4>
    )
    // return(<Loading/>)
  }

  return (
    <div className="trans-feed-container">
      <button className="toggle-button" onClick={togglePersonal}>
        {personal ? "Checkout All Transactions" : "Checkout Your Transactions"}
      </button>

      <div className="all-trans-container">
        <h3>{!personal ? "All Transactions" : "Personal Transactions"}</h3>
        {!personal ? allTransactionsContainer : userTransactionsContainer}
      </div>

    </div>
  )
}


export default UserTransFeed
