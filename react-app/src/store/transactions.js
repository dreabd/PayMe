import { normalizeObj } from "./helpers"

//--------------------- Type Variables ---------------------
const GET_PUBLIC_TRANSACTIONS = "transaction/getPublicTransactions"
const GET_USER_TRANSACTIONS = "transaction/getUserTransactions"
const GET_INCOMPLETE_USER_TRANSACTIONS = "transaction/getIncompleteUserTransactions"

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
    default:
      return state
    }
  }

  export default transactionReducer
