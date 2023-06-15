import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIncompleteUserTransactionsThunk,getPublicTransactionsThunk } from "../../../../store/transactions";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

function Incomplete() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getIncompleteUserTransactionsThunk())
    dispatch(getPublicTransactionsThunk())
    // Would probably need to do the buttons for updating and delting somewhere here as well
  }, [dispatch])

  const incompleteTransactions = useSelector(state => state.transaction.userTransactions.incompleted)
  const user = useSelector(state => state.session.user)

  const incompleteTransactionsContainer = incompleteTransactions && Object.values(incompleteTransactions)?.map(trans => {
    return (
      <div className="trans-card">
        <div className="top-incomplete-cont trans-card">
          <div className="left-trans">
            <div className="top-trans">
              {trans.payer.id === user.id ? "You owe" : `${trans.payer.first_name} ${trans.payer.last_name} owes`}  {trans.requester.id === user.id ? "You" : `${trans.requester.first_name} ${trans.requester.last_name}`}
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
        <div className="button-containers">
          {trans.payer.id !== user.id && <button>Edit</button>}
          {trans.payer.id !== user.id && <button>Cancel</button>}
          {trans.payer.id === user.id && <button>Pay</button>}
        </div>
      </div>
    )
  })

  console.log(incompleteTransactions)


  if(!user) return <Redirect exact to="/user"/>
  return (
    <div className="all-trans-container">
      <h1>I am incomplete :c</h1>
      {incompleteTransactionsContainer}
    </div>
  )
}

export default Incomplete
