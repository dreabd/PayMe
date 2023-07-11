import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPublicTransactionsThunk, getUserTransactionsThunk } from "../../../../store/transactions";
import "./UserTransFeed.css"

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
  const [isPublic, setIsPublic] = useState(true)
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
  const allTransactionsContainer = allTransactions && TransCard(Object.values(allTransactions), user.id)

  const togglePersonal = () => {
    setPersonal(true)
    setIsPublic(false)
  }

  const toggglePublic = () => {
    setPersonal(false)
    setIsPublic(true)
  }

  const publicClassName = "toggle-button" + (personal ? " " : " current");
  const personClassName = "toggle-button" + (isPublic ? " " : " current");

  const userTransactionsContainer = userTransactions && TransCard(Object.values(userTransactions), user.id)

  if (loading) {
    return (
      <h4 className="trans-feed-container">
        Loading...
      </h4>
    )
    // return(<Loading/>)
  }



  return (
    <div className="trans-feed-container">

      <div className="toggle-button-container">
        <button className={publicClassName} onClick={toggglePublic}><i class="fa-solid fa-globe"></i></button>
        <button className={personClassName} onClick={togglePersonal}><i class="fa-solid fa-user"></i></button>
      </div>


      <div className="all-trans-container">
        <h3>{!personal ? "All Transactions" : "Personal Transactions"}</h3>
        {!personal ? allTransactionsContainer : userTransactionsContainer}
      </div>

    </div>
  )
}


export default UserTransFeed
