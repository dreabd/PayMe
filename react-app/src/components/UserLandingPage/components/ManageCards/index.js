import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCardsThunk } from "../../../../store/cards";
import { NavLink } from "react-router-dom";
import "./ManageCards.css"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ManageCards() {
  const dispatch = useDispatch()
  const history = useHistory()

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
        <div onClick={() => history.push(`/user/card/${card.id}`)} key={card.id} className="card-info-container">
          {/* <NavLink className="navlink" to={`/user/card/${card.id}`}> */}
          <div>
            <div className="card-info-top">
              <p>{card.bank_name}</p>
            </div>
            <div className="card-info-bot">
              <span>credit</span>
              <p>&#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022; {last_five}</p>
            </div>

          </div>
          {/* </NavLink> */}
        </div>
      )
    }
    return (
      <div onClick={() => history.push(`/user/card/${card.id}`)} key={card.id} className="card-info-container">
        {/* <NavLink className="navlink" to={`/user/card/${card.id}`}> */}
        <div>
          <div className="card-info-top">
            <p>{card.bank_name}</p>
          </div>

          <div className="card-info-bot">
            <span>credit</span>
            <p>&#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022; {last_four}</p>
          </div>

        </div>
        {/* </NavLink> */}
      </div >
    )
  })

  const addCardRedirect = e => {
    return history.push('/user/card/new')
  }

  return (
    <>
      <div className="manage-payment-container">
        <h2>Payment Methods</h2>
        {cards ? cards.length ? <div className="all-user-card-container">{cards}</div> : null : <h3>Loading...</h3>}

        <button onClick={addCardRedirect} className="add-card-button">
          <span onClick={addCardRedirect} >+</span> Add a Card
        </button>
      </div>

    </>
  )
}

export default ManageCards
