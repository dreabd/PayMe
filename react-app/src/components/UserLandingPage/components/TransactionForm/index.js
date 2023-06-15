import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { getCategoriesThunk } from "../../../../store/categories";
import { getAllUsersThunk } from "../../../../store/session";

function TransactionForm() {
  const dispatch = useDispatch();

  const [description, setDescription] = useState("")
  const [publics, setPublics] = useState(false)
  const [name, setName] = useState("")
  const [money, setMoney] = useState(0)
  const [category, setCategory] = useState("")
  const [errors, setErrors] = useState({})

  const [pay, setPay] = useState(false)
  const [request, setRequest] = useState(false)

  const categories = useSelector(state => state.category.categories);
  const users = useSelector(state => state.session.allUsers)

  useEffect(() => {
    // Fetch category data
    dispatch(getCategoriesThunk())
    dispatch(getAllUsersThunk())
  }, [dispatch])


  const userIsPaying = (e) => {
    e.preventDefault()
    setPay(true)
  }
  const transactionIsCanceled = (e) => {
    e.preventDefault()
    setPay(false)
    setRequest(false)
  }

  const userIsRequesting = (e) => {
    e.preventDefault()
    setRequest(true)
  }
  return (
    <div>
      <h1>I am the transaction form</h1>
      <form action="">
        <label >
          Money <span className='errors'>{errors.money}</span>
          <span className="dollar-sign">$</span>
          <input
            type="number"
            value={money}
            // placeholder="Amount to Pledge"
            onChange={e => setMoney(e.target.value)}
          />
        </label>
        <label >
          To Whom <span className='errors'>{errors.money}</span>
          <select
            value={name}
            onChange={(e) => setName(e.target.value)}>
            <option default>Select a User</option>
            {users && Object.values(users).map(user => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description  <span className='errors'>{errors.description}</span>
          <input
            type='text'
            value={description}
            placeholder='Project Description'
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Category <span className='errors'>{errors.category}</span>
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

        {!pay && !request && <button onClick={userIsPaying}> Pay </button>}
        {!request && !pay && <button onClick={userIsRequesting}> Request </button>}

        {pay &&
          <div>
            <button type="submit">
              Pay
            </button>
            <button onClick={transactionIsCanceled}>
              Cancel
            </button>
          </div>
        }

        {request &&
          <div>
            <button type="submit">
              Request
            </button>
            <button onClick={transactionIsCanceled}>
              Cancel
            </button>
          </div>
        }
      </form>

    </div>
  )
}

export default TransactionForm
