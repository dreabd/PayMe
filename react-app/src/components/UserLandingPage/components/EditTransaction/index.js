import React, {useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import TransactionForm from "../TransactionForm";


function EditTransaction(){
  const {id} = useParams()
  const history = useHistory()

  const [updated,setUpdated] = useState(true)

  let singeTransaction = useSelector(state=>state.transaction.userTransactions.incompleted)
  console.log(singeTransaction[id])

  if(!Object.values(singeTransaction).length) history.push("/user/incomplete")
  return(
    <TransactionForm updated={updated} setUpdated={setUpdated}trans={singeTransaction[id]}/>
  )
}

export default EditTransaction
