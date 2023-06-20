import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPublicTransactionsThunk, getUserTransactionsThunk } from "../../../../store/transactions";
import "./UserTransFeed.css"


function UserTransFeed() {
  const dispatch = useDispatch()

  // ---------Slice of State Selectors---------
  const allTransactions = useSelector(state => state.transaction.publicTransactions)
  const userTransactions = useSelector(state => state.transaction.userTransactions.completed)
  const user = useSelector(state => state.session.user)

  // ---------State Variables---------
  const [personal, setPersonal] = useState(false)

  // --------- Use Effect---------
  useEffect(() => {
    dispatch(getPublicTransactionsThunk())
    dispatch(getUserTransactionsThunk())
  }, [dispatch])

  // ----------Helper Functions----------

  const formatDate = (dateString) => {
    if (!dateString) return;
    const date = new Date(dateString)
    return date.toLocaleString();
  }

  const allTransactionsContainer = allTransactions && Object.values(allTransactions).reverse().map(trans => {
    return (
      <div className="trans-card">
        <div className="left-trans">
          <div className="top-trans">
            {trans.payer.id === user.id ? "You" : `${trans.payer.first_name} ${trans.payer.last_name}`} <span>paid</span> {trans.requester.id === user.id ? "You" : `${trans.requester.first_name} ${trans.requester.last_name}`}
          </div>
          <div className="mid-trans">
            {formatDate(trans.created_at)}
          </div>
          <div className="bot-trans">
            {trans.description}
          </div>
        </div>

        <div className="right-trans">
        {(trans.payer_id === user.id || trans.requester_id === user.id) ? trans.requester_id === user.id ? <span className="positive-trans">+${trans.money}</span> :  trans.payer_id === user.id ? <span className="negative-trans">-${trans.money}</span> : null : null}
        </div>

      </div>
    )
  })

  const togglePersonal = () => {
    setPersonal(!personal)
  }

  const userTransactionsContainer = userTransactions && Object.values(userTransactions)?.map(trans => {
    return (
      <div className="trans-card">
        <div className="left-trans">
          <div className="top-trans">
            {trans.payer.id === user.id ? "You" : `${trans.payer.first_name} ${trans.payer.last_name}`} <span>paid</span> {trans.requester.id === user.id ? "You" : `${trans.requester.first_name} ${trans.requester.last_name}`}
          </div>
          <div className="mid-trans">
            {formatDate(trans.created_at)}
          </div>
          <div className="bot-trans">
            {trans.description}
          </div>
        </div>

        <div className="right-trans">
          {(trans.payer_id === user.id || trans.requester_id === user.id) ? trans.requester_id === user.id ? <span className="positive-trans">+${trans.money}</span> :  trans.payer_id === user.id ? <span className="negative-trans">-${trans.money}</span> : null : null}
        </div>

      </div>
    )
  })



  return (
    <div className="trans-feed-container">
      <button className="toggle-button" onClick={togglePersonal}>
        {personal ? "Checkout All Transactions" : "Checkout Your Transactions"}
      </button>
      {(allTransactions && userTransactions) ?
        <div className="all-trans-container">
          <h3>{!personal ? "All Transactions" : "Personal Transactions"}</h3>
          {!personal ? allTransactionsContainer : userTransactionsContainer}
        </div> : <div className="all-trans-container"><h4>Loading...</h4></div>
      }


    </div>
  )
}


export default UserTransFeed
