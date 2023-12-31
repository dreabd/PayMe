import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CardForm from "../CardForm";
import { getSingleCardThunk } from "../../../../store/cards";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


function EditCard(){
  const dispatch = useDispatch()
  const history = useHistory()
  const { id } = useParams()

  const [update,setUpdate] = useState(false)

  const singleCard = useSelector(state => state.card.singleCard)
  const user = useSelector(state=>state.session.user)

  useEffect(() => {
      dispatch(getSingleCardThunk(id))
      setUpdate(true)
  }, [dispatch,id])

  // console.log("😊............................",user)
  // console.log("😊............................",singleCard)
  if(!Object.values(singleCard).length) history.push("/user/cards")
  if(singleCard?.owner_id !== user?.id) history.push("/user/cards")
  return (
    <CardForm card={singleCard} update={update}/>
  )
}


export default EditCard
