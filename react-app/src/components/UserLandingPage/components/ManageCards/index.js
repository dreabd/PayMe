import React, {useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCardsThunk } from "../../../../store/cards";
import { NavLink } from "react-router-dom";


function ManageCards() {
  const dispatch = useDispatch()

  const userCards = useSelector(state => state.card.userCards)

  useEffect(() => {
    dispatch(getUserCardsThunk())
  }, [dispatch])

  const cards = userCards && Object.values(userCards).map(card => {
    // console.log(String(card.card_number))
    let last_four = (String(card.card_number).substr(-4))
    let last_five = (String(card.card_number).substr(-5))
    // console.log("stuf...............", last_four)
    if (card.bank_name === "AMEX") {
      return (
        <div className="card-info-container">
          <NavLink className="navlink" to={`/user/card/${card.id}`}>
            <p>{card.bank_name}</p>
            <p>
              <span>credit</span>
              <p>&#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022;&#x2022; {last_five}</p>
            </p>
          </NavLink>
        </div>
      )
    }
    return (
      <div className="card-info-container">
        <NavLink className="navlink" to={`/user/card/${card.id}`}>
          <p>{card.bank_name}</p>
          <p>
            <span>credit</span>
            <p>&#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022; {last_four}</p>
          </p>
        </NavLink>
      </div>
    )
  })
  return (
    <div className="manage-payment-container">
      <h1>Payment Methods</h1>
      {cards ? <div className="all-user-card-container">
        {cards}
      </div>: <h3>Loading...</h3>}
      <button className="add-card-button">
        <NavLink className="navlink" to="/user/card/new">
          <span>+</span> Add a Card
        </NavLink>
      </button>
    </div>
  )
}

export default ManageCards
