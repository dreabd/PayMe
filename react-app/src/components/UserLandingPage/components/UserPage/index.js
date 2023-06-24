import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";

function UserPage() {
  const { id } = useParams()
  const dispatch = useDispatch()



  const user = useSelector(state => state.session.user)
  const friendTransactions = useSelector(state => state.transaction.friendTransactions)
  const userTransactions = useSelector(state => state.transaction.userTransactions.completed)

  console.log(userTransactions)

  const user_friends = user && user.friends.map(friend => friend.id)
  console.log(user_friends)

  useEffect(()=>{
    // if it is a random person just show transactions that are public 
    if(!user_friends.includes(id)){
      
    }
    // if it is the user then dispatch a thunk that gets all the user's completed transaction 
    if(id ==  user.id){
      
    }
    
    // if it is a friend dipatch a thunk that gets the friends' public trans and trans between the user and the friend
    if(id in user_friends){

    }
  },[dispatch])


  if (id == user.id) {
    return (
      <div>
        {/* Here I want to show all of their transactions */}
        {/* If it is the user's peronsal page then want to show the budget / spending habits */}
      </div>
    )
  }
  
  return (
    <div> 
      {/* Here if want to show the name of the perosn, if they are a friend, their transactions, and the transaction between the current user and the friend */}
      {/* If they are not a friend then show not a friend and only the public transactions. */}
    </div>
  )
}

export default UserPage
