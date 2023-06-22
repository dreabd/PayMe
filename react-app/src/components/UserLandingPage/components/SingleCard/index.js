import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCardThunk, getSingleCardThunk } from "../../../../store/cards";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import"./SingleCard.css"
function SingleCard() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams()

    const [errors, setErrors] = useState({})


    const singleCard = useSelector(state => state.card.singleCard)
    const user = useSelector(state=>state.session.user)

    useEffect(() => {
        dispatch(getSingleCardThunk(id))
    }, [dispatch,id])

    const handleDelete = async (e) => {
        const data = await dispatch(deleteCardThunk(id))
        if (data?.errors) {
            return setErrors(data.errors)
        } else {
            history.push("/user/cards")
        }
    }

    const editCard = e => {
        history.push(`/user/card/${id}/edit`)
    }

    const cards = singleCard && (
        <div className="single-card-container">
            <div className="top-single-card-info">
                <p>{singleCard.bank_name}</p>
            </div>
            <div className="bot-single-card-info">
                <p>{singleCard.card_number}</p>
            </div>

        </div>
    )

    if(!Object.values(singleCard).length) history.push("/user/cards")
    if(singleCard?.owner_id !== user?.id) history.push("/user/cards")
    return (
        <div className="single-card-details-container">
            {cards}
            <div className="card-buttons">
                {/* {Object.values(errors).length && <span className="errors">{errors.errors}</span>} */}
                <button onClick={handleDelete}> Remove Card</button>
                <button onClick={editCard}>Update Card</button>
            </div>
            <p className="errors">*Note, ALL the cards in this project are fake, I am not liable for any reprecussions if you were to use them. </p>
        </div>
    )
}

export default SingleCard
