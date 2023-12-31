import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";

import { getUserTransactionsDetailsThunk } from "../../../../store/transactions";
import { authenticate } from "../../../../store/session";

import { TransCard } from "../UserTransFeed/TransCard";
import TransDetails from "./TransDetails";

import "./UserPage.css"

function UserPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()

  // -----------------State Variable------------------
  const [friend, isFriend] = useState(false)
  const [between, setBetween] = useState(false)
  const [loading, isLoading] = useState(false)
  const [error,setErrors] = useState({})


  // -----------------Use Selectors------------------
  const user = useSelector(state => state.session.user)
  const otherUser = useSelector(state => state.session.otherUser)
  const friendTransactions = useSelector(state => state.transaction.friendTransactions)
  const userTransactions = useSelector(state => state.transaction.userTransactions.completed)
  const userTransactionDetails = useSelector(state => state.transaction.userTransactions.details)
  const userTransactionStats = useSelector(state => state.transaction.userTransactions.details?.stats)

  const user_friends = user && user.friends.map(friend => {
    // console.log(friend.id === Number(id))
    return friend.id
  })
  // console.log(user_friends)
  // console.log(id)
  // console.log("type...............................", typeof id)
  // console.log(user_friends.includes(Number(id)))
  // console.log(Number(id) in user_friends)
  // console.log(user_friends)

  useEffect(async () => {
    const timer =setTimeout(() => {
      isLoading(true)
    }, 1200)
    // if it is the user then dispatch a thunk that gets all the user's completed transaction \
    if (id == user.id) {
      let user = await dispatch(getUserTransactionsDetailsThunk(id, true, false))
      user && setErrors({user})
      return
    }
    // if it is a friend dipatch a thunk that gets the friends' public trans and trans between the user and the friend
    if (user_friends.includes(Number(id))) {
      // console.log("friend....................")
      let user = await dispatch(getUserTransactionsDetailsThunk(id, false, true))
      user && setErrors({user})
      isFriend(true)
      return
    }
    // if it is a random person just show transactions that are public
    else {
      // console.log("Not friend....................")
      let user = await dispatch(getUserTransactionsDetailsThunk(id, false, false))
      user && setErrors({user})
      return 
    }
  }, [dispatch, id,loading])


  const addFriend = async (e) => {
    const res = await fetch(`/api/friends/${id}`, {
      method: "POST"
    })
    if (res.ok) {
      dispatch(getUserTransactionsDetailsThunk(id, false, true))
      dispatch(authenticate())
      isFriend(true)
      return
    }
    else {
      const { error } = await res.json()
      console.log(error)
    }

  }

  const removeFriend = async e => {
    const res = await fetch(`/api/friends/${id}`, {
      method: "DELETE"
    })
    if (res.ok) {
      dispatch(getUserTransactionsDetailsThunk(id, false, false))
      dispatch(authenticate())
      isFriend(false)
      return
    }
    else {
      const { error } = await res.json()
      console.log(error)
    }

  }

  if (!loading) return (<h4 className="trans-feed-container">Loading...</h4>)

  // if (!otherUser.id && loading && !user.id) history.push('/user')

  if (loading && id == user.id && userTransactions) {
    return (
      <TransDetails stats={userTransactionStats} trans={Object.values(userTransactions)} transDetails={userTransactionDetails} />
    )
  }
  
  // THERE IS A BUG HERE
  if (Object.values(error).length) {
    history.push('/user')
  }

  return (
    <div className="trans-feed-container">
      <div className="other-user-info-container">
        <div>
          <p>{otherUser.first_name}, {otherUser.last_name}</p>
          <p className="username">
            @{otherUser.username}
          </p>
          {friend ?
            <div>
              <p className="username">
                ✔Friends
              </p>
              <button className="remove-friend-button" onClick={removeFriend}>
                Remove Friend
              </button>
            </div> :
            <button className="add-friend-button" onClick={addFriend}>
              <p>Add Friend</p>
            </button>}
        </div>

        <button onClick={() => { history.push("/user/transaction", { id: otherUser.id, friend: true }) }} className="pay-request-button">
          Pay / Request
        </button>
      </div>

      {/* Here if want to show the name of the perosn, if they are a friend, their transactions, and the transactions between the current user and the friend */}
      {/* If they are not a friend then show not a friend and only the public transactions. */}
      {friend &&
        <button className="toggle-button" onClick={() => setBetween(!between)}>
          {!between ? `${otherUser.first_name}'s Transactions` : `Friend Transactions`}
        </button>
      }
      <div className="all-trans-container">
        {friend ?
          <h3>{between ? `All of ${otherUser.first_name}'s Transactions` : `Transactions between You and ${otherUser.first_name}`}</h3> :
          <h3>All Transactions</h3>
        }
        {
          friend ?
            between ? TransCard(Object.values(userTransactions), user.id) : TransCard(Object.values(friendTransactions), user.id) :
            TransCard(Object.values(userTransactions), user.id)
        }
      </div>
    </div>
  )
}

export default UserPage
