import { combineReducers } from "redux"
import { normalizeObj } from "./helpers"

//--------------------- Type Variables ---------------------
const GET_PUBLIC_TRANSACTIONS = "transaction/getPublicTransactions"
const GET_USER_TRANSACTIONS = "transaction/getUserTransactions"
const GET_INCOMPLETE_USER_TRANSACTIONS = "transaction/getIncompleteUserTransactions"

const POST_PAY_TRANSACTION = "transaction/postPayTransactions"
const POST_REQ_TRANSACTION = "transaction/postReqTransactions"

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

const getIncompleteUserTransactions = (transactions) =>{
  return{
    type:GET_INCOMPLETE_USER_TRANSACTIONS,
    transactions
  }
}
const postPayTransactions = (transaction) =>{
  return{
    type: POST_PAY_TRANSACTION,
    transaction
  }
}
const postReqTransactions = (transaction) =>{
  return{
    type: POST_REQ_TRANSACTION,
    transaction
  }
}

const putIncompleteTransaction = (transactionId) =>{
  return{
    type:PUT_INCOMPLETE_TRANSACTION,
    transactionId
  }
}

const deleteTransaction = (transactionId) =>{
  return{
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
    console.log("Probelm with loading transaction")
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
    console.log("Probelm with loading transaction")
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
    console.log("Probelm with loading transaction")
  }
}

export const postPayTransactionsThunk = (formData) => async dispatch =>{
  console.log("thunk do be thunking................")
  const res = await fetch("/api/transactions/pay",{
    method:"POST",
    body: formData
  })
  console.log("res....................",res)

  if(res.ok){
    console.log("res indeed okay.......................")
    const {newTransaction} = await res.json()
    dispatch(postPayTransactions(newTransaction.id))
    return
  }
  else{
    const {errors} = await res.json()
    console.log(errors)
    console.log("Some Errors Occured")
    return errors
  }

}
export const postReqTransactionsThunk = (formData) => async dispatch =>{
  console.log("thunk do be thunking................")
  const res = await fetch("/api/transactions/req",{
    method:"POST",
    body: formData
  })
  console.log("res....................",res)

  if(res.ok){
    console.log("res indeed okay.......................")
    const {newTransaction} = await res.json()
    dispatch(postReqTransactions(newTransaction))
    return
  }
  else{
    const {errors} = await res.json()
    console.log("Some Errors Occured")
    return errors
  }
}

export const putIncompleteTransactionThunk = (transId) => async dispatch =>{
  const res = await fetch(`/api/transactions/${transId}/pay`,{
    method: "PUT",
    headers: {"Content-Type": "application/json"}
  })

  if(res.ok){
    console.log("res indeed okay.......................")
    const {transaction} = await res.json()
    dispatch(putIncompleteTransaction(transaction.id))
    return
  }
  else{
    const {errors} = await res.json()
    console.log("Some Errors Occured")
    return errors
  }
}

export const deleteTransactionThunk = (transId) => async dispatch =>{
  const res = await fetch(`/api/transactions/${transId}`,{
    method: "DELETE"
  })

  if(res.ok){
    console.log("res indeed okay.......................")
    dispatch(deleteTransaction(transId))
    return
  }
  else{
    const {errors} = await res.json()
    console.log("Some Errors Occured")
    return errors
  }
}


//--------------------- Initial State ----------------------
const initialState = { publicTransactions: {}, userTransactions: {completed:{},incompleted:{}}, singleTransaction: {} }
//------------------------ Reducer -------------------------
const transactionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type){
    case GET_PUBLIC_TRANSACTIONS:
      return {...state,publicTransactions:{...normalizeObj(action.transactions)}}
    case GET_USER_TRANSACTIONS:
      return {...state,userTransactions:{completed:{...normalizeObj(action.transactions)}}}
    case GET_INCOMPLETE_USER_TRANSACTIONS:
      return {...state,userTransactions:{incompleted:{...normalizeObj(action.transactions)}}}
    case PUT_INCOMPLETE_TRANSACTION:
      newState = {...state}
      delete newState.userTransactions.incompleted[action.transactionId]
      return newState
    case DELETE_TRANSACTIONS:
      newState = {...state}
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