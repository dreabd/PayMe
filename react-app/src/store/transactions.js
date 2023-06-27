import { normalizeObj } from "./helpers"
import { getOtherUsers } from "./session"

//--------------------- Type Variables ---------------------
const GET_PUBLIC_TRANSACTIONS = "transaction/getPublicTransactions"
const GET_USER_TRANSACTIONS = "transaction/getUserTransactions"
const GET_INCOMPLETE_USER_TRANSACTIONS = "transaction/getIncompleteUserTransactions"

const GET_USER_TRANSACTIONS_DETAILS = "transaction/getUserTransactionsDetails"
const GET_FRIEND_TRANSACTIONS = "transaction/getFriendTransactions"
const GET_OTHER_TRANSACTIONS = "transaction/getOtherTransactions"

const POST_PAY_TRANSACTION = "transaction/postPayTransactions"
const POST_REQ_TRANSACTION = "transaction/postReqTransactions"

const PUT_SINGLE_TRANSACTION = "transaction/putSingleTransaction"
const PUT_INCOMPLETE_TRANSACTION = "transaction/putIncompleteTransaction"

const DELETE_TRANSACTIONS = "transaction/deleteTransaction"
//--------------------- Action Creators --------------------
const getPublicTransactions = (transactions) => {
  return {
    type: GET_PUBLIC_TRANSACTIONS,
    transactions
  }
}
const getUserTransactions = (transactions) => {
  return {
    type: GET_USER_TRANSACTIONS,
    transactions
  }
}

const getIncompleteUserTransactions = (transactions) => {
  return {
    type: GET_INCOMPLETE_USER_TRANSACTIONS,
    transactions
  }
}

const getUserTransactionsDetails = (transactions, allTransData, category) => {
  return {
    type: GET_USER_TRANSACTIONS_DETAILS,
    transactions,
    allTransData,
    category
  }
}
const getFriendTransactions = (transactions, friendTransactions) => {
  return {
    type: GET_FRIEND_TRANSACTIONS,
    transactions,
    friendTransactions,
  }
}

const getOtherTransactions = (transactions,) => {
  return {
    type: GET_OTHER_TRANSACTIONS,
    transactions,
  }
}

// const getSingleTransaction = (transaction) =>{
//   return{
//     type: GET_SINGLE_TRANSACTION,
//     transaction
//   }
// }


const postPayTransactions = (transaction) => {
  return {
    type: POST_PAY_TRANSACTION,
    transaction
  }
}
const postReqTransactions = (transaction) => {
  return {
    type: POST_REQ_TRANSACTION,
    transaction
  }
}

const putSingleTransaction = (transaction) => {
  return {
    type: PUT_SINGLE_TRANSACTION,
    transaction
  }
}

const putIncompleteTransaction = (transactionId) => {
  return {
    type: PUT_INCOMPLETE_TRANSACTION,
    transactionId
  }
}

const deleteTransaction = (transactionId) => {
  return {
    type: DELETE_TRANSACTIONS,
    transactionId
  }
}

//------------------------- THUNK --------------------------
export const getPublicTransactionsThunk = () => async dispatch => {
  const res = await fetch("/api/transactions/")

  if (res.ok) {
    const { transactions } = await res.json()
    dispatch(getPublicTransactions(transactions))
    return
  }
  else {
    // console.log("Probelm with loading transaction")
  }
}
export const getUserTransactionsThunk = () => async dispatch => {
  const res = await fetch("/api/transactions/user")

  if (res.ok) {
    const { transactions } = await res.json()
    dispatch(getUserTransactions(transactions))
    return
  }
  else {
    // console.log("Probelm with loading transaction")
  }
}
export const getIncompleteUserTransactionsThunk = () => async dispatch => {
  const res = await fetch("/api/transactions/user/incomplete")

  if (res.ok) {
    const { transactions } = await res.json()
    dispatch(getIncompleteUserTransactions(transactions))
    return
  }
  else {
    // console.log("Probelm with loading transaction")
  }
}

export const getUserTransactionsDetailsThunk = (id, user, friend) => async dispatch => {
  // console.log(id,user,friend)
  const res = await fetch(`/api/users/${id}/transactions`)

  if (res.ok) {
    if (user) {
      // console.log("user details.................................")
      const { transactions, allTransData, category } = await res.json()
      dispatch(getUserTransactionsDetails(transactions, allTransData, category))
      return
    }
    if (friend) {
      // console.log("friends.................................")
      const { user,transactions, friendTransactions } = await res.json()
      console.log(user)
      dispatch(getFriendTransactions(transactions, friendTransactions))
      dispatch(getOtherUsers(user))
      return
    }
    if(!friend && !user) {
      // console.log("random.................................")
      const { user,transactions } = await res.json()
      dispatch(getOtherTransactions(transactions))
      dispatch(getOtherUsers(user))
      return
    }
  }
}


// export const getSingleTransactionThunk = (id) => async dispatch =>{
//   const res = await fetch(`/api/transactions/`)
// }

export const postPayTransactionsThunk = (formData) => async dispatch => {
  // console.log("thunk do be thunking................")
  const res = await fetch("/api/transactions/pay", {
    method: "POST",
    body: formData
  })
  // console.log("res....................",res)

  if (res.ok) {
    // console.log("res indeed okay.......................")
    const { newTransaction } = await res.json()
    dispatch(postPayTransactions(newTransaction.id))
    return
  }
  else {
    const { errors } = await res.json()
    // console.log(errors)
    // console.log("Some Errors Occured")
    return errors
  }

}
export const postReqTransactionsThunk = (formData) => async dispatch => {
  // console.log("thunk do be thunking................")
  const res = await fetch("/api/transactions/req", {
    method: "POST",
    body: formData
  })
  // console.log("res....................",res)

  if (res.ok) {
    // console.log("res indeed okay.......................")
    const { newTransaction } = await res.json()
    dispatch(postReqTransactions(newTransaction))
    return
  }
  else {
    const { errors } = await res.json()
    // console.log("Some Errors Occured")
    return errors
  }
}

export const putSingleTransactionThunk = (formData, transId) => async dispatch => {
  const res = await fetch(`/api/transactions/${transId}`, {
    method: "PUT",
    body: formData
  })

  if (res.ok) {
    console.log("res indeed okay.......................")
    const { transaction } = await res.json()
    dispatch(putSingleTransaction(transaction))
    return
  }
  else {
    const { errors } = await res.json()
    console.log("Some Errors Occured")
    return errors
  }
}

export const putIncompleteTransactionThunk = (transId) => async dispatch => {
  const res = await fetch(`/api/transactions/${transId}/pay`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }
  })

  if (res.ok) {
    console.log("res indeed okay.......................")
    const { transaction } = await res.json()
    dispatch(putIncompleteTransaction(transaction.id))
    return
  }
  else {
    const { errors } = await res.json()
    console.log("Some Errors Occured")
    return errors
  }
}

export const deleteTransactionThunk = (transId) => async dispatch => {
  const res = await fetch(`/api/transactions/${transId}`, {
    method: "DELETE"
  })

  if (res.ok) {
    console.log("res indeed okay.......................")
    dispatch(deleteTransaction(transId))
    return
  }
  else {
    const { errors } = await res.json()
    console.log("Some Errors Occured")
    return errors
  }
}


//--------------------- Initial State ----------------------
const initialState = {
  publicTransactions: {},
  userTransactions: {
    details: {},
    completed: {},
    incompleted: {}
  },
  singleTransaction: {},
  friendTransactions: {},

}
//------------------------ Reducer -------------------------
const transactionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_PUBLIC_TRANSACTIONS:
      return { ...state, publicTransactions: { ...normalizeObj(action.transactions) } }
    case GET_USER_TRANSACTIONS:
      return { ...state, userTransactions: { completed: { ...normalizeObj(action.transactions) } } }
    case GET_INCOMPLETE_USER_TRANSACTIONS:
      return { ...state, userTransactions: { incompleted: { ...normalizeObj(action.transactions) } } }

    case GET_USER_TRANSACTIONS_DETAILS:
      console.log(action.category)
      return{
        ...state,
        userTransactions:{
          details:{...action.allTransData,category:{...action.category}},
          completed:{...normalizeObj(action.transactions)}
        }
      }
    case GET_OTHER_TRANSACTIONS:
      
      return { ...state, userTransactions: { completed: {...action.transactions } } }
    case GET_FRIEND_TRANSACTIONS:
      return {
        ...state,
        userTransactions: {
          completed: {
            ...normalizeObj(action.transactions)
          }
        },
        friendTransactions: {
          ...normalizeObj(action.friendTransactions)
        }
      }

    case PUT_SINGLE_TRANSACTION:
      newState = { ...state }
      newState.userTransactions.incompleted[action.transaction.id] = action.transaction
      return newState
    case PUT_INCOMPLETE_TRANSACTION:
      newState = { ...state }
      delete newState.userTransactions.incompleted[action.transactionId]
      return newState

    case DELETE_TRANSACTIONS:
      newState = { ...state }
      delete newState.publicTransactions[action.transactionId]
      delete newState.userTransactions.incompleted[action.transactionId]
      return newState


    // Going to force a refresh by redirecting to home instead
    // case POST_REQ_TRANSACTION:
    //   newState = {...state}
    //   if (!Object.values(newState.userTransactions.incompleted).length) {
    //     newState.userTransactions.incompleted = [action.funding]
    //   } else if (newState.userTransactions.incompleted) {
    //     newState.userTransactions.incompleted[action.transaction.id](action.transaction)
    //   }
    // case POST_PAY_TRANSACTION:
    //   newState = {...state}
    default:
      return state
  }
}

export default transactionReducer
