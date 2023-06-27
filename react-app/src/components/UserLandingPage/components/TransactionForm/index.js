import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory,useLocation } from "react-router-dom";
import { getCategoriesThunk } from "../../../../store/categories";
import { getAllUsersThunk } from "../../../../store/session";
import { postPayTransactionsThunk, postReqTransactionsThunk,putSingleTransactionThunk} from "../../../../store/transactions";

import "./TransactionForm.css"

function TransactionForm({ setUserLoad, trans, updated, setUpdated }) {
  const dispatch = useDispatch();
  const history = useHistory()
  const location = useLocation()

  const [description, setDescription] = useState(trans?.description || "")
  const [publics, setPublics] = useState(trans?.public || false)
  const [name, setName] = useState(trans?.payer.id || location.state.id || "")
  const [money, setMoney] = useState(trans?.money || 0)
  const [category, setCategory] = useState(trans?.category.id || "")
  const [errors, setErrors] = useState({})

  const [pay, setPay] = useState(false)
  const [request, setRequest] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const categories = useSelector(state => state.category.categories);
  const users = useSelector(state => state.session.allUsers)
  const current = useSelector(state => state.session.user)

  useEffect(() => {
    // Fetch category and user data
    dispatch(getCategoriesThunk())
    dispatch(getAllUsersThunk())
  }, [dispatch])

  useEffect(() => {
    const err = {}

    if (!description.trim().length) err["description"] = "Please provide a valid description"
    if (description.length > 50) err["description"] = "Descriptions are limited to 50 characters  "
    if (money <= 0) err["money"] = "Please provide a valid amout"
    if (!name) err["name"] = "Please select a user"
    if (!category) err["category"] = "Please select a category"

    setErrors(err)

  }, [description, name, money, category,submitted])

  const handleTransactionSubmit = async (e) => {
    e.preventDefault()

    setSubmitted(true)

    if (Object.values(errors).length) return

    const formData = new FormData()

    if (pay) {
      formData.append("requester_id", name)
      formData.append("payer_id", current.id)
    }

    if (request) {
      formData.append("requester_id", current.id)
      formData.append("payer_id", name)
    }

    formData.append("description", description)
    formData.append("public", publics)
    formData.append("money", money)
    formData.append("category_id", category)

    // for (let key of formData.entries()) {
    //   console.log(key[0] + ' ----> ' + key[1])
    // }


    if (request) {
      const data = await dispatch(postReqTransactionsThunk(formData))
      if (data) {
        return setErrors(data)
      }
      history.push("/user")
    }
    if (pay) {
      setUserLoad(true)
      const data = await dispatch(postPayTransactionsThunk(formData))
      if (data) {
        console.log(data)
        return setErrors(data)
      }
      history.push("/user")
    }


  }

  const updateTransaction = async (e) => {
    e.preventDefault()

    setSubmitted(true)

    if (Object.values(errors).length) return

    const formData = new FormData()

    formData.append("description", description)
    formData.append("public", publics)
    formData.append("money", money)
    formData.append("category_id", category)

    const data = await dispatch(putSingleTransactionThunk(formData,trans?.id))
    if (data) {
      return setErrors(data)
    }
    history.push("/user/incomplete")

  }


  const userIsPaying = (e) => {
    e.preventDefault()
    setPay(true)
  }
  const transactionIsCanceled = (e) => {
    e.preventDefault()
    setPay(false)
    setRequest(false)
    setSubmitted(false)
  }
  const userIsRequesting = (e) => {
    e.preventDefault()
    setRequest(true)
  }


  return (
    <div className="trans-form-container">
      <form className="trans-form" onSubmit={!updated ? handleTransactionSubmit : updateTransaction}>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Money
          {submitted && <span className='errors'>{errors.money}</span>}
          <input
            type="number"
            value={money}
            onChange={e => setMoney(e.target.value)}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }} >
          To Whom {submitted && <span className='errors'>{errors.name}</span>}
          <select
            value={name}
            onChange={(e) => setName(e.target.value)}>
            <option default>Select a User</option>
            {users && Object.values(users).map(user => {
              if (user.id !== current.id) {
                return (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>)
              } else {
                return (null)
              }
            })}
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Description  {submitted && <span className='errors'>{errors.description}</span>}
          <textarea
            type='text'
            value={description}
            placeholder='Project Description'
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="public-checkbox">
          Public
          <input
            type="checkbox"
            value={publics}
            checked={publics}
            onChange={e => { setPublics(!publics) }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column" }}>
          Category {submitted && <span className='errors'>{errors.category}</span>}
          {submitted && <span className='errors'>{errors.category_id}</span>}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <option default>Select a Category</option>
            {categories && Object.values(categories).map(category => (
              <option key={category.id} value={category.id}>
                {category.type}
              </option>
            ))}
          </select>
        </label>

        {!updated && !pay && !request && <button className="pay-request-button" onClick={userIsPaying}> Pay </button>}
        {!updated && !request && !pay && <button className="pay-request-button" onClick={userIsRequesting}> Request </button>}

        {!updated && pay &&
          <div className="pay-request-button-container">
            <button type="submit">
              Pay {users[name]?.first_name} ${money}
            </button>
            <button onClick={transactionIsCanceled}>
              Cancel
            </button>
          </div>
        }

        {!updated && request &&
          <div className="pay-request-button-container">
            <button type="submit">
              Request ${money} from {users[name]?.first_name}
            </button>
            <button onClick={transactionIsCanceled}>
              Cancel
            </button>
          </div>
        }

        {updated && <button className="pay-request-button" > Update </button>}
      </form>

    </div>
  )
}

export default TransactionForm
