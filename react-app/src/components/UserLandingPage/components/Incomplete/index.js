import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTransactionThunk, getIncompleteUserTransactionsThunk, getPublicTransactionsThunk, putIncompleteTransactionThunk } from "../../../../store/transactions";
import { NavLink, Redirect, useHistory } from "react-router-dom/cjs/react-router-dom.min";

function Incomplete({ setUserLoad }) {
  const dispatch = useDispatch()
  const history = useHistory()

  const [errors, setErrors] = useState({})
  const [submited, setSubmited] = useState(false)

  useEffect(() => {
    dispatch(getIncompleteUserTransactionsThunk())
    dispatch(getPublicTransactionsThunk())
    setSubmited(false)
    // Would probably need to do the buttons for updating and delting somewhere here as well
  }, [dispatch, errors, submited])

  const incompleteTransactions = useSelector(state => state.transaction.userTransactions.incompleted)
  const user = useSelector(state => state.session.user)


  const incompleteTransactionsContainer = incompleteTransactions && Object.values(incompleteTransactions)?.map(trans => {
    const handlePayments = async e => {
      e.preventDefault()
      const data = await dispatch(putIncompleteTransactionThunk(trans.id))
      if (data) {
        setErrors(data)
      }
      setUserLoad(true)
    }

    const handleDelete = e => {
      e.preventDefault()
      const data = dispatch(deleteTransactionThunk(trans.id))
      if (data?.errors) {
        setErrors(data?.errors)
      }
      setSubmited(true)
    }

    const handleEdit = async e => {
      history.push(`/user/transaction/${trans.id}/edit`)
    }

    const formatDate = (dateString) => {
      if (!dateString) return;
      const date = new Date(dateString)
      return date.toLocaleString();
    }

    return (
        <div className="trans-card">
          <div className="top-incomplete-cont trans-card">
            <div className="left-trans">
              <div className="top-trans">
                {trans.payer.id === user.id ? "You owe" : <NavLink className="navlink important-navlinks"to={`/user/${trans.payer.id}`}>{trans.payer.first_name} {trans.payer.last_name}</NavLink>} owes {trans.requester.id === user.id ? "You" : `${trans.requester.first_name} ${trans.requester.last_name}`}
              </div>
              <div className="mid-trans">
                {formatDate(trans.created_at)}
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
            {trans.payer.id !== user.id && <button onClick={handleEdit}>Edit</button>}
            {trans.payer.id !== user.id && <button onClick={handleDelete}>Cancel</button>}
            {trans.payer.id === user.id && <button className="pay-incomplete-button" onClick={handlePayments}>Pay</button>}
          </div>
        </div>

    )
  })

  // console.log(incompleteTransactions)


  if (!user) return <Redirect exact to="/user" />
  return (
    <div className="all-trans-container">
      <h1>I am incomplete :c</h1>
      {<span className="errors">{errors["money"]}</span>}
      {incompleteTransactionsContainer}
      {!incompleteTransactionsContainer?.length && <h1>Start a New Transaction! </h1>}
    </div>
  )
}

export default Incomplete
