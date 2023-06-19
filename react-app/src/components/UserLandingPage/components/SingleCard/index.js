import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCardThunk, getSingleCardThunk } from "../../../../store/cards";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


function SingleCard() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams()

    const [errors,setErrors] = useState({})


    const singleCard = useSelector(state => state.card.singleCard)

    useEffect(() => {
        dispatch(getSingleCardThunk(id))
    }, [dispatch])

    const handleDelete = async (e) =>{
        const data = await dispatch(deleteCardThunk(id))
        if(data?.errors){
            return setErrors(data.errors)
        }else{
            history.push("/user/cards")
        }
    }

    const editCard = e =>{
        history.push(`/user/card/${id}/edit`)
    }

    const cards = singleCard && (
        <div>
            <p>{singleCard.bank_name}</p>
            <p>{singleCard.card_number}</p>
            <button onClick={handleDelete}> Remove Card</button>
            <button onClick={editCard}>Update Card</button>
        </div>
    )
    return (
        <div>
            {cards}
        </div>
    )
}

export default SingleCard
