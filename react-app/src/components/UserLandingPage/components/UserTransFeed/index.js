import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPublicTransactionsThunk, getUserTransactionsThunk } from "../../../../store/transactions";
import "./UserTransFeed.css"


function UserTransFeed() {
  const dispatch = useDispatch()

  // ---------Slice of State Selectors---------
  const allTransactions = useSelector(state => state.transaction.publicTransactions)
  const userTransactions = useSelector(state => state.transaction.userTransactions.completed)
  const user = useSelector(state=> state.session.user)

  // ---------State Variables---------
  const [personal, setPersonal] = useState(false)

  // --------- Use Effect---------
  useEffect(() => {
    dispatch(getPublicTransactionsThunk())
    dispatch(getUserTransactionsThunk())
  }, [dispatch])

  // ----------Helper Functions----------
  const allTransactionsContainer =allTransactions && Object?.values(allTransactions)?.map(trans => {
    return (
      <div className="trans-card">
        <div className="left-trans">
          <div className="top-trans">
          {trans.payer.id === user.id ? "You" : `${trans.payer.first_name} ${trans.payer.last_name}`} <span>paid</span> {trans.requester.id === user.id ? "You" : `${trans.requester.first_name} ${trans.requester.last_name}`}
          </div>
          <div className="mid-trans">
            {trans.created_at}
          </div>
          <div className="bot-trans">
            {trans.description}
          </div>
        </div>

        <div className="right-trans">
          ${trans.money}
        </div>

      </div>
    )
  })

  const togglePersonal = () => {
    setPersonal(!personal)
  }

  const userTransactionsContainer =userTransactions && Object.values(userTransactions)?.map(trans => {
    return (
      <div className="trans-card">
        <div className="left-trans">
          <div className="top-trans">
            {trans.payer.id === user.id ? "You" : `${trans.payer.first_name} ${trans.payer.last_name}`} <span>paid</span> {trans.requester.id === user.id ? "You" : `${trans.requester.first_name} ${trans.requester.last_name}`}
          </div>
          <div className="mid-trans">
            {trans.created_at}
          </div>
          <div className="bot-trans">
            {trans.description}
          </div>
        </div>

        <div className="right-trans">
          ${trans.money}
        </div>

      </div>
    )
  })



  return (
    <div className="trans-feed-container">
      <button className="toggle-button" onClick={togglePersonal}>
        {personal ? "Checkout All Transactions" : "Checkout Your Transactions"}
      </button>
      {(allTransactions && userTransactions)?
        <div className="all-trans-container">
          <h3>{!personal ? "All Transactions" : "Personal Transactions" }</h3>
          {!personal ? allTransactionsContainer : userTransactionsContainer}
        </div> : `Loading bitch`
      }


    </div>
  )
}


export default UserTransFeed
