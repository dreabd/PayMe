import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTransactionThunk, getIncompleteUserTransactionsThunk, getPublicTransactionsThunk, putIncompleteTransactionThunk } from "../../../../store/transactions";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

function Incomplete({setUserLoad}) {
  const dispatch = useDispatch()

  const [errors,setErrors] = useState({})
  const [submited,setSubmited] = useState(false)

  useEffect(() => {
    dispatch(getIncompleteUserTransactionsThunk())
    dispatch(getPublicTransactionsThunk())
    setSubmited(false)
    // Would probably need to do the buttons for updating and delting somewhere here as well
  }, [dispatch,errors,submited])

  const incompleteTransactions = useSelector(state => state.transaction.userTransactions.incompleted)
  const user = useSelector(state => state.session.user)


  const incompleteTransactionsContainer = incompleteTransactions && Object.values(incompleteTransactions)?.map(trans => {
    const handlePayments = async e => {
      const data  = await dispatch(putIncompleteTransactionThunk(trans.id))
      if(data?.errors){
        console.log(data.errors)
      }
      setSubmited(true)
      setUserLoad(true)
    }

    const handleDelete = e =>{
      const data = dispatch(deleteTransactionThunk(trans.id))
      if(data?.errors){
        setErrors(data?.errors)
      }
      setSubmited(true)
    }

    const handleEdit = async e =>{
      return alert("Feature coming soon")
    }
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
          <span className="errors">{errors["money"]}</span>
          {trans.payer.id !== user.id && <button onClick={handleEdit}>Edit</button>}
          {trans.payer.id !== user.id && <button onClick={handleDelete}>Cancel</button>}
          {trans.payer.id === user.id && <button onClick={handlePayments}>Pay</button>}
        </div>
      </div>
    )
  })

  // console.log(incompleteTransactions)


  if (!user) return <Redirect exact to="/user" />
  return (
    <div className="all-trans-container">
      <h1>I am incomplete :c</h1>
      {incompleteTransactionsContainer}
      {!incompleteTransactionsContainer?.length && <h1>Start a New Transaction! </h1>}
    </div>
  )
}

export default Incomplete
